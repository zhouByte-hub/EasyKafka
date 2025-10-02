use tauri::ipc::InvokeError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum EasyKafkaError {
    #[error("IO Error: {0}")]
    IOError(#[from] std::io::Error),

}

impl Into<InvokeError> for EasyKafkaError {
    fn into(self) -> InvokeError {
        InvokeError::from(self.to_string())
    }
}
