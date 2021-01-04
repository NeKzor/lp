use chrono::prelude::*;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", content = "reason")]
pub enum ScoreStatus {
    /// Default status.
    Valid,
    /// Score has been banned. Requires a reason.
    Invalid(String),
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Proof {
    pub twitch: Option<String>,
    pub youtube: Option<String>,
}

impl Proof {
    #[allow(dead_code)]
    pub fn new() -> Self {
        Proof {
            twitch: None,
            youtube: None,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Score {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<mongodb::bson::oid::ObjectId>,
    pub steam_id: String,
    pub time: i32,
    pub portals: i32,
    pub status: ScoreStatus,
    pub proof: Proof,
    pub created_at: DateTime<Utc>,
    pub edited_at: DateTime<Utc>,
}
