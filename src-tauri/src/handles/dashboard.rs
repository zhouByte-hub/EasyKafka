use crate::entity::response::dashboard::DashboardStatistics;
use rdkafka::util::Timeout;
use std::time::Duration;

use crate::{infra::kafka_infra::create_kafka_client, EasyKafkaResult};

#[tauri::command]
pub fn dashboard_statistics(token: &str) -> EasyKafkaResult<DashboardStatistics> {
    let client = create_kafka_client(token)?;
    let mut result = DashboardStatistics::default();
    
    let metadata = client
        .inner()
        .fetch_metadata(None, Timeout::from(Duration::from_secs(5)))?;
    // broker
    result.broker_count = metadata.brokers().len();

    // topic
    let topics = metadata.topics();
    result.topic_count = topics.len();

    if !topics.is_empty() {
        for topic in topics {
            let partitions = topic.partitions();
            // partition
            result.partition_count += partitions.len();
            // lag
            result.lag_count += partitions
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
        }
    } else {
        result.partition_count = 0;
        result.lag_count = 0;
    }
    Ok(result)
}
