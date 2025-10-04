use crate::{entity::response::dashboard::DashboardStatistics, EasyKafkaError};
use rdkafka::{admin::AdminClient, util::Timeout};
use std::time::Duration;

use crate::{infra::kafka_infra::create_kafka_client, EasyKafkaResult};

#[tauri::command]
pub fn dashboard_statistics(token: &str) -> EasyKafkaResult<DashboardStatistics> {
    let client = create_kafka_client(token)?;

    let mut result = DashboardStatistics::default();
    let metadata = client
        .inner()
        .fetch_metadata(None, Timeout::from(Duration::from_secs(5)))?;
    // broker count
    result.broker_count = metadata.brokers().len();

    // topic count
    let topics = metadata.topics();
    result.topic_count = topics.len();

    // distribution count
    result.partition_count = if !topics.is_empty() {
        let std_err = EasyKafkaError::StdError(Box::new(std::io::Error::new(
            std::io::ErrorKind::Other,
            "No topic found to get partition count",
        )));
        topics.iter().next().ok_or(std_err)?.partitions().len()
    } else {
        0
    };
    // lag count

    Ok(result)
}

// fn get_consumer_group_lag(client: &AdminClient, group_id: &str) -> EasyKafkaResult<usize> {
   
//     Ok(consumer_group.lag().len())
// }
