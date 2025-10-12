use derive_builder::Builder;
use getset::{Getters, Setters};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Default, Setters, Getters)]
pub struct ClusterListResponse {
    #[getset(get = "pub", set = "pub")]
    pub current: i32,
    #[getset(get = "pub", set = "pub")]
    pub limit: i32,
    #[getset(get = "pub", set = "pub")]
    pub total: u64,
    #[getset(get = "pub", set = "pub")]
    pub list: Vec<ClusterResponse>,
}

#[derive(Debug, Serialize, Deserialize, Builder, Clone)]
pub struct ClusterResponse {
    pub id: String,

    #[serde(rename = "bootstrapServers")]
    pub servers: String,

    #[serde(rename = "name")]
    pub cluster_name: String,

    pub timeout: i32,

    #[serde(rename = "sslEnabled")]
    pub ssl: bool,

    #[serde(rename = "saslMechanism")]
    pub sasl: Option<String>,

    #[serde(rename = "isActive")]
    pub connected: bool,
}
