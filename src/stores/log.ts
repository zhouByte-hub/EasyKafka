import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  source: string
  details?: Record<string, any>
}

export const useLogStore = defineStore('log', () => {
  const logs = ref<LogEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<{
    level?: 'info' | 'warn' | 'error' | 'debug'
    source?: string
    search?: string
    startTime?: string
    endTime?: string
  }>({})

  function fetchLogs(clusterId?: string, limit: number = 100) {
    // 这里应该调用API获取日志
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          level: 'info',
          message: 'Cluster connection established',
          source: 'cluster',
          details: { clusterId: 'cluster-1', brokerCount: 3 }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          level: 'info',
          message: 'Topic created successfully',
          source: 'topic',
          details: { topicName: 'test-topic', partitionCount: 3, replicationFactor: 2 }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          level: 'warn',
          message: 'High disk usage detected',
          source: 'system',
          details: { brokerId: 1, diskUsage: 85 }
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'error',
          message: 'Failed to connect to broker',
          source: 'cluster',
          details: { brokerId: 2, error: 'Connection timeout' }
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'info',
          message: 'Consumer group rebalanced',
          source: 'consumer',
          details: { groupId: 'test-group', memberCount: 2 }
        }
      ]
      
      logs.value = mockLogs
      loading.value = false
    }, 500)
  }

  function addLog(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    source: string,
    details?: Record<string, any>
  ) {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
      details
    }
    
    logs.value.unshift(newLog)
    
    // 限制日志数量
    if (logs.value.length > 1000) {
      logs.value = logs.value.slice(0, 1000)
    }
    
    // 如果需要，可以将日志发送到后端
    // sendLogToBackend(newLog)
  }

  function clearLogs() {
    logs.value = []
  }

  function setFilter(newFilter: Partial<typeof filter.value>) {
    filter.value = { ...filter.value, ...newFilter }
  }

  function clearFilter() {
    filter.value = {}
  }

  const filteredLogs = computed(() => {
    let result = [...logs.value]
    
    if (filter.value.level) {
      result = result.filter(log => log.level === filter.value.level)
    }
    
    if (filter.value.source) {
      result = result.filter(log => log.source === filter.value.source)
    }
    
    if (filter.value.search) {
      const searchLower = filter.value.search.toLowerCase()
      result = result.filter(log => 
        log.message.toLowerCase().includes(searchLower) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower))
      )
    }
    
    if (filter.value.startTime) {
      const startTime = new Date(filter.value.startTime).getTime()
      result = result.filter(log => new Date(log.timestamp).getTime() >= startTime)
    }
    
    if (filter.value.endTime) {
      const endTime = new Date(filter.value.endTime).getTime()
      result = result.filter(log => new Date(log.timestamp).getTime() <= endTime)
    }
    
    return result
  })

  function exportLogs(format: 'json' | 'csv' = 'json') {
    if (format === 'json') {
      return JSON.stringify(filteredLogs.value, null, 2)
    } else if (format === 'csv') {
      // 简单的CSV导出
      const headers = ['ID', 'Timestamp', 'Level', 'Message', 'Source', 'Details']
      const rows = filteredLogs.value.map(log => [
        log.id,
        log.timestamp,
        log.level,
        `"${log.message.replace(/"/g, '""')}"`,
        log.source,
        `"${JSON.stringify(log.details || {}).replace(/"/g, '""')}"`
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    return ''
  }

  return {
    logs,
    loading,
    error,
    filter,
    filteredLogs,
    fetchLogs,
    addLog,
    clearLogs,
    setFilter,
    clearFilter,
    exportLogs
  }
})