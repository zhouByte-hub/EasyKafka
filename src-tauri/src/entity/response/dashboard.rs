use serde::{Deserialize, Serialize};

#[derive(
    Default,
    Debug,
    Serialize,
    Deserialize,
)]

pub struct DashboardStatistics {
    topic_count: StatisticsItem,
    partition_count: StatisticsItem,
    broker_count: StatisticsItem,
    lag_count: StatisticsItem,
}

impl DashboardStatistics {

    pub fn set_broker_count(&mut self, broker_count: usize) {
        self.broker_count = StatisticsItem::create_broker_count_item(broker_count);
    }
    
    pub fn set_topic_count(&mut self, topic_count: usize) {
        self.topic_count = StatisticsItem::create_topic_count_item(topic_count);
    }
    
    pub fn set_partition_count(&mut self, partition_count: usize) {
        self.partition_count = StatisticsItem::create_partition_count_item(partition_count);
    }
    
    pub fn set_lag_count(&mut self, lag_count: usize) {
        self.lag_count = StatisticsItem::create_lag_count_item(lag_count);
    }

    pub fn get_broker_count(&self) -> usize {
        match self.broker_count.value.parse() {
            Ok(count) => count,
            Err(_) => 0,
        }
    }

    pub fn get_topic_count(&self) -> usize {
        match self.topic_count.value.parse() {
            Ok(count) => count,
            Err(_) => 0,
        }
    }

    pub fn get_partition_count(&self) -> usize {
        match self.partition_count.value.parse() {
            Ok(count) => count,
            Err(_) => 0,
        }
    }
    
    pub fn get_lag_count(&self) -> usize {
        match self.lag_count.value.parse() {
            Ok(count) => count,
            Err(_) => 0,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Default)]
struct StatisticsItem {
    title: String,
    value: String,
    icon: String,
    color: String,
}

impl StatisticsItem {

    pub fn create_broker_count_item(broker_count: usize) -> Self {
        Self {
            title: "Broker数量".to_string(),
            value: broker_count.to_string(),
            icon: "Connection".to_string(),
            color: "#409EFF".to_string(),
        }
    }

    pub fn create_topic_count_item(topic_count: usize) -> Self {
        Self {
            title: "Topic总数".to_string(),
            value: topic_count.to_string(),
            icon: "Document".to_string(),
            color: "#67C23A".to_string(),
        }
    }

    pub fn create_partition_count_item(partition_count: usize) -> Self {
        Self {
            title: "分区总数".to_string(),
            value: partition_count.to_string(),
            icon: "Partition".to_string(),
            color: "#E6A23C".to_string(),
        }
    }
    
    pub fn create_lag_count_item(lag_count: usize) -> Self {
        Self {
            title: "分区总偏移量".to_string(),
            value: lag_count.to_string(),
            icon: "Partition".to_string(),
            color: "#E6A23C".to_string(),
        }
    }
    
}