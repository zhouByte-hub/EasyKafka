// 模拟 API 服务

import {
  generateRandomBroker,
  generateRandomTopic,
  generateRandomConsumerGroup,
  generateRandomMessage,
  generateRandomClusterMetadata,
  generateRandomMetricsData,
  generateRandomLogs,
} from './index'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟 API 响应
const mockResponse = <T>(data: T, delayTime = 300) => {
  return new Promise<T>(resolve => {
    setTimeout(() => {
      resolve(data)
    }, delayTime)
  })
}

// 模拟 API 错误
const mockError = (message: string, code = 500, delayTime = 300) => {
  return new Promise<any>((_, reject) => {
    setTimeout(() => {
      reject({
        code,
        message,
      })
    }, delayTime)
  })
}

// 集群相关 API
export const clusterApi = {
  // 获取集群列表
  getClusters: () => {
    const clusters = [
      {
        id: 'cluster-1',
        name: '开发集群',
        bootstrapServers: 'localhost:9092',
        status: 'connected',
        version: '3.5.0',
        brokerCount: 3,
        topicCount: 25,
        partitionCount: 75,
      },
      {
        id: 'cluster-2',
        name: '测试集群',
        bootstrapServers: 'test.kafka.cluster:9092',
        status: 'disconnected',
        version: '3.4.0',
        brokerCount: 5,
        topicCount: 50,
        partitionCount: 150,
      },
      {
        id: 'cluster-3',
        name: '生产集群',
        bootstrapServers: 'prod.kafka.cluster:9092',
        status: 'connected',
        version: '3.5.0',
        brokerCount: 10,
        topicCount: 100,
        partitionCount: 500,
      },
    ]
    
    return mockResponse(clusters)
  },
  
  // 获取集群元数据
  getClusterMetadata: (clusterId: string) => {
    if (!clusterId) {
      return mockError('集群 ID 不能为空', 400)
    }
    
    const metadata = generateRandomClusterMetadata()
    return mockResponse(metadata)
  },
  
  // 测试集群连接
  testClusterConnection: (clusterConfig: any) => {
    if (!clusterConfig.bootstrapServers) {
      return mockError('Bootstrap Servers 不能为空', 400)
    }
    
    // 模拟 80% 成功率
    if (Math.random() > 0.2) {
      return mockResponse({
        success: true,
        message: '连接成功',
        version: '3.5.0',
        brokerCount: 3,
      })
    } else {
      return mockError('连接失败：无法连接到 Kafka 集群', 500)
    }
  },
  
  // 添加集群
  addCluster: (clusterConfig: any) => {
    if (!clusterConfig.name || !clusterConfig.bootstrapServers) {
      return mockError('集群名称和 Bootstrap Servers 不能为空', 400)
    }
    
    const newCluster = {
      id: `cluster-${Date.now()}`,
      name: clusterConfig.name,
      bootstrapServers: clusterConfig.bootstrapServers,
      status: 'connected',
      version: '3.5.0',
      brokerCount: 3,
      topicCount: 0,
      partitionCount: 0,
    }
    
    return mockResponse(newCluster)
  },
  
  // 更新集群
  updateCluster: (clusterId: string, clusterConfig: any) => {
    if (!clusterId) {
      return mockError('集群 ID 不能为空', 400)
    }
    
    if (!clusterConfig.name || !clusterConfig.bootstrapServers) {
      return mockError('集群名称和 Bootstrap Servers 不能为空', 400)
    }
    
    const updatedCluster = {
      id: clusterId,
      name: clusterConfig.name,
      bootstrapServers: clusterConfig.bootstrapServers,
      status: 'connected',
      version: '3.5.0',
      brokerCount: 3,
      topicCount: 25,
      partitionCount: 75,
    }
    
    return mockResponse(updatedCluster)
  },
  
  // 删除集群
  deleteCluster: (clusterId: string) => {
    if (!clusterId) {
      return mockError('集群 ID 不能为空', 400)
    }
    
    return mockResponse({ success: true })
  },
}

// 主题相关 API
export const topicApi = {
  // 获取主题列表
  getTopics: (clusterId: string) => {
    if (!clusterId) {
      return mockError('集群 ID 不能为空', 400)
    }
    
    const topics = Array.from({ length: 25 }, (_, i) => generateRandomTopic(i + 1))
    return mockResponse(topics)
  },
  
  // 获取主题详情
  getTopicDetail: (clusterId: string, topicName: string) => {
    if (!clusterId || !topicName) {
      return mockError('集群 ID 和主题名称不能为空', 400)
    }
    
    const topic = generateRandomTopic(1)
    topic.name = topicName
    
    return mockResponse(topic)
  },
  
  // 创建主题
  createTopic: (clusterId: string, topicConfig: any) => {
    if (!clusterId || !topicConfig.name) {
      return mockError('集群 ID 和主题名称不能为空', 400)
    }
    
    const newTopic = generateRandomTopic(1)
    newTopic.name = topicConfig.name
    
    if (topicConfig.partitions) {
      newTopic.partitions = Array.from({ length: topicConfig.partitions }, (_, i) => ({
        id: i,
        leader: 0,
        replicas: [0, 1, 2],
        isr: [0, 1, 2],
        earliestOffset: 0,
        latestOffset: 0,
        messageCount: 0,
      }))
    }
    
    return mockResponse(newTopic)
  },
  
  // 更新主题配置
  updateTopicConfig: (clusterId: string, topicName: string, configs: any) => {
    if (!clusterId || !topicName) {
      return mockError('集群 ID 和主题名称不能为空', 400)
    }
    
    if (!configs || Object.keys(configs).length === 0) {
      return mockError('配置不能为空', 400)
    }
    
    return mockResponse({ success: true })
  },
  
  // 删除主题
  deleteTopic: (clusterId: string, topicName: string) => {
    if (!clusterId || !topicName) {
      return mockError('集群 ID 和主题名称不能为空', 400)
    }
    
    return mockResponse({ success: true })
  },
}

