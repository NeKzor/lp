use core::cmp::Ordering;
use std::collections::HashSet;
use std::fs;
use std::io::Write;
use std::iter::FromIterator;

use log::{info, warn};

use crate::models::api::*;
use crate::models::database;
use crate::models::database::PlayerCache;
use crate::models::repository::Record;
use crate::models::steam::*;

const STEAM_API: &str = "https://api.steampowered.com";

pub fn export_api<T>(name: &str, endpoint: &Endpoint<T>) -> std::io::Result<()>
where
    T: serde::Serialize,
{
    fs::File::create(name)
        .expect(format!("failed to open or create file {}", name).as_ref())
        .write_all(serde_json::to_string_pretty(endpoint).unwrap().as_bytes())
}

pub fn fetch_profiles(
    profile_ids: Vec<String>,
) -> Result<Vec<SteamUser>, Box<dyn std::error::Error>> {
    assert!(
        profile_ids.len() <= 100,
        "number of profile ids should be lower or equal to 100"
    );

    let url = format!(
        "{}/ISteamUser/GetPlayerSummaries/v0002/?key={key}&steamids={steam_ids}",
        STEAM_API,
        key = std::env::var("STEAM_API_KEY").expect("env var STEAM_API_KEY not set"),
        steam_ids = profile_ids.join(",")
    );

    info!("api call to {}", url);

    let text = reqwest::blocking::get(&url)?.text()?;
    let json: JsonResponse<ISteamUser> = serde_json::from_reader(text.as_bytes())?;

    let fetched = json.response.players.len();
    let requested = profile_ids.len();

    if fetched != requested {
        warn!("fetched {} out of {} profiles", fetched, requested);
    } else {
        info!("fetched {} out of {} profiles", fetched, requested);
    }

    Ok(json.response.players)
}

