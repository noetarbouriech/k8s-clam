use axum::Json;
use axum::response::Response;
use axum::routing::post;
use exploits::command;
use exploits::kubectl_install;

use axum::http::{self, StatusCode};
use axum::response::IntoResponse;
use axum::{Router, routing::get};
use exploits::fork_bomb;
use exploits::overflow;
use serde::Deserialize;
use tower::ServiceBuilder;
use tower_http::cors::{AllowHeaders, Any, CorsLayer};
use tracing::info;

#[derive(Deserialize)]
struct Command {
    command: String,
}

mod exploits;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors_layer = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([http::Method::GET, http::Method::POST])
        .allow_headers(AllowHeaders::any());

    let app = Router::new()
        .route("/", get(root))
        .route("/fork-bomb", get(fork_bomb::fork_loop))
        .route("/overflow-memory", get(overflow::overflow_memory))
        .route("/exec", post(execute_command_handler))
        .route("/kubectl-install", get(kubectl_install_handler))
        .route("/health", get(health_check))
        .layer(ServiceBuilder::new().layer(cors_layer));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("API is ready and listening on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
}

async fn execute_command_handler(Json(payload): Json<Command>) -> impl IntoResponse {
    let command_with_args = payload.command;
    info!("executing command: {:?}", command_with_args);
    let mut parts = command_with_args.split_whitespace();
    let command = parts.next().unwrap_or_default().to_string();
    let args: Vec<String> = parts.map(String::from).collect();

    match command::execute_command(
        &command,
        &args.iter().map(String::as_str).collect::<Vec<&str>>(),
    ) {
        Ok(output) => {
            info!("Command executed successfully");
            let response = serde_json::json!({
            "output": {
                "stdout": String::from_utf8(output.stdout).unwrap(),
                "stderr": String::from_utf8(output.stderr).unwrap()
            },
            "type": "success"
            });
            (StatusCode::OK, Json(response))
        }
        Err(err) => {
            info!("Error executing command: {:?}", err);
            let response = serde_json::json!({});
            (StatusCode::INTERNAL_SERVER_ERROR, Json(response))
        }
    }
}

async fn kubectl_install_handler() -> impl IntoResponse {
    match kubectl_install::kubectl_install().await {
        Ok(response) => response,
        Err(_) => Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(axum::body::Body::from("Error installing kubectl"))
            .unwrap(),
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
