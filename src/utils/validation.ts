/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean
  message?: string
}

/**
 * 验证规则接口
 */
export interface ValidationRule {
  validator: (value: any) => boolean | ValidationResult
  message: string
}

/**
 * 验证器类型
 */
export type Validator = (value: any) => boolean | ValidationResult

/**
 * 必填验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function required(message: string = '此字段为必填项'): ValidationRule {
  return {
    validator: (value: any) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: false, message }
      }
      
      if (Array.isArray(value) && value.length === 0) {
        return { isValid: false, message }
      }
      
      return true
    },
    message
  }
}

/**
 * 最小长度验证
 * @param min 最小长度
 * @param message 错误消息
 * @returns 验证规则
 */
export function minLength(min: number, message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '值必须是字符串' }
      }
      
      if (value.length < min) {
        return { isValid: false, message: message || `长度不能少于 ${min} 个字符` }
      }
      
      return true
    },
    message: message || `长度不能少于 ${min} 个字符`
  }
}

/**
 * 最大长度验证
 * @param max 最大长度
 * @param message 错误消息
 * @returns 验证规则
 */
export function maxLength(max: number, message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '值必须是字符串' }
      }
      
      if (value.length > max) {
        return { isValid: false, message: message || `长度不能超过 ${max} 个字符` }
      }
      
      return true
    },
    message: message || `长度不能超过 ${max} 个字符`
  }
}

/**
 * 长度范围验证
 * @param min 最小长度
 * @param max 最大长度
 * @param message 错误消息
 * @returns 验证规则
 */
export function lengthRange(min: number, max: number, message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '值必须是字符串' }
      }
      
      if (value.length < min || value.length > max) {
        return { isValid: false, message: message || `长度必须在 ${min} 到 ${max} 个字符之间` }
      }
      
      return true
    },
    message: message || `长度必须在 ${min} 到 ${max} 个字符之间`
  }
}

/**
 * 最小值验证
 * @param min 最小值
 * @param message 错误消息
 * @returns 验证规则
 */
export function minValue(min: number, message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      const num = Number(value)
      
      if (isNaN(num)) {
        return { isValid: false, message: message || '值必须是数字' }
      }
      
      if (num < min) {
        return { isValid: false, message: message || `值不能小于 ${min}` }
      }
      
      return true
    },
    message: message || `值不能小于 ${min}`
  }
}

/**
 * 最大值验证
 * @param max 最大值
 * @param message 错误消息
 * @returns 验证规则
 */
export function maxValue(max: number, message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      const num = Number(value)
      
      if (isNaN(num)) {
        return { isValid: false, message: message || '值必须是数字' }
      }
      
      if (num > max) {
        return { isValid: false, message: message || `值不能大于 ${max}` }
      }
      
      return true
    },
    message: message || `值不能大于 ${max}`
  }
}

/**
 * 值范围验证
 * @param min 最小值
 * @param max 最大值
 * @param message 错误消息
 * @returns 验证规则
 */
export function valueRange(min: number, max: number, message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      const num = Number(value)
      
      if (isNaN(num)) {
        return { isValid: false, message: message || '值必须是数字' }
      }
      
      if (num < min || num > max) {
        return { isValid: false, message: message || `值必须在 ${min} 到 ${max} 之间` }
      }
      
      return true
    },
    message: message || `值必须在 ${min} 到 ${max} 之间`
  }
}

/**
 * 正则表达式验证
 * @param pattern 正则表达式
 * @param message 错误消息
 * @returns 验证规则
 */
export function pattern(pattern: RegExp, message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '值必须是字符串' }
      }
      
      if (!pattern.test(value)) {
        return { isValid: false, message: message || '格式不正确' }
      }
      
      return true
    },
    message: message || '格式不正确'
  }
}

/**
 * 邮箱验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function email(message?: string): ValidationRule {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '值必须是字符串' }
      }
      
      if (!emailPattern.test(value)) {
        return { isValid: false, message: message || '请输入有效的邮箱地址' }
      }
      
      return true
    },
    message: message || '请输入有效的邮箱地址'
  }
}

/**
 * URL 验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function url(message?: string): ValidationRule {
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '值必须是字符串' }
      }
      
      if (!urlPattern.test(value)) {
        return { isValid: false, message: message || '请输入有效的URL' }
      }
      
      return true
    },
    message: message || '请输入有效的URL'
  }
}

/**
 * IP 地址验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function ipAddress(message?: string): ValidationRule {
  const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '值必须是字符串' }
      }
      
      if (!ipPattern.test(value)) {
        return { isValid: false, message: message || '请输入有效的IP地址' }
      }
      
      return true
    },
    message: message || '请输入有效的IP地址'
  }
}

/**
 * 端口号验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function port(message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      const num = Number(value)
      
      if (isNaN(num)) {
        return { isValid: false, message: message || '值必须是数字' }
      }
      
      if (!Number.isInteger(num)) {
        return { isValid: false, message: message || '端口号必须是整数' }
      }
      
      if (num < 1 || num > 65535) {
        return { isValid: false, message: message || '端口号必须在 1 到 65535 之间' }
      }
      
      return true
    },
    message: message || '端口号必须在 1 到 65535 之间'
  }
}

/**
 * 自定义验证
 * @param validator 验证函数
 * @param message 错误消息
 * @returns 验证规则
 */
