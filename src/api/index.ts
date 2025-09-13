import { ElMessage, ElNotification } from 'element-plus'

// 模拟数据响应
const mockResponse = (data: any, code = 200, message = 'success') => {
  return {
    code,
    message,
    data
  }
}

// 集群相关API
export const clusterApi = {
  // 获取集群列表
  getClusters: () => mockResponse([]),
  
  // 添加集群
  addCluster: (data: any) => mockResponse(data),
  
  // 更新集群
  updateCluster: (id: string, data: any) => mockResponse(data),
  
  // 删除集群
  deleteCluster: (id: string) => mockResponse({}),
  
  // 测试集群连接
  testConnection: (data: any) => mockResponse({ connected: true }),
  
  // 获取集群元数据
  getClusterMetadata: (id: string) => mockResponse({})
}

// 主题相关API
export const topicApi = {
  // 获取主题列表
  getTopics: (clusterId: string) => mockResponse([]),
  
  // 创建主题
  createTopic: (clusterId: string, data: any) => mockResponse(data),
  
  // 删除主题
  deleteTopic: (clusterId: string, name: string) => mockResponse({}),
  
  // 获取主题详情
  getTopicDetail: (clusterId: string, name: string) => mockResponse({}),
  
  // 更新主题配置
  updateTopicConfig: (clusterId: string, name: string, data: any) => mockResponse(data)
}

// 生产者相关API
export const producerApi = {
  // 发送消息
  sendMessage: (clusterId: string, topic: string, data: any) => mockResponse({ success: true }),
  
  // 批量发送消息
  sendBatchMessages: (clusterId: string, topic: string, messages: any[]) => mockResponse({ success: true, count: messages.length })
}

// 消费者相关API
export const consumerApi = {
  // 消费消息
  consumeMessages: (clusterId: string, options: any) => mockResponse([]),
  
  // 获取消费者偏移量
  getOffsets: (clusterId: string, topic: string, groupId: string) => mockResponse({}),
  
  // 重置消费者偏移量
  resetOffsets: (clusterId: string, topic: string, groupId: string, data: any) => mockResponse({}),
  
  // 获取消息详情
  getMessageDetail: (clusterId: string, topic: string, partition: number, offset: number) => mockResponse({})
}

// 消费者组相关API
export const consumerGroupApi = {
  // 获取消费者组列表
  getConsumerGroups: (clusterId: string) => mockResponse([]),
  
  // 获取消费者组详情
  getConsumerGroupDetail: (clusterId: string, groupId: string) => mockResponse({}),
  
  // 删除消费者组
  deleteConsumerGroup: (clusterId: string, groupId: string) => mockResponse({}),
  
  // 重置消费者组偏移量
  resetGroupOffsets: (clusterId: string, groupId: string, data: any) => mockResponse({})
}

// 监控相关API
export const metricsApi = {
  // 获取集群指标
  getClusterMetrics: (clusterId: string) => mockResponse({}),
  
  // 获取主题指标
  getTopicMetrics: (clusterId: string, topic: string) => mockResponse({}),
  
  // 获取消费者组指标
  getConsumerGroupMetrics: (clusterId: string, groupId: string) => mockResponse({})
}

// 日志相关API
export const logApi = {
  // 获取操作日志
  getLogs: (clusterId: string, params: any) => mockResponse([]),
  
  // 添加操作日志
  addLog: (clusterId: string, data: any) => mockResponse({})
}

export default {
  clusterApi,
  topicApi,
  producerApi,
  consumerApi,
  consumerGroupApi,
  metricsApi,
  logApi
}