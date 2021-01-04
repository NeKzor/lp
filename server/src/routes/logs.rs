use crate::{
    errors,
    models::{
        log::{Log, LogFilter},
        user::{User, UserPermission},
    },
};
use actix_http::{error::ErrorBadRequest, Error};
use actix_web::{web, HttpResponse};
use validator::Validate;

#[post("/all")]
async fn all(
    data: web::Data<LogFilter>,
    user: User,
    db: web::Data<mongodb::Database>,
) -> Result<HttpResponse, Error> {
    data.validate().map_err(ErrorBadRequest)?;

    if user.has_permission(UserPermission::VIEW_CHANGELOG) {
        Ok(HttpResponse::Ok().json(Log::all(db.get_ref(), data.get_ref()).await))
    } else {
        Ok(HttpResponse::InternalServerError().json(errors::REQUIRES_PERMISSION))
    }
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/logs").service(all));
}
