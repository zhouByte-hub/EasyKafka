// 模拟数据生成器

import { generateRandomString } from '@/utils'

// 生成随机整数
export function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 生成随机布尔值
export function generateRandomBoolean(): boolean {
  return Math.random() > 0.5
}

// 生成随机字符串
export function generateRandomText(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result.trim()
}

// 生成随机日期
export function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// 生成随机时间戳
export function generateRandomTimestamp(start?: Date, end?: Date): number {
  const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 默认30天前
  const endDate = end || new Date()
  
  return generateRandomDate(startDate, endDate).getTime()
}

// 生成随机 IP 地址
export function generateRandomIP(): string {
  return `${generateRandomInt(1, 255)}.${generateRandomInt(0, 255)}.${generateRandomInt(0, 255)}.${generateRandomInt(0, 255)}`
}

// 生成随机端口号
export function generateRandomPort(): number {
  return generateRandomInt(1024, 65535)
}

// 生成随机 Kafka Broker
export function generateRandomBroker(id: number) {
  return {
    id,
    host: `broker-${id}.kafka.cluster`,
    port: generateRandomPort(),
    rack: generateRandomBoolean() ? `rack-${generateRandomInt(1, 3)}` : undefined,
  }
}

// 生成随机 Kafka Topic
export function generateRandomTopic(id: number) {
  const partitionCount = generateRandomInt(1, 10)
  const replicationFactor = generateRandomInt(1, 3)
  
  const partitions = Array.from({ length: partitionCount }, (_, i) => ({
    id: i,
    leader: generateRandomInt(0, 2),
    replicas: Array.from({ length: replicationFactor }, () => generateRandomInt(0, 2)),
    isr: Array.from({ length: generateRandomInt(1, replicationFactor) }, () => generateRandomInt(0, 2)),
    earliestOffset: generateRandomInt(0, 10000),
    latestOffset: generateRandomInt(10000, 50000),
    messageCount: generateRandomInt(0, 40000),
  }))
  
  return {
    name: `topic-${id}-${generateRandomString(5).toLowerCase()}`,
    internal: generateRandomBoolean(),
    partitions,
    configs: [
      {
        name: 'cleanup.policy',
        value: generateRandomBoolean() ? 'delete' : 'compact',
        source: 'Default',
        isSensitive: false,
        isReadOnly: false,
      },
      {
        name: 'retention.ms',
        value: (generateRandomInt(1, 7) * 24 * 60 * 60 * 1000).toString(),
        source: 'Default',
        isSensitive: false,
        isReadOnly: false,
      },
      {
        name: 'retention.bytes',
        value: (generateRandomInt(1, 10) * 1024 * 1024 * 1024).toString(),
        source: 'Default',
        isSensitive: false,
        isReadOnly: false,
      },
    ],
  }
}

// 生成随机 Kafka 消费者组
export function generateRandomConsumerGroup(id: number) {
  const memberCount = generateRandomInt(1, 5)
  const topicCount = generateRandomInt(1, 5)
  
  const members = Array.from({ length: memberCount }, (_, i) => ({
    memberId: `member-${i}-${generateRandomString(8)}`,
    clientId: `client-${i}`,
    host: generateRandomIP(),
    assignment: Array.from({ length: generateRandomInt(1, topicCount) }, () => ({
      topic: `topic-${generateRandomInt(1, 10)}-${generateRandomString(5).toLowerCase()}`,
      partitions: Array.from({ length: generateRandomInt(1, 3) }, () => generateRandomInt(0, 5)),
    })),
  }))
  
  const offsets = []
  for (let i = 0; i < topicCount; i++) {
    const topic = `topic-${generateRandomInt(1, 10)}-${generateRandomString(5).toLowerCase()}`
    const partitionCount = generateRandomInt(1, 5)
    
    for (let j = 0; j < partitionCount; j++) {
      const currentOffset = generateRandomInt(0, 50000)
      const endOffset = generateRandomInt(currentOffset, 60000)
      
      offsets.push({
        topic,
        partition: j,
        currentOffset,
        endOffset,
        lag: endOffset - currentOffset,
        lastConsumedTimestamp: generateRandomTimestamp(),
      })
    }
  }
  
  const states = ['Stable', 'PreparingRebalance', 'CompletingRebalance', 'Empty', 'Dead']
  
  return {
    groupId: `group-${id}-${generateRandomString(5).toLowerCase()}`,
    state: states[generateRandomInt(0, states.length - 1)],
    coordinator: {
      id: generateRandomInt(0, 2),
      host: generateRandomIP(),
      port: generateRandomPort(),
    },
    members,
    offsets,
  }
}

