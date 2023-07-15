use std::collections::HashMap;
use std::{fmt, fs, io};

use serde::{Deserialize, Deserializer, Serialize, Serializer};
use serde::de::{SeqAccess, Visitor};
use serde::ser::SerializeSeq;
use serde_json::ser::Formatter;
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

pub struct PlayerCache {
    pub player_map: HashMap<SteamId, Player>,
}

impl PlayerCache {
    pub fn new(path: &str) -> Self {
        let file = fs::File::open(path);

        if file.is_ok() {
            serde_json::from_reader(io::BufReader::new(file.unwrap())).expect("invalid json file")
        } else {
            PlayerCache{ player_map: Default::default() }
        }
    }

    pub fn find(&mut self, steamid: SteamId) -> Option<&mut Player> {
        self.player_map.get_mut(&steamid)
    }

    pub fn insert(&mut self, player: Player) -> &mut Player {
        let id = player.id;
        self.player_map.insert(id, player);
        self.player_map.get_mut(&id).unwrap() // this is stupid
    }

    pub fn save(&self, path: &str) {
        let f = io::BufWriter::new(fs::File::create(path).unwrap());
        self.serialize(
            &mut serde_json::Serializer::with_formatter(
                f,
                PlayerCacheFormatter::default(),
            )
        ).unwrap();
    }
}

// serializer/deserializer to store the map as an array
struct PlayerCacheVisitor;

impl<'de> Visitor<'de> for PlayerCacheVisitor {
    type Value = PlayerCache;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        formatter.write_str("PlayerCache")
    }

    fn visit_seq<A: SeqAccess<'de>>(self, mut access: A) -> Result<Self::Value, A::Error> {
        let mut players = HashMap::with_capacity(access.size_hint().unwrap_or(0));

        while let Some(player) = access.next_element::<Player>()? {
            players.insert(player.id, player);
        }

        Ok(PlayerCache { player_map: players })
    }
}
impl<'de> Deserialize<'de> for PlayerCache {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>
    {
        deserializer.deserialize_seq(PlayerCacheVisitor{})
    }
}
impl Serialize for PlayerCache {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        let mut seq = serializer.serialize_seq(Some(self.player_map.len()))?;
        for (_k, v) in self.player_map.iter() {
            seq.serialize_element(&v)?;
        }
        seq.end()
    }
}

// formatter to write each player struct on a new line
#[derive(Default)]
pub struct PlayerCacheFormatter {
    current_level: u32,
}

impl Formatter for PlayerCacheFormatter {
    fn end_array<W>(&mut self, writer: &mut W) -> io::Result<()>
        where
            W: ?Sized + io::Write,
    {
        writer.write_all(if self.current_level == 0 { b"\n]" } else { b"]" })
    }
    fn begin_array_value<W>(&mut self, writer: &mut W, first: bool) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        self.current_level += 1;
        if self.current_level == 1 {
            writer.write_all(if first { b"\n" } else { b",\n" })
        } else if !first {
            writer.write_all(b",")
        } else {
            Ok(())
        }
    }
    fn end_array_value<W>(&mut self, _writer: &mut W) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        self.current_level -= 1;
        Ok(())
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
