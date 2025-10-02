// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub(crate) mod kafka_error;
pub(crate) mod handles;
pub(crate) mod infra;
pub(crate) mod utils;
pub(crate) mod mcp;

fn main() {
    easy_kafka_lib::run()
}
