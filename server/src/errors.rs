use actix_web::{error::ResponseError, HttpResponse};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorResponse<'a> {
    pub error: &'a str,
}

macro_rules! error_struct {
    ($var_name:ident, $message:expr) => {
        #[allow(dead_code)]
        pub const $var_name: ErrorResponse = ErrorResponse { error: $message };
    };
}

#[inline]
pub fn make<'a>(message: &'a String) -> ErrorResponse {
    ErrorResponse {
        error: message.as_ref(),
    }
}

error_struct!(INTERNAL_SERVER_ERROR, "Internal server error.");
error_struct!(BAD_REQUEST, "Bad request.");
error_struct!(UNAUTHORIZED, "Unauthorized.");
error_struct!(NOT_LOGGED_IN, "Not logged in.");
error_struct!(USER_NOT_FOUND, "User not found.");
error_struct!(REQUIRES_PERMISSION, "Requires permission.");
error_struct!(RECORD_NOT_FOUND, "Record not found.");
error_struct!(USER_BANNED, "Forbidden access (banned).");
error_struct!(USER_INACIVE, "Forbidden access (inactive).");
error_struct!(ALREADY_LOGGED_IN, "Already logged in.");

#[derive(Debug)]
pub enum ServiceError {
    #[allow(dead_code)]
    InternalServerError,
    #[allow(dead_code)]
    BadRequest(String),
    Unauthorized,
}

impl ResponseError for ServiceError {
    fn error_response(&self) -> HttpResponse {
        match self {
            ServiceError::InternalServerError => {
                HttpResponse::InternalServerError().json(INTERNAL_SERVER_ERROR)
            }
            ServiceError::BadRequest(ref message) => {
                HttpResponse::BadRequest().json(make(&format!("Bad request: {}", message)))
            }
            ServiceError::Unauthorized => HttpResponse::Unauthorized().json(UNAUTHORIZED),
        }
    }
}

impl std::fmt::Display for ServiceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ServiceError::InternalServerError => write!(f, "Internal Server Error."),
            ServiceError::BadRequest(ref message) => write!(f, "Bad Request: {}", message),
            ServiceError::Unauthorized => write!(f, "Unauthorized."),
        }
    }
}
