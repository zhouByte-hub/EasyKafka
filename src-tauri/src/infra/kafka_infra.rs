use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use once_cell::sync::OnceCell;
use rdkafka::client::Client;

// Kafka连接池类型
pub type KafkaClientPool = Mutex<HashMap<String, Arc<Client>>>;

// 静态连接池 - 使用互斥锁确保线程安全
pub static KAFKA_CONNECT_POOL: OnceCell<KafkaClientPool> = OnceCell::new();

// fn create_kafka_client(token: &str) -> Client {

// }