// 消费者组相关 API
export const consumerGroupApi = {
  // 获取消费者组列表
  getConsumerGroups: (clusterId: string) => {
    if (!clusterId) {
      return mockError('集群 ID 不能为空', 400)
    }
    
    const groups = Array.from({ length: 15 }, (_, i) => generateRandomConsumerGroup(i + 1))
    return mockResponse(groups)
  },
  
  // 获取消费者组详情
  getConsumerGroupDetail: (clusterId: string, groupId: string) => {
    if (!clusterId || !groupId) {
      return mockError('集群 ID 和消费者组 ID 不能为空', 400)
    }
    
    const group = generateRandomConsumerGroup(1)
    group.groupId = groupId
    
    return mockResponse(group)
  },
  
  // 重置消费者组偏移量
  resetConsumerGroupOffset: (clusterId: string, groupId: string, resetConfig: any) => {
    if (!clusterId || !groupId) {
      return mockError('集群 ID 和消费者组 ID 不能为空', 400)
    }
    
    if (!resetConfig || !resetConfig.topic || !resetConfig.resetTo) {
      return mockError('重置配置不能为空', 400)
    }
    
    return mockResponse({ success: true })
  },
  
  // 删除消费者组
  deleteConsumerGroup: (clusterId: string, groupId: string) => {
    if (!clusterId || !groupId) {
      return mockError('集群 ID 和消费者组 ID 不能为空', 400)
    }
    
    return mockResponse({ success: true })
  },
}

// 生产者相关 API
export const producerApi = {
  // 发送消息
  sendMessage: (clusterId: string, message: any) => {
    if (!clusterId || !message.topic || !message.value) {
      return mockError('集群 ID、主题和消息值不能为空', 400)
    }
    
    // 模拟 90% 成功率
    if (Math.random() > 0.1) {
      return mockResponse({
        success: true,
        topic: message.topic,
        partition: message.partition || 0,
        offset: Math.floor(Math.random() * 100000),
        timestamp: Date.now(),
      })
    } else {
      return mockError('消息发送失败：网络错误', 500)
    }
  },
  
  // 批量发送消息
  sendMessages: (clusterId: string, messages: any[]) => {
    if (!clusterId || !messages || messages.length === 0) {
      return mockError('集群 ID 和消息列表不能为空', 400)
    }
    
    const results = messages.map(message => ({
      success: Math.random() > 0.1,
      topic: message.topic,
      partition: message.partition || 0,
      offset: Math.floor(Math.random() * 100000),
      timestamp: Date.now(),
      error: Math.random() > 0.1 ? undefined : '消息发送失败：网络错误',
    }))
    
    return mockResponse(results)
  },
}

// 消费者相关 API
export const consumerApi = {
  // 消费消息
  consumeMessages: (clusterId: string, consumeConfig: any) => {
    if (!clusterId || !consumeConfig.topic) {
      return mockError('集群 ID 和主题不能为空', 400)
    }
    
    const messageCount = consumeConfig.count || 10
    const messages = Array.from({ length: messageCount }, () =>
      generateRandomMessage(consumeConfig.topic, consumeConfig.partition)
    )
    
    return mockResponse(messages)
  },
  
  // 获取消息详情
  getMessageDetail: (clusterId: string, topic: string, partition: number, offset: number) => {
    if (!clusterId || !topic || partition === undefined || offset === undefined) {
      return mockError('集群 ID、主题、分区和偏移量不能为空', 400)
    }
    
    const message = generateRandomMessage(topic, partition)
    message.offset = offset
    
    return mockResponse(message)
  },
}

// 监控相关 API
export const monitoringApi = {
  // 获取集群指标
  getClusterMetrics: (clusterId: string) => {
    if (!clusterId) {
      return mockError('集群 ID 不能为空', 400)
    }
    
    const metrics = generateRandomMetricsData()
    return mockResponse(metrics)
  },
  
  // 获取主题指标
  getTopicMetrics: (clusterId: string, topicName: string) => {
    if (!clusterId || !topicName) {
      return mockError('集群 ID 和主题名称不能为空', 400)
    }
    
    const metrics = generateRandomMetricsData()
    return mockResponse(metrics)
  },
  
  // 获取消费者组指标
  getConsumerGroupMetrics: (clusterId: string, groupId: string) => {
    if (!clusterId || !groupId) {
      return mockError('集群 ID 和消费者组 ID 不能为空', 400)
    }
    
    const metrics = generateRandomMetricsData()
    return mockResponse(metrics)
  },
  
  // 获取日志
  getLogs: (clusterId: string, logConfig: any) => {
    if (!clusterId) {
      return mockError('集群 ID 不能为空', 400)
    }
    
    const count = logConfig.count || 100
    const logs = generateRandomLogs(count)
    
    return mockResponse(logs)
  },
}

// 导出所有 API
export default {
  cluster: clusterApi,
  topic: topicApi,
  consumerGroup: consumerGroupApi,
  producer: producerApi,
  consumer: consumerApi,
  monitoring: monitoringApi,
}