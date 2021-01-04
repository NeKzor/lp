use chrono::prelude::*;
use futures::StreamExt;
use log::error;
use mongodb::{bson::doc, options::FindOptions};
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
pub struct LogFilter {
    // TODO: date range validation
    pub date_from: DateTime<Utc>,
    pub date_to: DateTime<Utc>,
    pub steam_id: Option<String>,
    #[validate(range(min = 0, max = 1000))]
    pub page: u16,
    #[validate(range(min = 1, max = 1000))]
    pub count: u16,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Log {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<mongodb::bson::oid::ObjectId>,
    pub steam_id: String,
    pub message: String,
    pub created_at: DateTime<Utc>,
}

impl Log {
    const COLLECTION: &'static str = "logs";

    pub fn new(steam_id: String, message: String) -> Self {
        Log {
            id: None,
            steam_id,
            message,
            created_at: Utc::now(),
        }
    }

    /// Collects all logs by filter
    pub async fn all(db: &mongodb::Database, log_filter: &LogFilter) -> Vec<Self> {
        let mut logs: Vec<Log> = vec![];

        let mut filter = doc! {
            "created_at": {
                "$gte" : log_filter.date_from,
                "$lte" : log_filter.date_to,
            }
        };

        if let Some(steam_id) = &log_filter.steam_id {
            filter.insert("steam_id", steam_id);
        }

        let options = FindOptions::builder()
            .skip(log_filter.page as i64)
            .limit(log_filter.count as i64)
            .build();

        let mut cursor = db
            .collection(Log::COLLECTION)
            .find(filter, options)
            .await
            .unwrap();

        while let Some(result) = cursor.next().await {
            match result {
                Ok(document) => {
                    logs.push(document.into());
                }
                Err(oops) => error!("Logs::all Error: {}", oops),
            }
        }

        logs
    }

    pub async fn save(&self, db: &mongodb::Database) {
        let doc: bson::Document = self.into();

        db.collection(Log::COLLECTION)
            .update_one(doc! {"_id": doc.get("_id").unwrap()}, doc, None)
            .await
            .unwrap();
    }
}

impl From<&Log> for mongodb::bson::document::Document {
    fn from(log: &Log) -> Self {
        bson::to_bson(log)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned()
    }
}

impl From<mongodb::bson::document::Document> for Log {
    fn from(log_doc: mongodb::bson::document::Document) -> Self {
        bson::from_document(log_doc).unwrap()
    }
}
