use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

#[derive(Serialize, Deserialize, Debug)]
pub struct Endpoint<T> {
    pub data: T,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Stats {
    pub delta: i32,
    pub percentage: i32,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug)]
pub struct Ranking {
    pub name: String,
    pub avatar: String,
    pub country: Option<String>,
    pub stats: Stats,
    #[serde(rename = "_id")]
    pub id: String,
    pub score: i32,
    #[serde(rename = "scoreOld")]
    pub old_score: i32,
    pub rank: i32,
    #[serde(rename = "rankBanned")]
    pub rank_banned: i32,
    pub banned: bool,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Showcaser {
    pub id: Option<String>,
    pub name: String,
    pub avatar: Option<String>,
    pub country: Option<String>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug)]
pub struct Showcase {
    pub player: Showcaser,
    pub player2: Option<Showcaser>,
    pub date: String,
    pub media: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Map {
    pub id: i32,
    pub name: String,
    #[serde(rename = "mode")]
    pub campaign: crate::Campaign,
    pub wr: i32,
    pub index: i32,
    pub ties: i32,
    pub showcases: Vec<Showcase>,
}

impl Map {
    pub fn new(record: &crate::models::repository::Record, ties: i32) -> Self {
        Map {
            id: record.id,
            name: record.name.clone(),
            campaign: record.campaign,
            wr: record.wr,
            index: record.index,
            ties,
            showcases: Vec::<Showcase>::new(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Records {
    pub maps: Vec<Map>,
}

impl Records {
    pub fn new() -> Self {
        Records {
            maps: Vec::new(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Score {
    #[serde(rename = "_id")]
    pub map_id: i32,
    #[serde(rename = "mode")]
    pub campaign: crate::Campaign,
    pub score: i32,
    #[serde(rename = "scoreOld")]
    pub old_score: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ProfileStats {
    pub sp: Stats,
    pub mp: Stats,
    pub overall: Stats,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug)]
pub struct Profile {
    #[serde(rename = "entries")]
    pub scores: Vec<Score>,
    pub sp: i32,
    pub mp: i32,
    pub overall: i32,
    #[serde(rename = "spOld")]
    pub sp_old: i32,
    #[serde(rename = "mpOld")]
    pub mp_old: i32,
    #[serde(rename = "overallOld")]
    pub overall_old: i32,
    #[serde(rename = "_id")]
    pub id: String,
    pub name: String,
    pub avatar: String,
    pub country: Option<String>,
    pub stats: ProfileStats,
}
