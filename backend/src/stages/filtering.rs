use std::collections::HashSet;

use log::{error, info, warn};

use crate::models::database::*;

// These values should never change
const SP_MAPS_COUNT: i32 = 51;
const MP_MAPS_COUNT: i32 = 48;

fn calculate_completion(player: &Player) -> Option<(Option<i32>, Option<i32>)> {
    let (mut sp_score, mut sp_count) = (0, 0);
    let (mut mp_score, mut mp_count) = (0, 0);

    for score in player.scores.iter() {
        match score.campaign {
            Campaign::SinglePlayer => {
                sp_score += score.score;
                sp_count += 1;
            }
            Campaign::Cooperative => {
                mp_score += score.score;
                mp_count += 1;
            }
            _ => panic!(
                "invalid campaign for map {}, player {}",
                score.map_id, player.id
            ),
        }
    }

    let completed_sp = sp_count == SP_MAPS_COUNT;
    let completed_mp = mp_count == MP_MAPS_COUNT;

    if completed_sp || completed_mp {
        Some((
            if completed_sp { Some(sp_score) } else { None },
            if completed_mp { Some(mp_score) } else { None },
        ))
    } else {
        None
    }
}

pub fn filter_players(player_ids: &HashSet<String>) -> HashSet<String> {
    let mut filtered = HashSet::<String>::new();

    for player_id in player_ids.iter() {
        let name = format!("./tmp/{}", player_id);
        let result = Player::find(&name);

        if result.is_none() {
            warn!("player {} not found", player_id);
            continue;
        }

        let mut player = result.unwrap();

        if player.is_banned {
            continue;
        }

        let completion = calculate_completion(&player);

        if completion.is_none() {
            continue;
        }

        info!("processed player {}", player_id);

        let (sp_completion, mp_completion) = completion.unwrap();

        if let Some(sp) = sp_completion {
            player.sp_old = player.sp;
            player.sp = sp;

            if let Some(mp) = mp_completion {
                player.mp_old = player.mp;
                player.mp = mp;

                player.overall_old = player.overall;
                player.overall = sp + mp;
            }
        } else if let Some(mp) = mp_completion {
            player.mp_old = player.mp;
            player.mp = mp;
        }

        if let Ok(_) = player.save(&name) {
            filtered.insert(player_id.clone());
        } else {
            error!("failed to save player {}", player_id);
        }
    }

    filtered
}
