import { formatDateTime, formatFileSize } from './index'

/**
 * Kafka 分区信息接口
 */
export interface PartitionInfo {
  id: number
  leader: number
  replicas: number[]
  isr: number[]
  earliestOffset: number
  latestOffset: number
  messageCount?: number
}

/**
 * Kafka 主题配置接口
 */
export interface TopicConfig {
  name: string
  value: string
  source: string
  isSensitive: boolean
  isReadOnly: boolean
}

/**
 * Kafka 主题详细信息接口
 */
export interface TopicDetail {
  name: string
  internal: boolean
  partitions: PartitionInfo[]
  configs: TopicConfig[]
}

/**
 * Kafka 消费者组成员信息接口
 */
export interface ConsumerGroupMember {
  memberId: string
  clientId: string
  host: string
  assignment: {
    topic: string
    partitions: number[]
  }[]
}

/**
 * Kafka 消费者组偏移量信息接口
 */
export interface ConsumerGroupOffset {
  topic: string
  partition: number
  currentOffset: number
  endOffset: number
  lag: number
  lastConsumedTimestamp?: number
}

/**
 * Kafka 消费者组详细信息接口
 */
export interface ConsumerGroupDetail {
  groupId: string
  state: string
  coordinator: {
    id: number
    host: string
    port: number
  }
  members: ConsumerGroupMember[]
  offsets: ConsumerGroupOffset[]
}

/**
 * Kafka Broker 信息接口
 */
export interface BrokerInfo {
  id: number
  host: string
  port: number
  rack?: string
}

/**
 * Kafka 集群元数据接口
 */
export interface ClusterMetadata {
  brokers: BrokerInfo[]
  controllerId: number
  clusterId: string
  topicCount: number
  partitionCount: number
}

/**
 * Kafka 生产者记录接口
 */
export interface ProducerRecord {
  topic: string
  key?: string
  value: string
  headers?: Record<string, string>
  partition?: number
  timestamp?: number
}

/**
 * Kafka 消费者记录接口
 */
export interface ConsumerRecord {
  topic: string
  partition: number
  offset: number
  timestamp: number
  key?: string
  value: string
  headers?: Record<string, string>
}

/**
 * 格式化 Kafka 时间戳
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串
 */
export function formatKafkaTimestamp(timestamp: number): string {
  if (!timestamp) {
    return '-'
  }
  
  return formatDateTime(timestamp)
}

/**
 * 格式化 Kafka 偏移量
 * @param offset 偏移量
 * @returns 格式化后的偏移量字符串
 */
export function formatKafkaOffset(offset: number): string {
  if (offset === -1) {
    return 'N/A'
  }
  
  return offset.toLocaleString()
}

/**
 * 格式化 Kafka Lag
 * @param lag Lag 值
 * @returns 格式化后的 Lag 字符串
 */
export function formatKafkaLag(lag: number): string {
  if (lag === -1) {
    return 'N/A'
  }
  
  if (lag === 0) {
    return '0'
  }
  
  return lag.toLocaleString()
}

/**
 * 计算消息速率
 * @param messageCount 消息数量
 * @param timeSpan 时间跨度，单位毫秒
 * @returns 消息速率，单位 消息/秒
 */
export function calculateMessageRate(messageCount: number, timeSpan: number): number {
  if (timeSpan <= 0) {
    return 0
  }
  
  return Math.round((messageCount / timeSpan) * 1000)
}

/**
 * 格式化消息速率
 * @param rate 消息速率
 * @returns 格式化后的消息速率字符串
 */
export function formatMessageRate(rate: number): string {
  if (rate < 1000) {
    return `${rate} msg/s`
  }
  
  if (rate < 1000000) {
    return `${(rate / 1000).toFixed(2)} K msg/s`
  }
  
  return `${(rate / 1000000).toFixed(2)} M msg/s`
}

/**
 * 计算字节速率
 * @param byteCount 字节数
 * @param timeSpan 时间跨度，单位毫秒
 * @returns 字节速率，单位 字节/秒
 */
export function calculateByteRate(byteCount: number, timeSpan: number): number {
  if (timeSpan <= 0) {
    return 0
  }
  
  return Math.round((byteCount / timeSpan) * 1000)
}

/**
 * 格式化字节速率
 * @param rate 字节速率
 * @returns 格式化后的字节速率字符串
 */
export function formatByteRate(rate: number): string {
  if (rate < 1024) {
    return `${rate} B/s`
  }
  
  if (rate < 1024 * 1024) {
    return `${(rate / 1024).toFixed(2)} KB/s`
  }
  
  if (rate < 1024 * 1024 * 1024) {
    return `${(rate / (1024 * 1024)).toFixed(2)} MB/s`
  }
  
  return `${(rate / (1024 * 1024 * 1024)).toFixed(2)} GB/s`
}

/**
 * 计算 Kafka 分区消息总数
 * @param partition 分区信息
 * @returns 消息总数
 */
export function calculatePartitionMessageCount(partition: PartitionInfo): number {
  if (partition.earliestOffset === -1 || partition.latestOffset === -1) {
    return -1
  }
  
  return partition.latestOffset - partition.earliestOffset
}

/**
 * 计算 Kafka 主题消息总数
 * @param topic 主题详细信息
 * @returns 消息总数
 */
