use serde::{Deserialize};

#[derive(Debug, Deserialize)]
pub struct SteamUser {
    #[serde(rename = "steamid")]
    pub steam_id: String,
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
