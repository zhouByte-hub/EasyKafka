import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Message {
  topic: string
  partition: number
  offset: number
  key?: string
  value: string
  timestamp: string
  headers?: Record<string, string>
}

export interface ProducerMessage {
  topic: string
  key?: string
  value: string
  headers?: Record<string, string>
  partition?: number
  timestamp?: string
}

export interface ConsumerMessage extends Message {
  consumedAt: string
}

export const useMessageStore = defineStore('message', () => {
  const messages = ref<Message[]>([])
  const producerHistory = ref<ProducerMessage[]>([])
  const consumerMessages = ref<ConsumerMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isConsuming = ref(false)

  function sendMessage(clusterId: string, message: ProducerMessage) {
    // 这里应该调用API发送消息
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      // 添加到生产历史
      producerHistory.value.push({
        ...message,
        timestamp: new Date().toISOString()
      })
      
      // 限制历史记录数量
      if (producerHistory.value.length > 100) {
        producerHistory.value = producerHistory.value.slice(-100)
      }
      
      loading.value = false
    }, 500)
  }

  function sendBatchMessages(clusterId: string, messages: ProducerMessage[]) {
    // 这里应该调用API批量发送消息
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      // 添加到生产历史
      const timestamp = new Date().toISOString()
      messages.forEach(msg => {
        producerHistory.value.push({
          ...msg,
          timestamp
        })
      })
      
      // 限制历史记录数量
      if (producerHistory.value.length > 100) {
        producerHistory.value = producerHistory.value.slice(-100)
      }
      
      loading.value = false
    }, 500)
  }

  function startConsuming(
    clusterId: string, 
    topic: string, 
    partition?: number, 
    offset?: number,
    limit?: number
  ) {
    // 这里应该调用API开始消费消息
    loading.value = true
    error.value = null
    isConsuming.value = true
    
    // 模拟API调用
    setTimeout(() => {
      // 清空之前的消息
      consumerMessages.value = []
      
      // 模拟消费消息
      const mockMessages: ConsumerMessage[] = [
        {
          topic,
          partition: partition || 0,
          offset: offset || 0,
          key: 'key-1',
          value: 'value-1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          consumedAt: new Date().toISOString()
        },
        {
          topic,
          partition: partition || 0,
          offset: (offset || 0) + 1,
          key: 'key-2',
          value: 'value-2',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          consumedAt: new Date().toISOString()
        }
      ]
      
      consumerMessages.value = mockMessages
      loading.value = false
    }, 500)
  }

  function stopConsuming() {
    // 停止消费消息
    isConsuming.value = false
  }

  function fetchMessages(
    clusterId: string, 
    topic: string, 
    partition?: number, 
    offset?: number,
    limit?: number
  ) {
    // 这里应该调用API获取消息
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      // 模拟获取消息
      const mockMessages: Message[] = [
        {
          topic,
          partition: partition || 0,
          offset: offset || 0,
          key: 'key-1',
          value: 'value-1',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          topic,
          partition: partition || 0,
          offset: (offset || 0) + 1,
          key: 'key-2',
          value: 'value-2',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        }
      ]
      
      messages.value = mockMessages
      loading.value = false
    }, 500)
  }

  function getMessageDetail(clusterId: string, topic: string, partition: number, offset: number) {
    // 这里应该调用API获取消息详情
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      const message = messages.value.find(
        m => m.topic === topic && m.partition === partition && m.offset === offset
      )
      
      if (message) {
        // 更新详细信息
        loading.value = false
      } else {
        error.value = `Message not found`
        loading.value = false
      }
    }, 500)
  }

  function clearProducerHistory() {
    producerHistory.value = []
  }

  function clearConsumerMessages() {
    consumerMessages.value = []
  }

  return {
    messages,
    producerHistory,
    consumerMessages,
    loading,
    error,
    isConsuming,
    sendMessage,
    sendBatchMessages,
    startConsuming,
    stopConsuming,
    fetchMessages,
    getMessageDetail,
    clearProducerHistory,
    clearConsumerMessages
  }
})