use std::collections::HashSet;

use log::{error, info, warn};
use rayon::prelude::*;
use serde_xml_rs::from_reader;

use crate::models::database::*;
use crate::models::repository::*;
use crate::models::steam::*;

pub fn fetch_entries(
    id: i32,
    start: i32,
    end: i32,
) -> Result<Leaderboards, Box<dyn std::error::Error>> {
    let url = format!(
        "https://steamcommunity.com/stats/{game}/leaderboards/{id}?xml=1&start={start}&end={end}",
        game = "Portal2",
        id = id,
        start = start,
        end = end
    );

    let text = reqwest::blocking::get(&url)?.text()?;
    let leaderboard: Leaderboards = from_reader(text.as_bytes())?;

    info!(
        "fetched {} entries on {} ({}-{})",
        leaderboard.result_count.value, id, start, end
    );

    Ok(leaderboard)
}

pub fn update_entries(record: &Record, entries: &[Entry], player_ids: &mut HashSet<String>) -> i32 {
    let update_ids = record.name == "Portal Gun" || record.name == "Doors";

    use std::sync::Mutex;

    let ids = Mutex::new(player_ids);
    let wr_ties = Mutex::new(0);

    entries.par_iter().chunks(1000).for_each(|entries| {
        for entry in entries {
            let name = format!("./tmp/{}", entry.steam_id.value);

            let mut player = {
                if let Some(player) = Player::find(&name) {
                    player
                } else {
                    let mut player = Player::default();
                    player.id = entry.steam_id.value.clone();
                    player
                }
            };

            if player.is_banned {
                continue;
            }

            let mut new_score = entry.score.value;

            if !entry.is_valid(&record) {
                if let Some(ov) = record
                    .overrides
                    .iter()
                    .find(|ov| ov.id == record.id && ov.player == entry.steam_id.value)
                {
                    new_score = ov.score;
                } else {
                    player.is_banned = true;
                    warn!("Auto-banned player {} (score: {})", player.id, new_score);
                }
            }

            if let Some(mut score) = player
                .scores
                .iter_mut()
                .find(|score| score.map_id == record.id)
            {
                score.old_score = Some(score.score);
                score.score = new_score;
            } else {
                player.scores.push(Score {
                    map_id: record.id,
                    campaign: record.campaign,
                    score: new_score,
                    old_score: None,
                    delta: new_score - record.wr
                });
            }

            if !player.is_banned {
                if record.wr == new_score {
                    let mut ties = wr_ties.lock().unwrap();
                    *ties += 1;
                }

                if update_ids {
                    let mut player_ids = ids.lock().unwrap();
                    (*player_ids).insert(player.id.clone());
                }
            }

            if player.save(&name).is_err() {
                error!("failed to save player {}", player.id);
            }
        }
    });

    wr_ties.into_inner().unwrap_or_default()
}
