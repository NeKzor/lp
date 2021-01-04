use actix_http::{Error, Payload};
use actix_identity::{Identity};
use actix_web::{web, FromRequest, HttpRequest};
use bson::Document;
use chrono::prelude::*;
use futures::{Future, StreamExt};
use log::error;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};
use std::pin::Pin;
use validator::Validate;

use crate::errors::ServiceError;

use super::{log::Log, steam};

#[derive(Serialize, Deserialize, Validate, Clone, Debug)]
pub struct UserSettings {
    #[validate(length(max = 32))]
    pub display_name: Option<String>,
    /// TODO: custom validator for ISO Alpha-3
    #[validate(length(equal = 3))]
    pub country_code: Option<String>,
    pub social_links: SocialLinks,
}

impl UserSettings {
    pub fn new() -> Self {
        UserSettings {
            display_name: None,
            country_code: None,
            social_links: SocialLinks::new(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", content = "reason")]
pub enum UserStatus {
    /// User can login and interact,
    Active,
    /// User can login but cannot interact. Requires a reason.
    Banned(String),
    /// User cannot login at all. Requires a reason.
    Inactive(String),
}

bitflags::bitflags! {
    /// User permission flags.
    #[derive(Serialize, Deserialize)]
    pub struct UserPermission: i32 {
        /// User can modify settings of others,
        const MODIFY_USER = 1 << 0;
        ///  User can modify scores of others,
        const MODIFY_SCORE = 1 << 1;
        /// User can modify proofs of others,
        const MODIFY_PROOF = 1 << 2;
        ///  User can modify status of others,
        const MODIFY_USER_STATUS = 1 << 3;
        /// User can modify permissions of others,
        const MODIFY_USER_PERMISSION = 1 << 4;
        /// User can modify records,
        const MODIFY_RECORD = 1 << 5;
        /// User can view the changelog,
        const VIEW_CHANGELOG = 1 << 6;
    }
}

#[derive(Validate, Serialize, Deserialize, Clone, Debug)]
pub struct SocialLinks {
    #[validate(length(max = 37))]
    pub discord: Option<String>,
    #[validate(length(max = 25))]
    pub twitch: Option<String>,
    #[validate(length(max = 15))]
    pub twitter: Option<String>,
    #[validate(length(max = 100))]
    pub youtube: Option<String>,
}

impl SocialLinks {
    pub fn new() -> Self {
        SocialLinks {
            discord: None,
            twitch: None,
            twitter: None,
            youtube: None,
        }
    }
}

/// Authenticated user object.
/// - Created at first login
/// - Automatic Steam sync for name and avatar_url
#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<mongodb::bson::oid::ObjectId>,
    pub steam_id: String,
    pub name: Option<String>,
    pub avatar_url: Option<String>,
    pub settings: UserSettings,
    pub status: UserStatus,
    pub permissions: UserPermission,
    pub first_login: DateTime<Utc>,
    pub last_login: DateTime<Utc>,
    pub last_edit: DateTime<Utc>,
}

#[derive(Validate, Serialize, Deserialize, Debug)]
pub struct UserEdit {
    pub steam_id: String,
    #[validate]
    pub settings: UserSettings,
    // TODO: validation
    pub status: UserStatus,
    // TODO: validation
    pub permissions: UserPermission,
}

impl User {
    const COLLECTION: &'static str = "users";

    /// Creates a new user who never logged in before.
    pub fn new(steam_id: String) -> Self {
        User {
            id: None,
            steam_id,
            name: None,
            avatar_url: None,
            settings: UserSettings::new(),
            status: UserStatus::Active,
            permissions: UserPermission::empty(),
            first_login: Utc::now(),
            last_login: Utc::now(),
            last_edit: Utc::now(),
        }
    }

    /// Updates name, avatar and country code. Will be called once on login.
    pub async fn update_login(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        self.last_login = Utc::now();

        let url = format!(
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={key}&steamids={steam_ids}",
            key = std::env::var("STEAM_API_KEY").expect("env var STEAM_API_KEY not set"),
            steam_ids = self.steam_id
        );

        let text = reqwest::get(&url).await?.text().await?;
        let json: steam::JsonResponse<steam::ISteamUser> =
            serde_json::from_reader(text.as_bytes())?;

        match json.response.players.first() {
            Some(player) => {
                self.name = Some(player.name.clone());
                self.avatar_url = Some(player.avatar.clone());

                // Do not sync if already set
                if let None = self.settings.country_code {
                    self.settings.country_code = player.country.clone();
                }

                self.last_edit = Utc::now();

                Ok(())
            }
            None => Err("failed to fetch player")?,
        }
    }

    /// Finds user by Steam id
    pub async fn find(db: &mongodb::Database, steam_id: String) -> Option<Self> {
        if let Some(doc) = db
            .collection(User::COLLECTION)
            .find_one(doc! {"steam_id": steam_id}, None)
            .await
            .unwrap()
        {
            Some(doc.into())
        } else {
            None
        }
    }

    /// Collects all users
    pub async fn all(db: &mongodb::Database) -> Vec<Self> {
        let mut users: Vec<User> = vec![];
        let mut cursor = db
            .collection(User::COLLECTION)
            .find(doc! {}, None)
            .await
            .unwrap();

        while let Some(result) = cursor.next().await {
            match result {
                Ok(document) => {
                    users.push(document.into());
                }
                Err(oops) => error!("User::all Error: {}", oops),
            }
        }

        users
    }

    /// Returns true if any permission flag is set for this user.
    pub fn has_permission(&self, permission: UserPermission) -> bool {
        self.permissions.intersects(permission)
    }

    /// Returns true if all permission flags are set for this user.
    pub fn has_all_permissions(&self, permissions: UserPermission) -> bool {
        self.permissions.contains(permissions)
    }

    pub async fn save(&self, db: &mongodb::Database) {
        let doc: Document = self.into();

        db.collection(User::COLLECTION)
            .update_one(doc! {"_id": doc.get("_id").unwrap()}, doc, None)
            .await
            .unwrap();
    }

    pub fn to_document<'a>(&self) -> mongodb::bson::document::Document {
        bson::to_bson(&self)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned()
    }
}

impl From<&User> for mongodb::bson::document::Document {
    fn from(user: &User) -> Self {
        bson::to_bson(user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned()
    }
}

impl From<mongodb::bson::document::Document> for User {
    fn from(user_doc: mongodb::bson::document::Document) -> Self {
        bson::from_document(user_doc).unwrap()
    }
}

/// Extractor for route handlers.
///
/// Comes with automatic authentication check:
/// - Require session id
/// - Find user in database
/// - Check permissions
impl FromRequest for User {
    type Config = ();
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, pl: &mut Payload) -> Self::Future {
        let id = Identity::from_request(&req, pl).into_inner();
        let db = req
            .app_data::<web::Data<mongodb::Database>>()
            .expect("web::Data<mongodb::Database> is required for this route")
            .clone();

        Box::pin(async move {
            if let Ok(identity) = id {
                if let Some(steam_id) = identity.identity() {
                    let user = User::find(&db, steam_id)
                        .await
                        .expect("user not found in database");

                    if let UserStatus::Inactive(_) = user.status {
                        Log::new(
                            user.steam_id,
                            "Disallowed access of inactive user".to_string(),
                        )
                        .save(&db)
                        .await;
                    } else if let UserStatus::Banned(_) = user.status {
                        Log::new(
                            user.steam_id,
                            "Disallowed access of banned user".to_string(),
                        )
                        .save(&db)
                        .await;
                    } else {
                        return Ok(user);
                    }
                }
            }

            Err(ServiceError::Unauthorized.into())
        })
    }
}
