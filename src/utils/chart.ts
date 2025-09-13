import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 图表数据点接口
 */
export interface ChartDataPoint {
  timestamp: string
  value: number
}

/**
 * 时间范围选项
 */
export type TimeRange = '5m' | '15m' | '1h' | '6h' | '24h' | 'custom'

/**
 * 图表配置接口
 */
export interface ChartOptions {
  responsive?: boolean
  maintainAspectRatio?: boolean
  animation?: boolean
  plugins?: {
    legend?: {
      display?: boolean
      position?: 'top' | 'bottom' | 'left' | 'right'
    }
    tooltip?: {
      mode?: 'index' | 'dataset' | 'point' | 'nearest'
      intersect?: boolean
    }
  }
  scales?: {
    x?: {
      type?: 'category' | 'linear' | 'time' | 'logarithmic'
      display?: boolean
      title?: {
        display?: boolean
        text?: string
      }
    }
    y?: {
      type?: 'category' | 'linear' | 'time' | 'logarithmic'
      display?: boolean
      title?: {
        display?: boolean
        text?: string
      }
      beginAtZero?: boolean
    }
  }
}

/**
 * 生成时间范围内的数据点
 * @param timeRange 时间范围
 * @param dataPoints 数据点数量
 * @returns 时间范围内的数据点
 */
export function generateTimeRangeDataPoints(timeRange: TimeRange, dataPoints: number = 20): ChartDataPoint[] {
  const now = new Date()
  const result: ChartDataPoint[] = []
  
  let intervalMs: number
  
  switch (timeRange) {
    case '5m':
      intervalMs = (5 * 60 * 1000) / dataPoints
      break
    case '15m':
      intervalMs = (15 * 60 * 1000) / dataPoints
      break
    case '1h':
      intervalMs = (60 * 60 * 1000) / dataPoints
      break
    case '6h':
      intervalMs = (6 * 60 * 60 * 1000) / dataPoints
      break
    case '24h':
      intervalMs = (24 * 60 * 60 * 1000) / dataPoints
      break
    default:
      intervalMs = (60 * 60 * 1000) / dataPoints
  }
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs)
    result.push({
      timestamp: timestamp.toISOString(),
      value: 0 // 初始值为0，实际使用时需要替换为真实数据
    })
  }
  
  return result
}

/**
 * 格式化时间戳为图表可读格式
 * @param timestamp 时间戳
 * @param timeRange 时间范围
 * @returns 格式化后的时间字符串
 */
export function formatTimestampForChart(timestamp: string, timeRange: TimeRange): string {
  const date = new Date(timestamp)
  
  switch (timeRange) {
    case '5m':
    case '15m':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    case '1h':
    case '6h':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    case '24h':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    default:
      return date.toLocaleString()
  }
}

/**
 * 计算数据点的平均值
 * @param dataPoints 数据点数组
 * @returns 平均值
 */
export function calculateAverage(dataPoints: ChartDataPoint[]): number {
  if (dataPoints.length === 0) {
    return 0
  }
  
  const sum = dataPoints.reduce((acc, point) => acc + point.value, 0)
  return sum / dataPoints.length
}

/**
 * 计算数据点的最大值
 * @param dataPoints 数据点数组
 * @returns 最大值
 */
export function calculateMax(dataPoints: ChartDataPoint[]): number {
  if (dataPoints.length === 0) {
    return 0
  }
  
  return Math.max(...dataPoints.map(point => point.value))
}

/**
 * 计算数据点的最小值
 * @param dataPoints 数据点数组
 * @returns 最小值
 */
export function calculateMin(dataPoints: ChartDataPoint[]): number {
  if (dataPoints.length === 0) {
    return 0
  }
  
  return Math.min(...dataPoints.map(point => point.value))
}

/**
 * 计算数据点的总和
 * @param dataPoints 数据点数组
 * @returns 总和
 */
export function calculateSum(dataPoints: ChartDataPoint[]): number {
  return dataPoints.reduce((acc, point) => acc + point.value, 0)
}

