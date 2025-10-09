use rdkafka::error::KafkaError;
use tauri::ipc::InvokeError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum EasyKafkaError {
    #[error("IO Error: {0}")]
    IOError(#[from] std::io::Error),

    #[error("JSON Error: {0}")]
    JSONError(#[from] serde_json::Error),

    #[error("Kafka Error: {0}")]
    KafkaError(#[from] KafkaError),

    #[error("Kafka Connect Not Found: {0}")]
    KafkaConnectNotFound(String),

    #[error("Other Error: {0}")]
    StdError(#[from] Box<dyn std::error::Error>),

    #[error("Toml Error: {0}")]
    TomlError(#[from] toml::de::Error),

    #[error("SQL Error: {0}")]
    SqlError(#[from] sea_orm::DbErr),
}

impl Into<InvokeError> for EasyKafkaError {
    fn into(self) -> InvokeError {
        InvokeError::from(self.to_string())
    }
}
