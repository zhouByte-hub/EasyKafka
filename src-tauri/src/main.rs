// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use easy_kafka_lib;

#[tokio::main]
async fn main() -> easy_kafka_lib::EasyKafkaResult<()> {
    easy_kafka_lib::run().await
}
