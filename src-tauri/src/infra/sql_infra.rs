use crate::config::DatabaseConfig;
use crate::EasyKafkaResult;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use tokio::time::Duration;

/**
 * SeaORM 使用连接池自动管理连接，你不需要手动提交事务或关闭连接
 * 当一个方法中存在多个事务的时候，可以开启手动事务
 */
pub async fn get_connect(database_config: &DatabaseConfig) -> EasyKafkaResult<DatabaseConnection> {
    let mut options = ConnectOptions::new(database_config.url.clone());
    options
        .max_connections(database_config.max_connections)
        .min_connections(database_config.min_connections)
        .connect_timeout(Duration::from_secs(database_config.connect_timeout))
        .idle_timeout(Duration::from_secs(database_config.idle_timeout))
        .max_lifetime(Duration::from_secs(database_config.max_lifetime))
        .sqlx_logging(database_config.sqlx_logging);
    Ok(Database::connect(options).await?)
}
