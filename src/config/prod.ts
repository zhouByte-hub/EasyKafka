// 生产环境配置
export default {
  // 应用标题
  title: 'EasyKafka',
  
  // API 配置
  api: {
    baseURL: '/api',
    timeout: 10000,
  },
  
  // 默认设置
  settings: {
    theme: 'light', // light, dark
    language: 'zh-CN', // zh-CN, en-US
    autoRefresh: true,
    refreshInterval: 5000, // 5秒
  },
  
  // Kafka 默认配置
  kafka: {
    // 默认生产者配置
    producer: {
      acks: 'all',
      retries: 3,
      batchSize: 16384,
      lingerMs: 1,
      bufferMemory: 33554432,
      compressionType: 'none',
    },
    
    // 默认消费者配置
    consumer: {
      groupId: 'easy-kafka-consumer',
      autoOffsetReset: 'latest',
      enableAutoCommit: true,
      autoCommitIntervalMs: 1000,
      sessionTimeoutMs: 10000,
      heartbeatIntervalMs: 3000,
    },
  },
  
  // UI 配置
  ui: {
    sidebar: {
      width: 240,
      collapsedWidth: 64,
    },
    header: {
      height: 60,
    },
    content: {
      padding: 20,
    },
  },
  
  // 功能开关
  features: {
    enableMockData: false, // 是否启用模拟数据
    enableDebug: false, // 是否启用调试模式
    enableAnalytics: true, // 是否启用分析
  },
  
  // 其他配置
  other: {
    maxHistoryRecords: 100, // 最大历史记录数
    maxLogEntries: 1000, // 最大日志条目数
    exportFormats: ['json', 'csv'], // 支持的导出格式
  },
}