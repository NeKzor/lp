#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate actix_web;
use actix_cors::Cors;
use actix_files::Files;
use actix_web::body::Body;
use actix_web::http::header;
use actix_web::{
    guard,
    middleware::{Compress, Logger},
    web, App, HttpResponse, HttpServer,
};

mod logger;
mod middleware;
mod routes;

use middleware::*;
use routes::*;

async fn csr_app() -> HttpResponse {
    HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "text/html; charset=UTF-8")
        .body(Body::from(include_str!("../../build/index.html")))
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::new()
                    .allowed_origin("http://127.0.0.1:8080")
                    .allowed_origin("http://localhost:3000")
                    .allowed_origin("http://lp.nekz.me")
                    .allowed_methods(vec!["GET"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                    .allowed_header(header::CONTENT_TYPE)
                    .max_age(3600)
                    .finish(),
            )
            .wrap(Compress::default())
            .configure(v1::api::init)
            .service(
                Files::new("/rules", "./rules/book/")
                    .index_file("index.html")
                    .disable_content_disposition()
                    .redirect_to_slash_directory(),
            )
            .service(
                web::scope("").wrap_fn(cache_control).service(
                    Files::new("/static", "./build/static/").disable_content_disposition(),
                ),
            )
            .service(
                Files::new("/", "./build/")
                    .index_file("index.html")
                    .disable_content_disposition(),
            )
            .default_service(
                web::resource("").route(web::get().to(csr_app)).route(
                    web::route()
                        .guard(guard::Not(guard::Get()))
                        .to(HttpResponse::MethodNotAllowed),
                ),
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
