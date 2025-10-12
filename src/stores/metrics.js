import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义常量对象来代替TypeScript接口
export const METRICS_TYPES = {
  // 集群指标类型常量
  CLUSTER_METRICS: {
    BROKER_COUNT: 'brokerCount',
    ONLINE_BROKER_COUNT: 'onlineBrokerCount',
    TOPIC_COUNT: 'topicCount',
    PARTITION_COUNT: 'partitionCount',
    MESSAGES_IN_PER_SEC: 'messagesInPerSec',
    MESSAGES_OUT_PER_SEC: 'messagesOutPerSec',
    AVERAGE_MESSAGE_SIZE: 'averageMessageSize',
    TOTAL_LAG: 'totalLag',
    DISK_USAGE: 'diskUsage'
  },
  // 时间范围常量
  TIME_RANGES: {
    '5M': '5m',
    '15M': '15m',
    '1H': '1h',
    '6H': '6h',
    '24H': '24h'
  }
}

export const useMetricsStore = defineStore('metrics', () => {
  const clusterMetrics = ref(null)
  const topicMetrics = ref(null)
  const consumerGroupMetrics = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const timeRange = ref('1h') // 5m, 15m, 1h, 6h, 24h

  function fetchClusterMetrics(clusterId) {
    // 这里应该调用API获取集群指标
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      clusterMetrics.value = {
        brokerCount: 3,
        onlineBrokerCount: 3,
        topicCount: 5,
        partitionCount: 15,
        messagesInPerSec: 120,
        messagesOutPerSec: 110,
        averageMessageSize: 1024,
        totalLag: 0,
        diskUsage: 75,
        diskUsageTrend: [70, 71, 72, 73, 74, 75],
        networkIn: 1024000,
        networkOut: 921600,
        timestamp: new Date().toISOString()
      }
      loading.value = false
    }, 500)
  }

  function fetchTopicMetrics(clusterId, topic) {
    // 这里应该调用API获取主题指标
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      topicMetrics.value = {
        topic,
        partitions: [
          {
            partition: 0,
            leader: 0,
            messagesInPerSec: 40,
            messagesOutPerSec: 35,
            offset: 1000,
            lag: 0,
            size: 102400
          },
          {
            partition: 1,
            leader: 1,
            messagesInPerSec: 45,
            messagesOutPerSec: 40,
            offset: 2000,
            lag: 0,
            size: 204800
          },
          {
            partition: 2,
            leader: 2,
            messagesInPerSec: 35,
            messagesOutPerSec: 35,
            offset: 3000,
            lag: 0,
            size: 307200
          }
        ],
        messageSizeDistribution: [
          { range: '0-1KB', count: 100 },
          { range: '1-10KB', count: 50 },
          { range: '10-100KB', count: 10 },
          { range: '>100KB', count: 5 }
        ],
        leaderDistribution: [
          { brokerId: 0, partitionCount: 1 },
          { brokerId: 1, partitionCount: 1 },
          { brokerId: 2, partitionCount: 1 }
        ]
      }
      loading.value = false
    }, 500)
  }

  function fetchConsumerGroupMetrics(clusterId, groupId) {
    // 这里应该调用API获取消费者组指标
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      consumerGroupMetrics.value = {
        groupId,
        members: [
          {
            memberId: 'member-1',
            clientId: 'client-1',
            host: '192.168.1.100',
            messagesConsumedPerSec: 35,
            assignedPartitions: [0, 1]
          },
          {
            memberId: 'member-2',
            clientId: 'client-2',
            host: '192.168.1.101',
            messagesConsumedPerSec: 35,
            assignedPartitions: [2]
          }
        ],
        partitionLagTrend: [
          {
            partition: 0,
            lag: [0, 0, 0, 0, 0],
            timestamps: [
              new Date(Date.now() - 3600000).toISOString(),
              new Date(Date.now() - 2700000).toISOString(),
              new Date(Date.now() - 1800000).toISOString(),
              new Date(Date.now() - 900000).toISOString(),
              new Date().toISOString()
            ]
          },
          {
            partition: 1,
            lag: [0, 0, 0, 0, 0],
            timestamps: [
              new Date(Date.now() - 3600000).toISOString(),
              new Date(Date.now() - 2700000).toISOString(),
              new Date(Date.now() - 1800000).toISOString(),
              new Date(Date.now() - 900000).toISOString(),
              new Date().toISOString()
            ]
          },
          {
            partition: 2,
            lag: [0, 0, 0, 0, 0],
            timestamps: [
              new Date(Date.now() - 3600000).toISOString(),
              new Date(Date.now() - 2700000).toISOString(),
              new Date(Date.now() - 1800000).toISOString(),
              new Date(Date.now() - 900000).toISOString(),
              new Date().toISOString()
            ]
          }
        ],
        rebalanceEvents: [
          {
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            type: 'JOIN',
            details: 'Member member-2 joined the group'
          }
        ]
      }
      loading.value = false
    }, 500)
  }

  function setTimeRange(range) {
    timeRange.value = range
  }

  function startAutoRefresh(clusterId, interval = 30000) {
    // 启动自动刷新
    const refresh = () => {
      if (clusterMetrics.value) {
        fetchClusterMetrics(clusterId)
      }
      if (topicMetrics.value) {
        fetchTopicMetrics(clusterId, topicMetrics.value.topic)
      }
      if (consumerGroupMetrics.value) {
        fetchConsumerGroupMetrics(clusterId, consumerGroupMetrics.value.groupId)
      }
    }
    
    // 立即刷新一次
    refresh()
    
    // 设置定时刷新
    return setInterval(refresh, interval)
  }

  function stopAutoRefresh(timerId) {
    clearInterval(timerId)
  }

  return {
    clusterMetrics,
    topicMetrics,
    consumerGroupMetrics,
    loading,
    error,
    timeRange,
    fetchClusterMetrics,
    fetchTopicMetrics,
    fetchConsumerGroupMetrics,
    setTimeRange,
    startAutoRefresh,
    stopAutoRefresh
  }
})