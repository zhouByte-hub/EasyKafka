use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CommonResponse<T> {
    pub code: i32,
    pub msg: String,
    pub data: Option<T>,
}

impl<T> CommonResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            code: 200,
            msg: "success".to_string(),
            data: Some(data),
        }
    }

    pub fn error(msg: String) -> Self {
        Self {
            code: 400,
            msg,
            data: None,
        }
    }
}
