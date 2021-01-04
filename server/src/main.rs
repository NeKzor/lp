#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate actix_web;
extern crate bitflags;
use actix_cors::Cors;
use actix_files::Files;
use actix_http::{body::Body, http::header};
use actix_identity::{CookieIdentityPolicy, IdentityService};
use actix_web::{
    guard,
    middleware::{Compress, Logger},
    web, App, Error, HttpResponse, HttpServer,
};
use clap::Clap;
use dotenv::dotenv;
use futures::stream::StreamExt;
use mongodb::{
    bson::{doc, Bson},
    Client,
};
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use rand::Rng;

mod errors;
mod logger;
mod middleware;
mod models;
mod routes;

use middleware::*;
use routes::*;

#[derive(Clap)]
#[clap(version = "2.0.0", author = "NeKz")]
struct Opts {
    /// Local address the server should bind to.
    #[clap(short, long, default_value = "127.0.0.1")]
    address: String,
    /// Local port the server should bind to.
    #[clap(short, long, default_value = "8080")]
    port: String,
    /// Local address of the CSR app that the server should allow when in development mode.
    #[clap(long, default_value = "3000")]
    app_port: String,
    #[clap(short, long)]
    /// Enable https. Requires SSL key and certficate.
    enable_ssl: bool,
    /// Path to SSL key when SSL. Required when SSL is enabled.
    #[clap(long, default_value = "127.0.0.1-key.pem")]
    ssl_key: String,
    ///Path to SSL certifcate when SSL. Required when SSL is enabled.
    #[clap(long, default_value = "127.0.0.1.pem")]
    ssl_cert: String,
    /// Development mode in local build environment
    #[clap(short, long)]
    development: bool,
    /// Domain name of server for CORS settings.
    #[clap(long, default_value = "lp.nekz.me")]
    domain_name: String,
}

async fn csr_app() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok()
        .header(header::CONTENT_TYPE, "text/html; charset=UTF-8")
        .body(Body::from(std::fs::read_to_string("./build/index.html")?)))
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    logger::init();

    let _ = std::env::var("STEAM_API_KEY").expect("env var STEAM_API_KEY not set");

    let opts = Opts::parse();

    let address = format!("{}:{}", opts.address, opts.port);

    let development = opts.development;
    let enable_ssl = opts.enable_ssl;
    let app_port = opts.app_port;
    let domain_name = opts.domain_name;

    let db_name = std::env::var("DB_NAME").expect("env var DB_NAME not set");

    let db_uri = format!(
        "mongodb://{user}:{pass}@localhost:{port}/{name}",
        user = std::env::var("DB_USER").expect("env var DB_USER not set"),
        pass = std::env::var("DB_PASS").expect("env var DB_PASS not set"),
        port = std::env::var("DB_PORT").expect("env var DB_PORT not set"),
        name = db_name
    );

    let client = Client::with_uri_str(db_uri.as_ref()).await.unwrap();

    let db = client.database(db_name.as_ref());

    // TODO: make this persistent in production
    let private_key = rand::thread_rng().gen::<[u8; 32]>();

    let protocol = if enable_ssl { "https://" } else { "http://" };

    let host_address = if development {
        format!("{}{}", protocol, address)
    } else {
        format!("{}{}", protocol, domain_name)
    };

    let redirector = steam_auth::Redirector::new(host_address.clone(), "/login/steam").unwrap();

    let server = HttpServer::new(move || {
        let cors = {
            let cors = Cors::default()
                .allowed_origin(host_address.as_ref())
                .allowed_methods(vec!["GET", "POST"])
                .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                .allowed_header(header::CONTENT_TYPE)
                .max_age(3600);
    
            if development {
                cors.allowed_origin(format!("http://localhost:{}", app_port).as_ref())
            } else {
                cors
            }
        };

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .wrap(Compress::default())
            .configure(v1::api::init)
            .service(
                Files::new("/rules", "./rules/book/")
                    .index_file("index.html")
                    .disable_content_disposition()
                    .redirect_to_slash_directory(),
            )
            .service(
                web::scope("/static")
                    .wrap_fn(cache_control)
                    .service(Files::new("/", "./build/static/").disable_content_disposition()),
            )
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(&private_key)
                    .name("lp-auth")
                    .path("/")
                    .max_age(604800)
                    .secure(enable_ssl),
            ))
            .data(db.clone())
            .data(redirector.clone())
            .configure(login::init)
            .configure(logs::init)
            .configure(records::init)
            .configure(users::init)
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

#[allow(dead_code)]
pub mod tests {
    use super::*;

    async fn find_users() -> mongodb::error::Result<()> {
        let db_name = std::env::var("DB_NAME").expect("env var DB_NAME not set");

        let db_uri = format!(
            "mongodb://{user}:{pass}@localhost:{port}/{name}",
            user = std::env::var("DB_USER").expect("env var DB_USER not set"),
            pass = std::env::var("DB_PASS").expect("env var DB_PASS not set"),
            port = std::env::var("DB_PORT").expect("env var DB_PORT not set"),
            name = db_name.clone()
        );

        let client = Client::with_uri_str(db_uri.as_ref()).await.unwrap();

        let db = client.database(db_name.as_ref());

        let mut users = db.collection("users").find(doc! {}, None).await.unwrap();

        while let Some(result) = users.next().await {
            match result {
                Ok(document) => {
                    if let Some(name) = document.get("name").and_then(Bson::as_str) {
                        println!("user: {}", name);
                    } else {
                        println!("no user found");
                    }
                }
                Err(e) => println!("{:?}", e),
            }
        }

        Ok(())
    }

    #[test]
    fn db_test() {
        dotenv().ok();

        let _ = futures::executor::block_on(async { find_users().await });
    }
}