/**
 * 平滑数据点
 * @param dataPoints 数据点数组
 * @param windowSize 窗口大小
 * @returns 平滑后的数据点数组
 */
export function smoothDataPoints(dataPoints: ChartDataPoint[], windowSize: number = 3): ChartDataPoint[] {
  if (dataPoints.length === 0 || windowSize <= 1) {
    return dataPoints
  }
  
  const result: ChartDataPoint[] = []
  
  for (let i = 0; i < dataPoints.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2))
    const end = Math.min(dataPoints.length, i + Math.ceil(windowSize / 2))
    
    let sum = 0
    let count = 0
    
    for (let j = start; j < end; j++) {
      sum += dataPoints[j].value
      count++
    }
    
    result.push({
      timestamp: dataPoints[i].timestamp,
      value: sum / count
    })
  }
  
  return result
}

/**
 * 聚合数据点
 * @param dataPoints 数据点数组
 * @param interval 聚合间隔（毫秒）
 * @returns 聚合后的数据点数组
 */
export function aggregateDataPoints(dataPoints: ChartDataPoint[], interval: number): ChartDataPoint[] {
  if (dataPoints.length === 0) {
    return []
  }
  
  const result: ChartDataPoint[] = []
  let currentIntervalStart = new Date(dataPoints[0].timestamp).getTime()
  let currentIntervalEnd = currentIntervalStart + interval
  let intervalValues: number[] = []
  
  for (const point of dataPoints) {
    const pointTime = new Date(point.timestamp).getTime()
    
    if (pointTime >= currentIntervalStart && pointTime < currentIntervalEnd) {
      intervalValues.push(point.value)
    } else {
      if (intervalValues.length > 0) {
        const sum = intervalValues.reduce((acc, val) => acc + val, 0)
        const avg = sum / intervalValues.length
        
        result.push({
          timestamp: new Date(currentIntervalStart + interval / 2).toISOString(),
          value: avg
        })
      }
      
      currentIntervalStart = Math.floor(pointTime / interval) * interval
      currentIntervalEnd = currentIntervalStart + interval
      intervalValues = [point.value]
    }
  }
  
  // 添加最后一个区间的数据
  if (intervalValues.length > 0) {
    const sum = intervalValues.reduce((acc, val) => acc + val, 0)
    const avg = sum / intervalValues.length
    
    result.push({
      timestamp: new Date(currentIntervalStart + interval / 2).toISOString(),
      value: avg
    })
  }
  
  return result
}

/**
 * 自动刷新数据的 Hook
 * @param callback 回调函数
 * @param interval 刷新间隔（毫秒）
 * @param immediate 是否立即执行
 * @returns 停止刷新的函数
 */
export function useAutoRefresh(callback: () => void, interval: number = 30000, immediate: boolean = true) {
  const timer = ref<number | null>(null)
  
  const refresh = () => {
    callback()
    timer.value = window.setTimeout(refresh, interval)
  }
  
  onMounted(() => {
    if (immediate) {
      refresh()
    } else {
      timer.value = window.setTimeout(refresh, interval)
    }
  })
  
  onUnmounted(() => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
  })
  
  const stopRefresh = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }
  
  const startRefresh = () => {
    if (!timer.value) {
      refresh()
    }
  }
  
  return {
    stopRefresh,
    startRefresh
  }
}

/**
 * 格式化大数字为可读格式
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatLargeNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  }
  
  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  
  if (num < 1000000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  
  return `${(num / 1000000000).toFixed(1)}B`
}

/**
 * 格式化字节数为可读格式
 * @param bytes 字节数
 * @returns 格式化后的字符串
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 生成随机颜色
 * @returns 随机颜色字符串
 */
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  
  return color
}

/**
 * 生成一组颜色
 * @param count 颜色数量
 * @returns 颜色字符串数组
 */
export function generateColors(count: number): string[] {
  const colors: string[] = []
  
  for (let i = 0; i < count; i++) {
    colors.push(generateRandomColor())
  }
  
  return colors
}