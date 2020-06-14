use actix_web::{body::Body, http::header, web, Error, HttpResponse};

#[get("/records")]
async fn records() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(std::fs::read_to_string("./api/records.json")?)))
}

#[get("/sp")]
async fn sp() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(std::fs::read_to_string("./api/sp.json")?)))
}

#[get("/mp")]
async fn mp() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(std::fs::read_to_string("./api/mp.json")?)))
}

#[get("/overall")]
async fn overall() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(std::fs::read_to_string("./api/overall.json")?)))
}

#[get("/profiles/{steam_id64}")]
async fn profiles(steam_id64: web::Path<u64>) -> Result<HttpResponse, Error> {
    let file = format!("./api/profiles/{}.json", steam_id64.into_inner());
    Ok(HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(std::fs::read_to_string(file)?)))
}

async fn index() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "text/html; charset=UTF-8")
        .body(Body::from(include_str!("index.html"))))
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .service(records)
            .service(sp)
            .service(mp)
            .service(overall)
            .service(profiles)
            .default_service(web::route().to(index)),
    );
}
