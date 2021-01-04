use actix_identity::Identity;
use actix_web::HttpRequest;
use actix_web::{web, HttpResponse};

use crate::models;
use models::log::*;
use models::user::*;

/// Redirect to Steam servers.
async fn login(redirector: web::Data<steam_auth::Redirector>) -> HttpResponse {
    HttpResponse::Found()
        .header("location", redirector.get_ref().url().as_str())
        .finish()
}

/// Redirect from Steam servers.
/// - Verifies auth data
/// - Creates new user if they do not exist yet
/// - Updates login data
async fn steam(id: Identity, db: web::Data<mongodb::Database>, req: HttpRequest) -> HttpResponse {
    let query = req.uri().query().unwrap();
    let (req, verifier) = steam_auth::Verifier::from_querystring(query).unwrap();
    let (parts, body) = req.into_parts();

    let text = reqwest::Client::new()
        .post(&parts.uri.to_string())
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(body)
        .send()
        .await
        .expect("Steam server error")
        .text()
        .await
        .expect("Failed to read response text");

    match verifier.verify_response(text) {
        Ok(steam_id) => {
            let mut user = match User::find(db.get_ref(), steam_id.to_string()).await {
                Some(user) => {
                    // Inactive users are not allowed to login at all so we bail out early
                    if let UserStatus::Inactive(reason) = user.status {
                        Log::new(
                            steam_id.to_string(),
                            "inactive user tried to log in".to_string(),
                        )
                        .save(db.get_ref())
                        .await;

                        return HttpResponse::Ok()
                            .body(format!("account deactivated, reason: {}", reason));
                    }

                    user
                }
                None => User::new(steam_id.to_string()),
            };

            if let Err(oops) = user.update_login().await {
                Log::new(
                    steam_id.to_string(),
                    format!("update_login error: {}", oops),
                )
                .save(db.get_ref())
                .await;
            }

            user.save(db.get_ref()).await;

            id.remember(steam_id.to_string());

            HttpResponse::Found().header("location", "/").finish()
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

/// Remove session ID.
async fn logout(id: Identity) -> HttpResponse {
    id.forget();
    HttpResponse::Found().header("location", "/").finish()
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/login").to(login))
        .service(web::resource("/login/steam").to(steam))
        .service(web::resource("/logout").to(logout));
}
