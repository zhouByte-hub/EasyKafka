use crate::kafka_error::EasyKafkaError;

pub(crate) mod config;
pub(crate) mod entity;
pub(crate) mod handles;
pub(crate) mod infra;
pub(crate) mod kafka_error;
pub(crate) mod mcp;
pub(crate) mod utils;

pub type EasyKafkaResult<T> = Result<T, EasyKafkaError>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() -> EasyKafkaResult<()> {
    let config = config::read_config().await?;

    tauri::Builder::default()
        .manage(config)
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            handles::dashboard::dashboard_statistics
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
