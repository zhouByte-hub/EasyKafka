use crate::{
    config::EasyKafkaConfig, entity::response::dashboard::DashboardStatistics,
    infra::kafka_infra::create_kafka_admin_client,
};
use rdkafka::util::Timeout;
use std::time::Duration;
use tauri::State;

use crate::EasyKafkaResult;

#[tauri::command]
pub async fn dashboard_statistics(
    token: &str,
    config: State<'_, EasyKafkaConfig>,
) -> EasyKafkaResult<DashboardStatistics> {
    let client = create_kafka_admin_client(token, &config).await?;
    let mut result = DashboardStatistics::default();

    let metadata = client
        .inner()
        .fetch_metadata(None, Timeout::from(Duration::from_secs(5)))?;
    // broker
    result.set_broker_count(metadata.brokers().len());

    // topic
    let topics = metadata.topics();
    result.set_topic_count(topics.len());

    if !topics.is_empty() {
        for topic in topics {
            let partitions = topic.partitions();
            // partition
            result.set_partition_count(result.partition_count() + partitions.len());
            // lag
            let count = result.lag_count()
                + partitions
                    .iter()
                    .map(|item| {
                        let (high, low) = client.inner().fetch_watermarks(
                            topic.name(),
                            item.id(),
                            Timeout::from(Duration::from_secs(5)),
                        )?;
                        Ok((high - low) as usize)
                    })
                    .sum::<EasyKafkaResult<usize>>()?;
            result.set_lag_count(count);
        }
    } else {
        result.set_partition_count(0);
        result.set_lag_count(0);
    }
    Ok(result)
}
