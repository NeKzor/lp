use serde::{Deserialize, Serialize};

use crate::models::database::Campaign;
use crate::models::steam::SteamId;

pub trait RepositoryItem {
    fn link() -> &'static str;
}

macro_rules! impl_link {
    ($struct_name:ident, $file_link:expr) => {
        impl RepositoryItem for $struct_name {
            fn link() -> &'static str {
                $file_link
            }
        }
    };
}

#[derive(Debug, Deserialize)]
pub struct Record {
    pub id: i32,
    pub name: String,
    #[serde(rename = "mode")]
    pub campaign: Campaign,
    pub wr: i32,
    pub limit: Option<i32>,
    pub index: i32,
    #[serde(skip)]
    pub overrides: Vec<Override>,
    #[serde(skip)]
    pub showcases: Vec<Showcase>,
}

impl Record {
    pub fn get_limit(&self) -> i32 {
        match self.limit {
            Some(limit) => limit,
            None => self.wr,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct Override {
    pub id: i32,
    pub player: SteamId,
    pub score: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Showcase {
    pub id: i32,
    pub player: Option<String>,
    pub player2: Option<String>,
    pub steam: Option<SteamId>,
    pub steam2: Option<SteamId>,
    pub date: String,
    pub media: String,
}

impl_link!(Record, "records.yaml");
impl_link!(Override, "overrides.yaml");
impl_link!(Showcase, "community.yaml");
