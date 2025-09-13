import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ClusterMetrics {
  brokerCount: number
  onlineBrokerCount: number
  topicCount: number
  partitionCount: number
  messagesInPerSec: number
  messagesOutPerSec: number
  averageMessageSize: number
  totalLag: number
  diskUsage: number
  diskUsageTrend: number[]
  networkIn: number
  networkOut: number
  timestamp: string
}

export interface TopicMetrics {
  topic: string
  partitions: PartitionMetrics[]
  messageSizeDistribution: {
    range: string
    count: number
  }[]
  leaderDistribution: {
    brokerId: number
    partitionCount: number
  }[]
}

export interface PartitionMetrics {
  partition: number
  leader: number
  messagesInPerSec: number
  messagesOutPerSec: number
  offset: number
  lag: number
  size: number
}

export interface ConsumerGroupMetrics {
  groupId: string
  members: ConsumerMemberMetrics[]
  partitionLagTrend: {
    partition: number
    lag: number[]
    timestamps: string[]
  }[]
  rebalanceEvents: {
    timestamp: string
    type: string
    details: string
  }[]
}

export interface ConsumerMemberMetrics {
  memberId: string
  clientId: string
  host: string
  messagesConsumedPerSec: number
  assignedPartitions: number[]
}

export const useMetricsStore = defineStore('metrics', () => {
  const clusterMetrics = ref<ClusterMetrics | null>(null)
  const topicMetrics = ref<TopicMetrics | null>(null)
  const consumerGroupMetrics = ref<ConsumerGroupMetrics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const timeRange = ref('1h') // 5m, 15m, 1h, 6h, 24h

  function fetchClusterMetrics(clusterId: string) {
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

  function fetchTopicMetrics(clusterId: string, topic: string) {
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

  function fetchConsumerGroupMetrics(clusterId: string, groupId: string) {
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

  function setTimeRange(range: string) {
    timeRange.value = range
  }

  function startAutoRefresh(clusterId: string, interval: number = 30000) {
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

  function stopAutoRefresh(timerId: number) {
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