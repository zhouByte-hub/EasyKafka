use tauri::ipc::InvokeError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum EasyKafkaError {
    #[error("IO Error: {0}")]
    IOError(#[from] std::io::Error),

    #[error("JSON Error: {0}")]
    JSONError(#[from] serde_json::Error),

    #[error("JWT Error: {0}")]
    JWTError(#[from] jsonwebtoken::errors::Error),

    #[error("Other Error: {0}")]
    StdError(#[from] Box<dyn std::error::Error>),
}

impl Into<InvokeError> for EasyKafkaError {
    fn into(self) -> InvokeError {
        InvokeError::from(self.to_string())
    }
}