// 生成随机 Kafka 消息
export function generateRandomMessage(topic: string, partition?: number) {
  const headers = generateRandomBoolean()
    ? {
        'content-type': 'application/json',
        'user-id': `user-${generateRandomInt(1, 1000)}`,
        'trace-id': generateRandomString(16),
      }
    : undefined
  
  return {
    topic,
    partition: partition ?? generateRandomInt(0, 5),
    offset: generateRandomInt(0, 100000),
    timestamp: generateRandomTimestamp(),
    key: generateRandomBoolean() ? `key-${generateRandomString(8)}` : undefined,
    value: generateRandomBoolean()
      ? JSON.stringify({
          id: generateRandomInt(1, 10000),
          name: generateRandomText(20),
          value: generateRandomInt(1, 100),
          timestamp: Date.now(),
        })
      : generateRandomText(50),
    headers,
  }
}

// 生成随机 Kafka 集群元数据
export function generateRandomClusterMetadata() {
  const brokerCount = generateRandomInt(3, 5)
  const topicCount = generateRandomInt(10, 50)
  
  const brokers = Array.from({ length: brokerCount }, (_, i) => generateRandomBroker(i))
  
  return {
    brokers,
    controllerId: generateRandomInt(0, brokerCount - 1),
    clusterId: `cluster-${generateRandomString(12).toLowerCase()}`,
    topicCount,
    partitionCount: generateRandomInt(topicCount, topicCount * 5),
  }
}

// 生成随机监控数据
export function generateRandomMetricsData() {
  const now = Date.now()
  const dataPoints = 60 // 60个数据点，代表60分钟
  
  const generateTimeSeries = (baseValue: number, variance: number) => {
    return Array.from({ length: dataPoints }, (_, i) => {
      const timestamp = now - (dataPoints - i - 1) * 60000 // 每分钟一个数据点
      const value = baseValue + (Math.random() - 0.5) * variance
      return { timestamp, value: Math.max(0, value) }
    })
  }
  
  return {
    messageRate: generateTimeSeries(1000, 500), // 消息速率
    byteRate: generateTimeSeries(1024 * 1024, 512 * 1024), // 字节速率
    requestRate: generateTimeSeries(100, 50), // 请求速率
    errorRate: generateTimeSeries(5, 5), // 错误速率
    diskUsage: generateTimeSeries(50, 10), // 磁盘使用率
    networkIn: generateTimeSeries(10 * 1024 * 1024, 5 * 1024 * 1024), // 网络输入
    networkOut: generateTimeSeries(8 * 1024 * 1024, 4 * 1024 * 1024), // 网络输出
    activeConnections: generateTimeSeries(100, 50), // 活跃连接数
    consumerLag: generateTimeSeries(1000, 500), // 消费者滞后
  }
}

// 生成随机日志数据
export function generateRandomLogs(count: number) {
  const levels = ['info', 'warn', 'error', 'debug']
  const components = ['Broker', 'Controller', 'Producer', 'Consumer', 'GroupCoordinator']
  
  return Array.from({ length: count }, () => ({
    timestamp: generateRandomTimestamp(),
    level: levels[generateRandomInt(0, levels.length - 1)],
    component: components[generateRandomInt(0, components.length - 1)],
    message: generateRandomText(generateRandomInt(20, 100)),
    thread: `kafka-${generateRandomString(8).toLowerCase()}`,
    class: `kafka.${generateRandomString(10).toLowerCase()}`,
  }))
}