use actix_http::{Error, error::ErrorBadRequest};
use actix_web::{web, HttpResponse};
use chrono::Utc;
use validator::Validate;

use crate::{errors, models};
use models::user::*;

#[get("/@me")]
async fn me(user: User) -> HttpResponse {
    HttpResponse::Ok().json(user)
}

#[get("/all")]
async fn all(user: User, db: web::Data<mongodb::Database>) -> HttpResponse {
    if user.has_permission(UserPermission::MODIFY_USER) {
        HttpResponse::Ok().json(User::all(db.get_ref()).await)
    } else {
        HttpResponse::InternalServerError().json(errors::REQUIRES_PERMISSION)
    }
}

#[patch("/edit")]
async fn edit(data: web::Json<UserEdit>, user: User, db: web::Data<mongodb::Database>) -> Result<HttpResponse, Error> {
    data.validate().map_err(ErrorBadRequest)?;

    if let Some(mut target_user) = User::find(db.get_ref(), data.steam_id.to_owned()).await {
        let self_edit = target_user.steam_id == user.steam_id;

        if self_edit || user.has_permission(UserPermission::MODIFY_USER) {
            target_user.settings = data.settings.clone();

            if !self_edit {
                if user.has_permission(UserPermission::MODIFY_USER_PERMISSION) {
                    target_user.permissions = data.permissions;
                }

                if user.has_permission(UserPermission::MODIFY_USER_STATUS) {
                    target_user.status = data.status.clone();
                }
            }

            target_user.last_edit = Utc::now();

            target_user.save(db.get_ref()).await;

            Ok(HttpResponse::Ok().json(target_user))
        } else {
            Ok(HttpResponse::InternalServerError().json(errors::REQUIRES_PERMISSION))
        }
    } else {
        Ok(HttpResponse::InternalServerError().json(errors::USER_NOT_FOUND))
    }
}

#[get("/{steam_id}")]
async fn by_id(steam_id: web::Path<u64>, db: web::Data<mongodb::Database>) -> HttpResponse {
    match User::find(db.get_ref(), steam_id.to_string()).await {
        Some(user) => HttpResponse::Ok().json(user),
        None => HttpResponse::InternalServerError().json(errors::USER_NOT_FOUND),
    }
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/users")
            .service(me)
            .service(all)
            .service(edit)
            .service(by_id)
    );
}
