use std::cmp;
use std::collections::HashSet;

use log::{error, info, warn};
use rayon::prelude::*;
use quick_xml::de::from_reader;

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

pub fn update_entries(record: &Record, entries: &[Entry],
                      player_ids: &mut HashSet<SteamId>, player_cache: &mut PlayerCache) -> i32 {
    let update_ids = record.name == "Portal Gun" || record.name == "Doors";

    let mut wr_ties = 0;

    entries.iter().for_each(|entry| {
        let mut player = {
            if let Some(player) = player_cache.find(entry.steam_id.value) {
                player
            } else {
                let mut player = Player::default();
                player.id = entry.steam_id.value.clone();
                player_cache.insert(player)
            }
        };

        let new_score = {
            if let Some(ov) = record
                .overrides
                .iter()
                .find(|ov| ov.player == entry.steam_id.value)
            {
                ov.score
            } else {
                if record.campaign == Campaign::SinglePlayer &&
                    !player.sp_banned &&
                    !entry.is_valid(&record) {
                    player.sp_banned = true;
                    warn!("SP Auto-banned player {} (score: {})", player.id, entry.score.value);
                }
                if record.campaign == Campaign::Cooperative &&
                    !player.mp_banned &&
                    !entry.is_valid(&record) {
                    player.mp_banned = true;
                    warn!("MP Auto-banned player {} (score: {})", player.id, entry.score.value);
                }

                // clamp value for cheaters
                cmp::max(entry.score.value, -10000)
            }
        };

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
        if (record.campaign == Campaign::SinglePlayer && !player.sp_banned) ||
            (record.campaign == Campaign::Cooperative && !player.mp_banned) {
            if record.wr == new_score {
                wr_ties += 1;
            }
        }

        if update_ids {
            player_ids.insert(player.id.clone());
        }
    });

    wr_ties
}
