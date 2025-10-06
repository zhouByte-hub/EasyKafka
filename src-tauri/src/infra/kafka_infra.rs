use crate::config::EasyKafkaConfig;
use crate::entity::db_entity::{connect_properties, kafka_connect};
use crate::infra::sql_infra::get_connect;
use crate::EasyKafkaError;
use crate::EasyKafkaResult;
use rdkafka::admin::AdminClient;
use rdkafka::client::DefaultClientContext;
use rdkafka::ClientConfig;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub async fn create_kafka_admin_client(
    token: &str,
    config: &EasyKafkaConfig,
) -> EasyKafkaResult<AdminClient<DefaultClientContext>> {
    let db_connect = get_connect(&config.database).await?;
    let find_result = kafka_connect::Entity::find_by_id(token)
        .one(&db_connect)
        .await?;

    match find_result {
        Some(connect) => {
            let mut client_config = ClientConfig::new();
            let props = connect_properties::Entity::find()
                .filter(connect_properties::Column::ConnectId.eq(connect.id))
                .all(&db_connect)
                .await?;
            for prop in props {
                client_config.set(prop.property_name, prop.property_value);
            }
            Ok(client_config.create()?)
        }
        None => Err(EasyKafkaError::KafkaConnectNotFound(token.to_string())),
    }
}
