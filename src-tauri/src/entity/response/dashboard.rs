use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct DashboardStatistics {
    pub topic_count: usize,
    pub partition_count: usize,
    pub broker_count: usize,
    pub lag_count: usize,
}