export function custom(validator: Validator, message: string): ValidationRule {
  return {
    validator,
    message
  }
}

/**
 * 验证表单字段
 * @param value 字段值
 * @param rules 验证规则数组
 * @returns 验证结果
 */
export function validateField(value: any, rules: ValidationRule[]): ValidationResult {
  for (const rule of rules) {
    const result = rule.validator(value)
    
    if (typeof result === 'boolean') {
      if (!result) {
        return { isValid: false, message: rule.message }
      }
    } else if (!result.isValid) {
      return result
    }
  }
  
  return { isValid: true }
}

/**
 * 验证表单
 * @param formData 表单数据
 * @param validationRules 验证规则对象
 * @returns 验证结果对象
 */
export function validateForm(
  formData: Record<string, any>,
  validationRules: Record<string, ValidationRule[]>
): Record<string, ValidationResult> {
  const result: Record<string, ValidationResult> = {}
  
  for (const field in validationRules) {
    result[field] = validateField(formData[field], validationRules[field])
  }
  
  return result
}

/**
 * 检查表单是否有效
 * @param validationResults 验证结果对象
 * @returns 是否所有字段都有效
 */
export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every(result => result.isValid)
}

/**
 * 获取表单错误消息
 * @param validationResults 验证结果对象
 * @returns 错误消息对象
 */
export function getFormErrors(validationResults: Record<string, ValidationResult>): Record<string, string> {
  const errors: Record<string, string> = {}
  
  for (const field in validationResults) {
    if (!validationResults[field].isValid && validationResults[field].message) {
      errors[field] = validationResults[field].message!
    }
  }
  
  return errors
}

/**
 * Kafka 集群名称验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function clusterName(message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '集群名称必须是字符串' }
      }
      
      if (value.trim() === '') {
        return { isValid: false, message: message || '集群名称不能为空' }
      }
      
      if (value.length < 2 || value.length > 50) {
        return { isValid: false, message: message || '集群名称长度必须在 2 到 50 个字符之间' }
      }
      
      // 只允许字母、数字、下划线和连字符
      if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
        return { isValid: false, message: message || '集群名称只能包含字母、数字、下划线和连字符' }
      }
      
      return true
    },
    message: message || '集群名称格式不正确'
  }
}

/**
 * Kafka Bootstrap Servers 验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function bootstrapServers(message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || 'Bootstrap Servers 必须是字符串' }
      }
      
      if (value.trim() === '') {
        return { isValid: false, message: message || 'Bootstrap Servers 不能为空' }
      }
      
      // 验证格式：host:port,host:port,...
      const servers = value.split(',')
      
      for (const server of servers) {
        const trimmedServer = server.trim()
        
        if (trimmedServer === '') {
          return { isValid: false, message: message || 'Bootstrap Servers 格式不正确' }
        }
        
        // 验证 host:port 格式
        const hostPortPattern = /^([^:]+):(\d+)$/
        const match = trimmedServer.match(hostPortPattern)
        
        if (!match) {
          return { isValid: false, message: message || 'Bootstrap Servers 格式不正确，应为 host:port,host:port,...' }
        }
        
        const port = parseInt(match[2], 10)
        
        if (isNaN(port) || port < 1 || port > 65535) {
          return { isValid: false, message: message || '端口号必须在 1 到 65535 之间' }
        }
      }
      
      return true
    },
    message: message || 'Bootstrap Servers 格式不正确，应为 host:port,host:port,...'
  }
}

/**
 * Kafka 主题名称验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function topicName(message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '主题名称必须是字符串' }
      }
      
      if (value.trim() === '') {
        return { isValid: false, message: message || '主题名称不能为空' }
      }
      
      if (value.length > 249) {
        return { isValid: false, message: message || '主题名称不能超过 249 个字符' }
      }
      
      // 不能以点开头或结尾
      if (value.startsWith('.') || value.endsWith('.')) {
        return { isValid: false, message: message || '主题名称不能以点开头或结尾' }
      }
      
      // 不能包含连续的点
      if (value.includes('..')) {
        return { isValid: false, message: message || '主题名称不能包含连续的点' }
      }
      
      // 只允许字母、数字、点、下划线和连字符
      if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
        return { isValid: false, message: message || '主题名称只能包含字母、数字、点、下划线和连字符' }
      }
      
      return true
    },
    message: message || '主题名称格式不正确'
  }
}

/**
 * Kafka 消费者组 ID 验证
 * @param message 错误消息
 * @returns 验证规则
 */
export function consumerGroupId(message?: string): ValidationRule {
  return {
    validator: (value: any) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: message || '消费者组 ID 必须是字符串' }
      }
      
      if (value.trim() === '') {
        return { isValid: false, message: message || '消费者组 ID 不能为空' }
      }
      
      if (value.length > 249) {
        return { isValid: false, message: message || '消费者组 ID 不能超过 249 个字符' }
      }
      
      return true
    },
    message: message || '消费者组 ID 格式不正确'
  }
}