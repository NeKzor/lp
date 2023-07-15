use std::collections::HashSet;
use std::fs;
use std::io::Write;

use chrono::Local;
use env_logger::Builder;
use log::{error, info, LevelFilter};
use retry::delay::Fixed;
use retry::retry;

mod models;
use models::database::*;

mod stages;
use stages::exporting::*;
use stages::fetching::*;
use stages::filtering::*;
use stages::pre_fetching::*;
use crate::models::steam::SteamId;

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let _ = fs::create_dir_all("./api/profiles/").expect("couldn't create ./api/profiles/");
    let _ = fs::create_dir_all("./tmp/").expect("couldn't create ./tmp/");

    let (records, stats) = get_records();

    let mut player_ids = HashSet::<SteamId>::new();
    let mut api_records = models::api::Records::new();
    let mut player_cache = PlayerCache::new("./tmp/profiles.json");

    for record in records.iter()
     /* .filter(|record| record.name == "Portal Gun" || record.name == "Doors") */
     /* .filter(|record| record.campaign == Campaign::Cooperative) */
    {
        info!("processing map {}", record.name);

        let mut start = 0;
        let mut end = 5000;

        let mut fetch_page = true;
        let mut ties = 0;

        while fetch_page {
            let result = retry(Fixed::from_millis(30 * 1000), || {
                match fetch_entries(record.id, start, end) {
                    Ok(leaderboard) => {
                        fetch_page = leaderboard.needs_another_page(&record);

                        let entries = leaderboard.entries.value;

                        if fetch_page {
                            start = end + 1;
                            end = start + 5000;
                        } else if start != 0 {
                            let mut last_index: usize = 5000;
                            let limit = record.get_limit();

                            for (index, entry) in entries.iter().enumerate() {
                                if entry.score.value > limit {
                                    last_index = index;
                                    break;
                                }
                            }

                            if last_index < 5000 {
                                ties += update_entries(
                                    &record,
                                    &entries.as_slice()[..last_index],
                                    &mut player_ids,
                                    &mut player_cache,
                                );
                            }

                            return Ok(());
                        }

                        ties += update_entries(
                            &record,
                            &entries.as_slice(),
                            &mut player_ids,
                            &mut player_cache,
                        );

                        Ok(())
                    }
                    Err(oops) => {
                        error!("{}", oops);
                        Err("fetch failed, will retry in 30 seconds")
                    }
                }
            });

            assert!(result.is_ok());
        }

        api_records.maps.push(models::api::Map::new(&record, ties));
    }
    let filtered_player_ids = filter_players(&player_ids, &mut player_cache);

    export_all(&filtered_player_ids, &stats, &records, &mut api_records, &mut player_cache);

    player_cache.save("./tmp/profiles.json");

    Ok(())
}

fn main() {
    std::env::var("STEAM_API_KEY").expect("env var STEAM_API_KEY not set");

    Builder::new()
        .format(|buf, record| {
            let mut local_style = buf.style();
            local_style.set_color(env_logger::fmt::Color::Rgb(171, 171, 171));

            let level_style = buf.default_level_style(record.level());

            writeln!(
                buf,
                "{} [{}] - {}",
                local_style.value(Local::now().format("%Y-%m-%d %H:%M:%S")),
                level_style.value(record.level()),
                record.args()
            )
        })
        .filter(None, LevelFilter::Info)
        .init();

    use job_scheduler::{Job, JobScheduler};
    use std::time::Duration;

    let mut scheduler = JobScheduler::new();

    if let Some(arg) = std::env::args().collect::<Vec<String>>().get(1) {
        match arg.as_str() {
            "-n" | "--now" => match std::panic::catch_unwind(run) {
                Ok(_) => info!("done"),
                Err(oops) => error!("{:#?}", oops),
            },
            _ => {
                println!("valid args: -n, --now = updates now and schedules");
                std::process::exit(0);
            }
        }
    }

    // Note: UTC only
    scheduler.add(Job::new(
        "0 0 * * * * *".parse().unwrap(),
        || match std::panic::catch_unwind(run) {
            Ok(_) => info!("done"),
            Err(oops) => error!("{:#?}", oops),
        },
    ));

    loop {
        scheduler.tick();
        std::thread::sleep(Duration::from_millis(500));
    }
}
