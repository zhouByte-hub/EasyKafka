use crate::config::EasyKafkaConfig;
use crate::entity::db_entity::cluster;
use crate::infra::sql_infra::get_connect;
use crate::{EasyKafkaError, EasyKafkaResult};
use log::info;
use rdkafka::{admin::AdminClient, client::DefaultClientContext, ClientConfig};
use sea_orm::EntityTrait;

pub async fn create_kafka_admin_client(
    token: &str,
    config: &EasyKafkaConfig,
) -> EasyKafkaResult<AdminClient<DefaultClientContext>> {
    info!("create_kafka_admin_client");
    let db_connect = get_connect(&config.database).await?;
    let find_result = cluster::Entity::find_by_id(token).one(&db_connect).await?;

    info!("create_kafka_admin_client find_result: {:?}", find_result);
    match find_result {
        Some(connect) => {
            let mut client_config = ClientConfig::new();
            client_config.set("bootstrap.servers", connect.servers.as_str());
            if let Some(username) = connect.username.as_deref() {
                client_config.set("sasl.username", username);
            }
            if let Some(password) = connect.password.as_deref() {
                client_config.set("sasl.password", password);
            }
            if connect.ssl {
                client_config.set("security.protocol", "SASL_SSL");
            } else {
                client_config.set("security.protocol", "SASL_PLAINTEXT");
            }
            client_config.set("socket.timeout.ms", connect.timeout.to_string());
            Ok(client_config.create()?)
        }
        None => Err(EasyKafkaError::KafkaConnectNotFound(token.to_string())),
    }
}