pub fn export_all(
    filtered_player_ids: &HashSet<SteamId>,
    stats: &(i32, i32, i32),
    records: &Vec<Record>,
    api_records: &mut Records,
    player_cache: &mut PlayerCache
) {
    let (perfect_sp_score, perfect_mp_score, perfect_ov_score) = stats;

    let mut sp_ranks = Vec::<Ranking>::new();
    let mut mp_ranks = Vec::<Ranking>::new();
    let mut ov_ranks = Vec::<Ranking>::new();

    let mut ids_to_resolve = HashSet::<SteamId>::new();

    records.iter().for_each(|record| {
        record.showcases.iter().for_each(|showcase| {
            if let Some(player) = &showcase.steam {
                ids_to_resolve.insert(player.clone());
            }
            if let Some(player) = &showcase.steam2 {
                ids_to_resolve.insert(player.clone());
            }
        });
    });

    ids_to_resolve.extend(filtered_player_ids.clone());

    let merged_ids = Vec::from_iter(ids_to_resolve);
    let chunks = merged_ids.as_slice().chunks(100);

    info!("requesting {} api calls", chunks.len());

    let profiles: Vec<SteamUser> = chunks
        .map(|ids| fetch_profiles(ids.into_iter().map(|id| id.clone().to_string()).collect()).unwrap())
        .flatten()
        .collect();

    for player_id in filtered_player_ids.iter() {
        let result = player_cache.find(*player_id);

        if result.is_none() {
            warn!("player {} not found", player_id);
            continue;
        }

        let mut player = result.unwrap();

        if let Some(profile) = profiles
            .iter()
            .find(|profile| profile.steam_id == player.id)
        {
            player.name = profile.name.clone();
            player.avatar = profile.avatar.clone();
            player.country = profile.country.clone();
        } else {
            warn!("profile {} not found", player_id);
        }

        info!("processing player {}", player_id);

        let mut stats = ProfileStats {
            sp: Stats {
                delta: 0,
                percentage: 0,
            },
            mp: Stats {
                delta: 0,
                percentage: 0,
            },
            overall: Stats {
                delta: 0,
                percentage: 0,
            },
        };

        if player.sp != 0 {
            let delta = (player.sp - perfect_sp_score).abs();
            let percentage = (*perfect_sp_score as f32 / player.sp as f32 * 100f32) as i32;

            stats.sp.delta = delta;
            stats.sp.percentage = percentage;

            sp_ranks.push(Ranking {
                name: player.name.clone(),
                avatar: player.avatar.clone(),
                country: player.country.clone(),
                stats: Stats { delta, percentage },
                id: player.id.to_string(),
                score: player.sp,
                old_score: player.sp_old,
                rank: 0,
                rank_banned: 0,
                banned: player.sp_banned,
            });
        }

        if player.mp != 0 {
            let delta = (player.mp - perfect_mp_score).abs();
            let percentage = (*perfect_mp_score as f32 / player.mp as f32 * 100f32) as i32;

            stats.mp.delta = delta;
            stats.mp.percentage = percentage;

            mp_ranks.push(Ranking {
                name: player.name.clone(),
                avatar: player.avatar.clone(),
                country: player.country.clone(),
                stats: Stats { delta, percentage },
                id: player.id.to_string(),
                score: player.mp,
                old_score: player.mp_old,
                rank: 0,
                rank_banned: 0,
                banned: player.mp_banned,
            });
        }

        if player.overall != 0 {
            let delta = (player.overall - perfect_ov_score).abs();
            let percentage = (*perfect_ov_score as f32 / player.overall as f32 * 100f32) as i32;

            stats.overall.delta = delta;
            stats.overall.percentage = percentage;

            ov_ranks.push(Ranking {
                name: player.name.clone(),
                avatar: player.avatar.clone(),
                country: player.country.clone(),
                stats: Stats { delta, percentage },
                id: player.id.to_string(),
                score: player.overall,
                old_score: player.overall_old,
                rank: 0,
                rank_banned: 0,
                banned: player.sp_banned || player.mp_banned,
            });
        }

        let api_profile = Profile {
            scores: Vec::from_iter(&player.scores)
                .into_iter()
                .map(|score| Score {
                    map_id: score.map_id,
                    campaign: score.campaign,
                    score: score.score,
                    old_score: score.old_score.unwrap_or(0),
                })
                .collect(),
            sp: player.sp,
            mp: player.mp,
            overall: player.overall,
            sp_old: player.sp_old,
            mp_old: player.mp_old,
            overall_old: player.overall_old,
            id: player_id.to_string(),
            name: player.name.clone(),
            avatar: player.avatar.clone(),
            country: player.country.clone(),
            stats,
        };

        export_api(
            format!("./api/profiles/{}.json", player_id).as_ref(),
            &Endpoint { data: &api_profile },
        )
        .unwrap();
    }

    fn rank_then_by_id(a: &Ranking, b: &Ranking) -> Ordering {
        if a.score == b.score {
            if a.id.parse::<i64>().unwrap() < b.id.parse::<i64>().unwrap() {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        } else {
            if a.score < b.score {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        }
    }

    sp_ranks.sort_by(rank_then_by_id);
    mp_ranks.sort_by(rank_then_by_id);
    ov_ranks.sort_by(rank_then_by_id);

    fn calc_ranks(rankings: &mut Vec<Ranking>) {
        let mut current_rank = 0;
        let mut current_score = 0;

        rankings.iter_mut().for_each(|rank| {
            if current_score != rank.score && !rank.banned {
                current_score = rank.score;
                current_rank += 1;
            }

            rank.rank = current_rank;
        });
        let mut current_rank = 0;
        let mut current_score = 0;

        rankings.iter_mut().for_each(|rank| {
            if current_score != rank.score {
                current_score = rank.score;
                current_rank += 1;
            }

            rank.rank_banned = current_rank;
        });
    }

    calc_ranks(&mut sp_ranks);
    calc_ranks(&mut mp_ranks);
    calc_ranks(&mut ov_ranks);

    let create_showcaser = |player_id: &Option<SteamId>,
                            fallback_name: &Option<String>|
     -> Result<Showcaser, &'static str> {
        if let Some(id) = player_id {
            if let Some(profile) = profiles.iter().find(|profile| profile.steam_id == *id) {
                Ok(Showcaser {
                    id: Some(profile.steam_id.to_string()),
                    name: profile.name.clone(),
                    avatar: Some(profile.avatar.clone()),
                    country: profile.country.clone(),
                })
            } else {
                Err("profile not found")
            }
        } else {
            if let Some(name) = fallback_name {
                Ok(Showcaser {
                    id: None,
                    name: name.clone(),
                    avatar: None,
                    country: None,
                })
            } else {
                Err("no fallback name for found")
            }
        }
    };

    for record in records {
        if let Some(map) = api_records.maps.iter_mut().find(|map| map.id == record.id) {
            for showcase in &record.showcases {
                let player = create_showcaser(&showcase.steam, &showcase.player);
                if let Err(oops) = player {
                    warn!("{}", oops);
                    continue;
                }

                let player2 = if showcase.steam2.is_some() || showcase.player2.is_some() {
                    let showcaser = create_showcaser(&showcase.steam2, &showcase.player2);
                    if let Err(oops) = showcaser {
                        warn!("{}", oops);
                        None
                    } else {
                        Some(showcaser.unwrap())
                    }
                } else {
                    None
                };

                map.showcases.push(Showcase {
                    player: player.unwrap(),
                    player2: player2,
                    date: showcase.date.clone(),
                    media: showcase.media.clone(),
                });
            }
        } else {
            warn!("record {} not found in api maps", record.id);
        }
    }

    assert!(export_api(
        &"./api/records.json".to_owned(),
        &Endpoint { data: &api_records },
    )
    .is_ok());

    assert!(export_api(&"./api/sp.json".to_owned(), &Endpoint { data: &sp_ranks },).is_ok());

    assert!(export_api(&"./api/mp.json".to_owned(), &Endpoint { data: &mp_ranks },).is_ok());

    assert!(export_api(
        &"./api/overall.json".to_owned(),
        &Endpoint { data: &ov_ranks },
    )
    .is_ok());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fetch_profile_ids() {
        let mut profile_ids = Vec::<String>::new();

        profile_ids.push("76561198049848090".to_string());
        profile_ids.push("76561198049848090".to_string());

        let profiles = fetch_profiles(profile_ids).unwrap();

        assert_eq!(profiles.len(), 2);
    }
}
