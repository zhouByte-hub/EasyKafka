// 配置索引文件
import dev from './dev'
import prod from './prod'

// 获取当前环境
const env = import.meta.env.MODE || 'development'

// 根据环境选择配置
const config = env === 'production' ? prod : dev

// 导出配置
export default config

// 导出环境类型
export type Environment = 'development' | 'production'

// 导出配置类型
export interface AppConfig {
  title: string
  api: {
    baseURL: string
    timeout: number
  }
  settings: {
    theme: 'light' | 'dark'
    language: 'zh-CN' | 'en-US'
    autoRefresh: boolean
    refreshInterval: number
  }
  kafka: {
    producer: {
      acks: string
      retries: number
      batchSize: number
      lingerMs: number
      bufferMemory: number
      compressionType: string
    }
    consumer: {
      groupId: string
      autoOffsetReset: string
      enableAutoCommit: boolean
      autoCommitIntervalMs: number
      sessionTimeoutMs: number
      heartbeatIntervalMs: number
    }
  }
  ui: {
    sidebar: {
      width: number
      collapsedWidth: number
    }
    header: {
      height: number
    }
    content: {
      padding: number
    }
  }
  features: {
    enableMockData: boolean
    enableDebug: boolean
    enableAnalytics: boolean
  }
  other: {
    maxHistoryRecords: number
    maxLogEntries: number
    exportFormats: string[]
  }
}