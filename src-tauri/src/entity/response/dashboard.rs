use getset::{CloneGetters, CopyGetters, Getters, MutGetters, Setters, WithSetters};
use serde::{Deserialize, Serialize};

#[derive(
    Getters,
    Setters,
    WithSetters,
    MutGetters,
    CopyGetters,
    CloneGetters,
    Default,
    Debug,
    Serialize,
    Deserialize,
)]

pub struct DashboardStatistics {
    #[getset(get = "pub", set = "pub", get_mut = "pub", set_with = "pub")]
    topic_count: usize,

    #[getset(get = "pub", set = "pub", get_mut = "pub", set_with = "pub")]
    partition_count: usize,

    #[getset(get = "pub", set = "pub", get_mut = "pub", set_with = "pub")]
    broker_count: usize,

    #[getset(get = "pub", set = "pub", get_mut = "pub", set_with = "pub")]
    lag_count: usize,
}
