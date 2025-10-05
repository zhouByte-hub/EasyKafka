use serde::{Deserialize, Serialize};

use crate::EasyKafkaResult;

#[derive(Debug, Serialize, Deserialize)]
pub struct EasyKafkaConfig {
    pub database: DatabaseConfig,
    pub log: LogConfig,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    pub min_connections: u32,
    pub connect_timeout: u64,
    pub idle_timeout: u64,
    pub max_lifetime: u64,
    pub sqlx_logging: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LogConfig {
    pub level: String,
    pub directory: String,
    pub basename: String,
    pub suffix: String,
}

pub async fn read_config() -> EasyKafkaResult<EasyKafkaConfig> {
    let content = tokio::fs::read_to_string("config/config.toml").await?;
    let config: EasyKafkaConfig = toml::from_str(&content)?;
    Ok(config)
}

#[cfg(test)]
mod config_test {
    use crate::{config::read_config, EasyKafkaResult};

    #[tokio::test]
    async fn test() -> EasyKafkaResult<()> {
        let config = read_config().await?;
        println!("{:?}", config);
        Ok(())
    }
}