export function calculateTopicMessageCount(topic: TopicDetail): number {
  let totalCount = 0
  
  for (const partition of topic.partitions) {
    const count = calculatePartitionMessageCount(partition)
    if (count !== -1) {
      totalCount += count
    }
  }
  
  return totalCount
}

/**
 * 计算 Kafka 消费者组总 Lag
 * @param consumerGroup 消费者组详细信息
 * @returns 总 Lag
 */
export function calculateConsumerGroupTotalLag(consumerGroup: ConsumerGroupDetail): number {
  let totalLag = 0
  
  for (const offset of consumerGroup.offsets) {
    if (offset.lag !== -1) {
      totalLag += offset.lag
    }
  }
  
  return totalLag
}

/**
 * 获取 Kafka 主题分区状态
 * @param partition 分区信息
 * @returns 分区状态
 */
export function getPartitionStatus(partition: PartitionInfo): 'online' | 'offline' | 'under-replicated' | 'unknown' {
  if (!partition.leader || partition.leader === -1) {
    return 'offline'
  }
  
  if (partition.isr.length < partition.replicas.length) {
    return 'under-replicated'
  }
  
  return 'online'
}

/**
 * 获取 Kafka 消费者组状态
 * @param state 消费者组状态
 * @returns 格式化后的状态
 */
export function formatConsumerGroupState(state: string): string {
  const stateMap: Record<string, string> = {
    'Empty': '空',
    'Dead': '已停止',
    'Stable': '稳定',
    'PreparingRebalance': '准备重平衡',
    'CompletingRebalance': '完成重平衡'
  }
  
  return stateMap[state] || state
}

/**
 * 获取 Kafka 主题配置类型
 * @param configName 配置名称
 * @returns 配置类型
 */
export function getTopicConfigType(configName: string): 'string' | 'int' | 'long' | 'double' | 'boolean' | 'list' | 'class' | 'unknown' {
  const stringConfigs = [
    'cleanup.policy',
    'compression.type',
    'message.format.version',
    'timestamp.type',
    'log.message.timestamp.type'
  ]
  
  const intConfigs = [
    'min.insync.replicas',
    'retention.bytes',
    'max.message.bytes',
    'segment.bytes',
    'segment.ms',
    'retention.ms',
    'message.timestamp.difference.max.ms',
    'message.timestamp.before.max.ms',
    'message.timestamp.after.max.ms'
  ]
  
  const longConfigs = [
    'log.retention.bytes',
    'log.segment.bytes',
    'log.retention.ms'
  ]
  
  const doubleConfigs = [
    'log.cleaner.min.cleanable.ratio',
    'log.cleaner.max.compaction.lag.ms',
    'log.cleaner.delete.retention.ms'
  ]
  
  const booleanConfigs = [
    'cleanup.policy',
    'compression.type',
    'unclean.leader.election.enable',
    'delete.enable',
    'compact.enable',
    'message.timestamp.type'
  ]
  
  const listConfigs = [
    'cleanup.policy'
  ]
  
  const classConfigs = [
    'metric.reporters',
    'principal.builder.class',
    'key.serializer',
    'value.serializer',
    'key.deserializer',
    'value.deserializer'
  ]
  
  if (stringConfigs.includes(configName)) {
    return 'string'
  }
  
  if (intConfigs.includes(configName)) {
    return 'int'
  }
  
  if (longConfigs.includes(configName)) {
    return 'long'
  }
  
  if (doubleConfigs.includes(configName)) {
    return 'double'
  }
  
  if (booleanConfigs.includes(configName)) {
    return 'boolean'
  }
  
  if (listConfigs.includes(configName)) {
    return 'list'
  }
  
  if (classConfigs.includes(configName)) {
    return 'class'
  }
  
  return 'unknown'
}

/**
 * 格式化 Kafka 主题配置值
 * @param configName 配置名称
 * @param configValue 配置值
 * @returns 格式化后的配置值
 */
export function formatTopicConfigValue(configName: string, configValue: string): string {
  const configType = getTopicConfigType(configName)
  
  switch (configType) {
    case 'int':
    case 'long':
      const numValue = parseInt(configValue, 10)
      if (isNaN(numValue)) {
        return configValue
      }
      
      // 对于时间相关的配置，进行特殊处理
      if (configName.includes('ms') || configName.includes('time')) {
        if (numValue < 1000) {
          return `${numValue} ms`
        }
        
        if (numValue < 60000) {
          return `${(numValue / 1000).toFixed(2)} s`
        }
        
        if (numValue < 3600000) {
          return `${(numValue / 60000).toFixed(2)} min`
        }
        
        if (numValue < 86400000) {
          return `${(numValue / 3600000).toFixed(2)} h`
        }
        
        return `${(numValue / 86400000).toFixed(2)} days`
      }
      
      // 对于字节相关的配置，进行特殊处理
      if (configName.includes('bytes') || configName.includes('size')) {
        return formatFileSize(numValue)
      }
      
      return numValue.toLocaleString()
      
    case 'double':
      const doubleValue = parseFloat(configValue)
      if (isNaN(doubleValue)) {
        return configValue
      }
      
      return doubleValue.toFixed(2)
      
    case 'boolean':
      return configValue.toLowerCase() === 'true' ? '是' : '否'
      
    default:
      return configValue
  }
}