use crate::config::EasyKafkaConfig;
use crate::entity::db_entity::cluster;
use crate::entity::response::common::CommonResponse;
use crate::infra::kafka_infra::create_kafka_admin_client;
use crate::infra::sql_infra::get_connect;
use crate::EasyKafkaResult;
use sea_orm::EntityTrait;
use sea_orm::Set;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub async fn cluster_list(
    config: State<'_, EasyKafkaConfig>,
) -> EasyKafkaResult<Vec<cluster::Model>> {
    let db_connect = get_connect(&config.database).await?;
    Ok(cluster::Entity::find().all(&db_connect).await?)
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
        connected: Set(model.connected)
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
    match create_kafka_admin_client(token, &config).await {
        Ok(_) => Ok(CommonResponse::success("连接成功".to_string())),
        Err(e) => Ok(CommonResponse::error(format!("{:?}", e))),
    }
}
