#![feature(proc_macro_hygiene, decl_macro)]
use std::io::Write;

use chrono::Local;
use env_logger::Builder;
use log::LevelFilter;

#[macro_use]
extern crate actix_web;
use actix_cors::Cors;
use actix_files::Files;
use actix_web::http::header;
use actix_web::{guard, middleware, web, App, HttpResponse, HttpServer};

mod routes;
use routes::*;

fn init_logger() {
    Builder::new()
        .format(|buf, record| {
            let mut local_style = buf.style();
            local_style.set_color(env_logger::fmt::Color::Rgb(171, 171, 171));

            let level_style = buf.default_level_style(record.level());

            writeln!(
                buf,
                "{} [{}] - {}",
                local_style.value(Local::now().format("%Y-%m-%d %H:%M:%S")),
                level_style.value(record.level()),
                record.args()
            )
        })
        .filter(None, LevelFilter::Info)
        .init();
}

async fn page_not_found() -> HttpResponse {
    HttpResponse::NotFound().body("page not found :(")
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    init_logger();

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(
                Cors::new()
                    .allowed_origin("http://127.0.0.1:8080")
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                    .allowed_header(header::CONTENT_TYPE)
                    .max_age(3600)
                    .finish(),
            )
            .configure(v1::api::init)
            .service(Files::new("/rules", "./rules/book/").index_file("index.html"))
            .service(Files::new("/", "./build/"))
            .default_service(
                web::resource("")
                    .route(web::get().to(page_not_found))
                    .route(
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
