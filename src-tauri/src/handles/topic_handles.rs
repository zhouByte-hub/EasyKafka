use crate::config::EasyKafkaConfig;
use crate::{
    entity::{db_entity::topics, response::common::CommonResponse},
    infra::sql_infra::get_connect,
    EasyKafkaError, EasyKafkaResult,
};
use sea_orm::ActiveModelTrait;
use tauri::State;

#[tauri::command]
pub async fn load_topic_config_template() -> EasyKafkaResult<String> {
    tokio::fs::read_to_string("config/topicConfigTemplate.json")
        .await
        .map_err(|e| EasyKafkaError::IOError(e.into()))
}

#[tauri::command]
pub async fn create_topic(
    topic: topics::Model,
    config: State<'_, EasyKafkaConfig>,
) -> EasyKafkaResult<CommonResponse<String>> {
    let db_connect = get_connect(&config.database).await?;
    let res = topics::ActiveModel::from(topic).insert(&db_connect).await;
    match res {
        Ok(_) => Ok(CommonResponse::success("success".to_string())),
        Err(_) => Ok(CommonResponse::error("create topic failed".to_string())),
    }
}
