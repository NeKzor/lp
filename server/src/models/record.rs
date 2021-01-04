use chrono::prelude::*;
use futures::StreamExt;
use log::error;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};
use serde_repr::*;
use validator::Validate;

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

#[derive(Clone, Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(i32)]
pub enum Campaign {
    Unknown = 0,
    SinglePlayer = 1,
    Cooperative = 2,
    Overall = 3,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Record {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<mongodb::bson::oid::ObjectId>,
    //#[serde(rename(deserialize = "id"))]
    pub steam_id: i32,
    pub name: String,
    //#[serde(rename(deserialize = "mode"))]
    pub campaign: Campaign,
    pub wr: i32,
    pub limit: Option<i32>,
    pub index: i32,
    #[serde(skip)]
    pub showcases: Vec<Showcase>,
    #[serde(default = "Utc::now")]
    pub created_at: DateTime<Utc>,
    #[serde(default = "Utc::now")]
    pub last_edit: DateTime<Utc>,
}

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
pub struct RecordEdit {
    pub steam_id: i32,
    #[validate(range(min = 0))]
    pub wr: i32,
    #[validate(range(min = 1))]
    pub limit: Option<i32>,
}

impl Record {
    const COLLECTION: &'static str = "records";

    #[allow(dead_code)]
    pub fn get_limit(&self) -> i32 {
        match self.limit {
            Some(limit) => limit,
            None => self.wr,
        }
    }

    /// Finds record by Steam id
    pub async fn find(db: &mongodb::Database, steam_id: i32) -> Option<Self> {
        if let Some(doc) = db
            .collection(Record::COLLECTION)
            .find_one(doc! {"steam_id": steam_id}, None)
            .await
            .unwrap()
        {
            Some(doc.into())
        } else {
            None
        }
    }

    /// Collects all records
    pub async fn all(db: &mongodb::Database) -> Vec<Self> {
        let mut records: Vec<Record> = vec![];
        let mut cursor = db
            .collection(Record::COLLECTION)
            .find(doc! {}, None)
            .await
            .unwrap();

        while let Some(result) = cursor.next().await {
            match result {
                Ok(document) => {
                    records.push(document.into());
                }
                Err(oops) => error!("Record::all Error: {}", oops),
            }
        }

        records
    }

    pub async fn save(&self, db: &mongodb::Database) {
        let doc: bson::Document = self.into();

        db.collection(Record::COLLECTION)
            .update_one(doc! {"_id": doc.get("_id").unwrap()}, doc, None)
            .await
            .unwrap();
    }
}

impl From<&Record> for mongodb::bson::document::Document {
    fn from(record: &Record) -> Self {
        bson::to_bson(record)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned()
    }
}

impl From<mongodb::bson::document::Document> for Record {
    fn from(record_doc: mongodb::bson::document::Document) -> Self {
        bson::from_document(record_doc).unwrap()
    }
}

#[derive(Debug, Deserialize)]
pub struct Override {
    pub id: i32,
    pub player: String,
    pub score: i32,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Showcase {
    pub id: i32,
    pub player: Option<String>,
    pub player2: Option<String>,
    pub steam: Option<String>,
    pub steam2: Option<String>,
    pub date: String,
    pub media: String,
}

impl_link!(Record, "records.yaml");
impl_link!(Override, "overrides.yaml");
impl_link!(Showcase, "community.yaml");

#[allow(dead_code)]
pub mod tests {
    use bson::Document;
    use mongodb::Client;

    use super::*;

    const MASTER_BRANCH: &str = "https://raw.githubusercontent.com/NeKzor/lp/master";

    fn sync_repository<T>() -> Vec<T>
    where
        T: RepositoryItem + serde::de::DeserializeOwned,
    {
        let item = T::link();
        let url = format!("{}/{}", MASTER_BRANCH, item);

        let res = reqwest::blocking::get(&url.to_owned())
            .expect(format!("failed to fetch {}", url).as_ref());

        let text = res.text().expect("failed to read text");

        let yaml: Vec<T> = serde_yaml::from_str(&text)
            .expect(format!("failed to parse yaml for {}", item).as_ref());

        println!("fetched {} entries for {}", yaml.len(), item);

        yaml
    }

    async fn populate_records() -> mongodb::error::Result<()> {
        let db_name = std::env::var("DB_NAME").expect("env var DB_NAME not set");

        let db_uri = format!(
            "mongodb://{user}:{pass}@localhost:{port}/{name}",
            user = std::env::var("DB_USER").expect("env var DB_USER not set"),
            pass = std::env::var("DB_PASS").expect("env var DB_PASS not set"),
            port = std::env::var("DB_PORT").expect("env var DB_PORT not set"),
            name = db_name.clone()
        );

        let client = Client::with_uri_str(db_uri.as_ref()).await.unwrap();

        let db = client.database(db_name.as_ref());

        db.collection(Record::COLLECTION).drop(None).await.unwrap();
        db.create_collection(Record::COLLECTION, None)
            .await
            .unwrap();

        let records = db.collection(Record::COLLECTION);

        let docs = sync_repository::<Record>()
            .iter()
            .map(|record| record.into())
            .collect::<Vec<Document>>();

        let result = records.insert_many(docs, None).await.unwrap();

        println!("inserted {} records", result.inserted_ids.len());

        Ok(())
    }

    #[test]
    fn db_populate_records() {
        dotenv::dotenv().ok();

        let _ = futures::executor::block_on(async { populate_records().await });
    }
}
