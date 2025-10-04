use once_cell::sync::OnceCell;
use rdkafka::admin::AdminClient;
use rdkafka::client::DefaultClientContext;
use rdkafka::ClientConfig;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use crate::utils::token::parse_token;
use crate::EasyKafkaError;
use crate::EasyKafkaResult;

type KafkaClient = AdminClient<DefaultClientContext>;
pub type KafkaClientPool = Mutex<HashMap<String, Arc<KafkaClient>>>;
pub static KAFKA_CONNECT_POOL: OnceCell<KafkaClientPool> = OnceCell::new();

pub fn create_kafka_client(token: &str) -> EasyKafkaResult<Arc<KafkaClient>> {
    let claims = parse_token(token)?;
    let pool = KAFKA_CONNECT_POOL.get_or_init(|| Mutex::new(HashMap::new()));

    // 先获取锁，手动处理PoisonError
    let mut pool_lock = match pool.lock() {
        Ok(lock) => lock,
        Err(_) => {
            return Err(EasyKafkaError::StdError(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                "Kafka connection pool mutex poisoned",
            ))));
        }
    };
    if !pool_lock.contains_key(&claims.url) {
        let mut client = ClientConfig::new();
        claims.settings.iter().for_each(|(key, value)| {
            client.set(key.as_str(), value.as_str());
        });
        pool_lock.insert(claims.url.clone(), Arc::new(client.create()?));
    }
    let client = pool_lock.get(&claims.url).unwrap().clone();
    Ok(client)
}
