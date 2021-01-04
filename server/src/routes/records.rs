use actix_http::{error::ErrorBadRequest, Error};
use actix_web::{web, HttpResponse};
use chrono::Utc;
use validator::Validate;

use crate::{errors, models};
use models::record::*;
use models::user::*;

#[get("/all")]
pub async fn all(db: web::Data<mongodb::Database>) -> HttpResponse {
    HttpResponse::Ok().json(Record::all(db.get_ref()).await)
}

#[patch("/edit")]
pub async fn edit(
    data: web::Json<RecordEdit>,
    user: User,
    db: web::Data<mongodb::Database>,
) -> Result<HttpResponse, Error> {
    data.validate().map_err(ErrorBadRequest)?;

    if user.has_permission(UserPermission::MODIFY_RECORD) {
        if let Some(mut record) = Record::find(db.get_ref(), data.steam_id).await {
            record.wr = data.wr;
            record.limit = data.limit;
            record.last_edit = Utc::now();

            record.save(db.get_ref()).await;

            Ok(HttpResponse::Ok().json(record))
        } else {
            Ok(HttpResponse::InternalServerError().json(errors::RECORD_NOT_FOUND))
        }
    } else {
        Ok(HttpResponse::InternalServerError().json(errors::REQUIRES_PERMISSION))
    }
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/records").service(all).service(edit));
}
