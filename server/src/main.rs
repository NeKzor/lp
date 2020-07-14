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
use clap::Clap;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};

mod logger;
mod middleware;
mod routes;

use middleware::*;
use routes::*;

#[derive(Clap)]
#[clap(version = "1.0.0", author = "NeKz")]
struct Opts {
    #[clap(short, long, default_value = "127.0.0.1")]
    address: String,
    #[clap(short, long, default_value = "8080")]
    port: String,
    #[clap(short, long)]
    enable_ssl: bool,
    #[clap(long, default_value = "127.0.0.1-key.pem")]
    ssl_key: String,
    #[clap(long, default_value = "127.0.0.1.pem")]
    ssl_cert: String,
    #[clap(short, long)]
    development: bool,
}

async fn csr_app() -> HttpResponse {
    HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "text/html; charset=UTF-8")
        .body(Body::from(include_str!("../../build/index.html")))
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    logger::init();

    let opts = Opts::parse();

    let address = format!("{}:{}", opts.address, opts.port);

    let development = opts.development;
    let enable_ssl = opts.enable_ssl;

    let server =
        HttpServer::new(move || {
            let mut cors = Cors::new()
                .allowed_methods(vec!["GET"])
                .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                .allowed_header(header::CONTENT_TYPE)
                .max_age(3600);

            if development {
                let protocol = if enable_ssl {
                    "https://"
                } else {
                    "http://"
                };

                cors = cors
                    .allowed_origin(format!("{}{}", protocol, address).as_ref())
                    .allowed_origin("http://localhost:3000");
            } else {
                cors = cors.allowed_origin("http://lp.nekz.me");
            }

            App::new()
                .wrap(Logger::default())
                .wrap(cors.finish())
                .wrap(Compress::default())
                .configure(v1::api::init)
                .service(
                    Files::new("/rules", "./rules/book/")
                        .index_file("index.html")
                        .disable_content_disposition()
                        .redirect_to_slash_directory(),
                )
                .service(web::scope("/static").wrap_fn(cache_control).service(
                    Files::new("/", "./build/static/").disable_content_disposition(),
                ))
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
        });

    let address = format!("{}:{}", opts.address, opts.port);

    if opts.enable_ssl {
        let mut ssl_builder = SslAcceptor::mozilla_intermediate(SslMethod::tls())?;
        ssl_builder.set_private_key_file(opts.ssl_key, SslFiletype::PEM)?;
        ssl_builder.set_certificate_chain_file(opts.ssl_cert)?;

        server.bind_openssl(address, ssl_builder)?.run().await
    } else {
        server.bind(address)?.run().await
    }
}
