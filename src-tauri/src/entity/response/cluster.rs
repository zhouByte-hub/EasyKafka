
use derive_builder::Builder;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Builder)]
pub struct ClusterListResponse{
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