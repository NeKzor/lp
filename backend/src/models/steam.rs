use serde::{Deserialize};
use serde_aux::field_attributes::deserialize_number_from_string;

use crate::models::repository::Record;

#[derive(Debug, Deserialize)]
pub struct XmlTag<T> {
    #[serde(rename = "$value")]
    pub value: T,
}

#[derive(Debug, Deserialize)]
pub struct Entry {
    #[serde(rename = "steamid")]
    pub steam_id: XmlTag<SteamId>,
    pub score: XmlTag<i32>,
}

impl Entry {
    pub fn is_valid(&self, record: &Record) -> bool {
        self.score.value >= record.wr
    }
}

#[derive(Debug, Deserialize)]
pub struct Leaderboards {
    #[serde(rename = "resultCount")]
    pub result_count: XmlTag<i32>,
    pub entries: XmlTag<Vec<Entry>>,
}

impl Leaderboards {
    pub fn needs_another_page(&self, record: &Record) -> bool {
        match self.entries.value.last() {
            Some(entry) => {
                entry.score.value == record.wr
                    || match record.limit {
                        Some(limit) => entry.score.value <= limit,
                        None => false,
                    }
            }
            None => false,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct SteamUser {
    #[serde(rename = "steamid", deserialize_with = "deserialize_number_from_string")]
    pub steam_id: SteamId,
    #[serde(rename = "personaname")]
    pub name: String,
    pub avatar: String,
    #[serde(rename = "loccountrycode")]
    pub country: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ISteamUser {
    pub players: Vec<SteamUser>,
}

#[derive(Debug, Deserialize)]
pub struct JsonResponse<T> {
    pub response: T,
}

pub type SteamId = u64;