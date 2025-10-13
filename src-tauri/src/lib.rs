use flexi_logger::{DeferredNow, Logger, Record};

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
    // 读取配置
    let config = config::read_config().await?;
    // 初始化日志
    Logger::try_with_str(&config.log.level)?
        .log_to_stdout()
        .format(console_log_format)
        .write_mode(flexi_logger::WriteMode::Direct)
        .start()?;

    tauri::Builder::default()
        .manage(config)
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            handles::dashboard_handles::dashboard_statistics,
            handles::cluster_handles::cluster_list,
            handles::cluster_handles::cluster_create_or_update,
            handles::cluster_handles::check_connect,
            handles::cluster_handles::delete_cluster,
            handles::topic_handles::load_topic_config_template,
            handles::topic_handles::create_topic,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

// 自定义日志格式
fn console_log_format(
    w: &mut dyn std::io::Write,
    now: &mut DeferredNow,
    record: &Record,
) -> std::io::Result<()> {
    let file_name = record
        .file()
        .unwrap_or("<unkonw>")
        .split('/')
        .last()
        .unwrap_or("<unkonw>");
    write!(
        w,
        "[{}][{}][{}][{}:{}] - {}",
        now.now().format("%Y-%m-%d %H:%M:%S%.3f"),
        record.level(),
        record.module_path().unwrap_or("<unkonwn>"),
        file_name,
        record.line().unwrap_or(0),
        &record.args()
    )
}
