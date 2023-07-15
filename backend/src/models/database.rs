use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::fs;
use std::io::Write;
use log::error;

use serde::{Deserialize, Serialize};
use serde_repr::*;
use crate::models::steam::SteamId;

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Player {
    #[serde(rename = "_id")]
    pub id: SteamId,
    pub name: String,
    pub avatar: String,
    pub country: Option<String>,
    #[serde(rename = "entries")]
    pub scores: Vec<Score>,
    #[serde(rename = "isBanned")]
    pub is_banned: bool,
    pub sp: i32,
    pub mp: i32,
    pub overall: i32,
    #[serde(rename = "spOld")]
    pub sp_old: i32,
    #[serde(rename = "mpOld")]
    pub mp_old: i32,
    #[serde(rename = "overallOld")]
    pub overall_old: i32,
}

impl Player {
    fn find(name: &String) -> Option<Self> {
        let file = fs::File::open(name);

        if file.is_ok() {
            Some(
                serde_json::from_reader(file.unwrap())
                    .expect(format!("invalid json file {}", name).as_ref()),
            )
        } else {
            None
        }
    }

    fn save(&self, name: &String) -> std::io::Result<()> {
        fs::File::create(name)
            .expect(format!("failed to open or create file {}", name).as_ref())
            .write_all(serde_json::to_string(self).unwrap().as_bytes())
    }
}

#[derive(Debug)]
pub struct PlayerCache {
    pub player_map: HashMap<SteamId, Player>,
    directory: String,
}

impl PlayerCache {
    pub fn new(path: &str) -> Self {
        let _ = fs::create_dir_all(path).expect("couldn't create player cache path");
        PlayerCache {
            player_map: Default::default(),
            directory: path.to_string(),
        }
    }

    pub fn find(&mut self, steamid: SteamId) -> Option<&mut Player> {
        match self.player_map.entry(steamid) {
            Entry::Occupied(entry) => {
                Some(entry.into_mut())
            }
            Entry::Vacant(entry) => {
                let name = format!("{}/{}", self.directory, steamid);
                let player = Player::find(&name);
                if player.is_some() {
                    Some(entry.insert(player.unwrap()))
                } else {
                    None
                }
            }
        }
    }

    pub fn insert(&mut self, player: Player) -> &mut Player {
        let id = player.id;
        self.player_map.insert(id, player);
        self.player_map.get_mut(&id).unwrap() // this is stupid
    }

    pub fn save(&self) {
        self.player_map.iter().for_each(|entry| {
            let name = format!("{}/{}", self.directory, entry.0);
            if entry.1.save(&name).is_err() {
                error!("failed to save player {}", entry.1.id);
            }
        })
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Score {
    #[serde(rename = "_id")]
    pub map_id: i32,
    #[serde(rename = "mode")]
    pub campaign: Campaign,
    pub score: i32,
    #[serde(rename = "scoreOld")]
    pub old_score: Option<i32>,
    #[serde(default)]
    pub delta: i32,
}

#[derive(Copy, Clone, Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(u8)]
pub enum Campaign {
    Unknown = 0,
    SinglePlayer = 1,
    Cooperative = 2,
    Overall = 3,
}
