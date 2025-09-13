import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Topic {
  name: string
  partitionCount: number
  replicationFactor: number
  config: Record<string, string>
  partitions: Partition[]
}

export interface Partition {
  id: number
  leader: number
  replicas: number[]
  isr: number[]
  offset: number
  size: number
}

export const useTopicStore = defineStore('topic', () => {
  const topics = ref<Topic[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function fetchTopics() {
    // 这里应该调用API获取主题列表
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      topics.value = [
        {
          name: 'test-topic',
          partitionCount: 3,
          replicationFactor: 2,
          config: {
            'cleanup.policy': 'delete',
            'retention.ms': '604800000'
          },
          partitions: [
            { id: 0, leader: 0, replicas: [0, 1], isr: [0, 1], offset: 100, size: 1024 },
            { id: 1, leader: 1, replicas: [1, 2], isr: [1, 2], offset: 200, size: 2048 },
            { id: 2, leader: 2, replicas: [2, 0], isr: [2, 0], offset: 300, size: 3072 }
          ]
        }
      ]
      loading.value = false
    }, 500)
  }

  function createTopic(topic: Omit<Topic, 'partitions'>) {
    // 这里应该调用API创建主题
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      const newTopic: Topic = {
        ...topic,
        partitions: Array.from({ length: topic.partitionCount }, (_, i) => ({
          id: i,
          leader: i % 3,
          replicas: [(i % 3), ((i + 1) % 3)],
          isr: [(i % 3), ((i + 1) % 3)],
          offset: 0,
          size: 0
        }))
      }
      topics.value.push(newTopic)
      loading.value = false
    }, 500)
  }

  function deleteTopic(topicName: string) {
    // 这里应该调用API删除主题
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      topics.value = topics.value.filter(topic => topic.name !== topicName)
      loading.value = false
    }, 500)
  }

  function updateTopicConfig(topicName: string, config: Record<string, string>) {
    // 这里应该调用API更新主题配置
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      const topic = topics.value.find(t => t.name === topicName)
      if (topic) {
        topic.config = { ...topic.config, ...config }
      }
      loading.value = false
    }, 500)
  }

  return {
    topics,
    loading,
    error,
    fetchTopics,
    createTopic,
    deleteTopic,
    updateTopicConfig
  }
})