/**
 * 格式化日期时间
 * @param date 日期对象或时间戳
 * @param format 格式化模式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDateTime(date: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 保留小数位数，默认 2
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 格式化数字，添加千位分隔符
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 生成随机字符串
 * @param length 字符串长度，默认 8
 * @returns 随机字符串
 */
export function generateRandomString(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as any
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间，单位毫秒，默认 300
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay = 300): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间，单位毫秒，默认 300
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(func: T, delay = 300): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this
    const now = new Date().getTime()
    
    if (now - lastCall < delay) {
      return
    }
    
    lastCall = now
    func.apply(context, args)
  }
}

/**
 * 检查对象是否为空
 * @param obj 要检查的对象
 * @returns 是否为空
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true
  }
  
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.length === 0
  }
  
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0
  }
  
  return false
}

/**
 * 获取对象的深层属性值
 * @param obj 对象
 * @param path 属性路径，如 'a.b.c'
 * @param defaultValue 默认值
 * @returns 属性值
 */
export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  if (!obj || !path) {
    return defaultValue
  }
  
  const keys = path.split('.')
  let result = obj
  
  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue
    }
    
    result = result[key]
  }
  
  return result
}

/**
 * 设置对象的深层属性值
 * @param obj 对象
 * @param path 属性路径，如 'a.b.c'
 * @param value 要设置的值
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  if (!obj || !path) {
    return
  }
  
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
}

/**
 * 等待指定时间
 * @param ms 等待时间，单位毫秒
 * @returns Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 重试函数
 * @param fn 要重试的函数
 * @param retries 重试次数，默认 3
 * @param delay 重试间隔，单位毫秒，默认 1000
 * @returns Promise
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) {
      throw error
    }
    
    await sleep(delay)
    return retry(fn, retries - 1, delay)
  }
}

/**
 * 将错误对象转换为字符串
 * @param error 错误对象
 * @returns 错误字符串
 */
export function errorToString(error: any): string {
  if (!error) {
    return 'Unknown error'
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return JSON.stringify(error)
}

/**
 * 解析 URL 查询参数
 * @param url URL 字符串
 * @returns 查询参数对象
 */
export function parseUrlQuery(url: string): Record<string, string> {
  const query: Record<string, string> = {}
  
  try {
    const urlObj = new URL(url)
    const searchParams = urlObj.searchParams
    
    for (const [key, value] of searchParams.entries()) {
      query[key] = value
    }
  } catch (e) {
    console.error('Failed to parse URL query:', e)
  }
  
  return query
}

/**
 * 构建带查询参数的 URL
 * @param baseUrl 基础 URL
 * @param params 查询参数对象
 * @returns 完整 URL
 */
export function buildUrl(baseUrl: string, params: Record<string, string>): string {
  try {
    const urlObj = new URL(baseUrl)
    
    for (const [key, value] of Object.entries(params)) {
      urlObj.searchParams.set(key, value)
    }
    
    return urlObj.toString()
  } catch (e) {
    console.error('Failed to build URL:', e)
    return baseUrl
  }
}

// 导出图表工具函数
export * from './chart'

// 导出验证工具函数
export * from './validation'