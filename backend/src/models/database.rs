use std::fs;
use std::io::Write;

use serde::{Deserialize, Serialize};
use serde_repr::*;

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Player {
    #[serde(rename = "_id")]
    pub id: String,
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
    pub fn find(name: &String) -> Option<Self> {
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

    pub fn save(&self, name: &String) -> std::io::Result<()> {
        fs::File::create(name)
            .expect(format!("failed to open or create file {}", name).as_ref())
            .write_all(serde_json::to_string(self).unwrap().as_bytes())
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
