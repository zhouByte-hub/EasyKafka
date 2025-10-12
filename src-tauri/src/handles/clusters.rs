use crate::entity::db_entity::cluster;
use crate::entity::response::cluster::ClusterListResponseBuilder;
use crate::entity::response::common::CommonResponse;
use crate::infra::kafka_infra::create_kafka_admin_client;
use crate::infra::sql_infra::get_connect;
use crate::{config::EasyKafkaConfig, entity::response::cluster::ClusterListResponse};
use crate::{EasyKafkaError, EasyKafkaResult};
use rdkafka::util::Timeout;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, Set};
use tauri::State;
use tokio::time::Duration;
use uuid::Uuid;

#[tauri::command]
pub async fn cluster_list(
    config: State<'_, EasyKafkaConfig>,
) -> EasyKafkaResult<Vec<ClusterListResponse>> {
    let db_connect = get_connect(&config.database).await?;
    let cluster = cluster::Entity::find().all(&db_connect).await?;

    let mut result = Vec::new();
    for item in cluster {
        let response = ClusterListResponseBuilder::default()
            .id(item.id.clone())
            .servers(item.servers.clone())
            .cluster_name(item.cluster_name.clone())
            .timeout(item.timeout)
            .ssl(item.ssl)
            .sasl(item.sasl.clone())
            .connected(item.connected)
            .build()
            .map_err(|e| {
                EasyKafkaError::KafkaConnectNotFound(format!("Failed to build response: {:?}", e))
            })?;
        result.push(response);
    }
    Ok(result)
}

#[tauri::command]
pub async fn cluster_create_or_update(
    config: State<'_, EasyKafkaConfig>,
    model: cluster::Model,
) -> EasyKafkaResult<CommonResponse<String>> {
    let db_connect = get_connect(&config.database).await?;
    let is_new_record = model.id.is_empty();

    let active_model = cluster::ActiveModel {
        id: Set(if is_new_record {
            Uuid::new_v4().to_string()
        } else {
            model.id
        }),
        servers: Set(model.servers),
        cluster_name: Set(model.cluster_name),
        username: Set(model.username),
        password: Set(model.password),
        timeout: Set(model.timeout),
        ssl: Set(model.ssl),
        sasl: Set(model.sasl),
        connected: Set(model.connected),
    };
    if is_new_record {
        cluster::Entity::insert(active_model)
            .exec(&db_connect)
            .await?;
    } else {
        cluster::Entity::update(active_model)
            .exec(&db_connect)
            .await?;
    };
    Ok(CommonResponse::success("操作成功".to_string()))
}

#[tauri::command]
pub async fn check_connect(
    token: &str,
    config: State<'_, EasyKafkaConfig>,
) -> EasyKafkaResult<CommonResponse<String>> {
    if token.is_empty() {
        return Ok(CommonResponse::error("token不能为空".to_string()));
    }
    let (admin_client, connect) = create_kafka_admin_client(token, &config).await?;
    match admin_client.inner().fetch_metadata(
        None,
        Timeout::from(Duration::from_millis(connect.timeout as u64)),
    ) {
        Ok(metadata) => Ok(CommonResponse::success(format!(
            "连接成功，broker数量: {}",
            metadata.brokers().len()
        ))),
        Err(_) => Ok(CommonResponse::error("Kafka连接失败".to_string())),
    }
}

#[tauri::command]
pub async fn delete_cluster(
    token: &str,
    config: State<'_, EasyKafkaConfig>,
) -> EasyKafkaResult<CommonResponse<String>> {
    if token.is_empty() {
        return Ok(CommonResponse::error("token不能为空".to_string()));
    }
    let db_connect = get_connect(&config.database).await?;
    cluster::Entity::delete_many()
        .filter(cluster::Column::Id.eq(token))
        .exec(&db_connect)
        .await?;
    Ok(CommonResponse::success("删除成功".to_string()))
}
