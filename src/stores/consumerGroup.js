import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsumerGroupStore = defineStore('consumerGroup', () => {
  const consumerGroups = ref([])
  const loading = ref(false)
  const error = ref(null)

  function fetchConsumerGroups(clusterId) {
    // 这里应该调用API获取消费者组列表
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      consumerGroups.value = [
        {
          groupId: 'test-group-1',
          state: 'Stable',
          members: [
            {
              memberId: 'member-1',
              clientId: 'client-1',
              host: '192.168.1.100',
              assignments: [0, 1]
            },
            {
              memberId: 'member-2',
              clientId: 'client-2',
              host: '192.168.1.101',
              assignments: [2]
            }
          ],
          partitions: [
            { topic: 'test-topic', partition: 0, offset: 100, lag: 0, leader: 0 },
            { topic: 'test-topic', partition: 1, offset: 200, lag: 0, leader: 1 },
            { topic: 'test-topic', partition: 2, offset: 300, lag: 0, leader: 2 }
          ],
          offset: 600,
          lag: 0,
          lastSeen: new Date().toISOString()
        }
      ]
      loading.value = false
    }, 500)
  }

  function getConsumerGroupDetail(clusterId, groupId) {
    // 这里应该调用API获取消费者组详情
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      const group = consumerGroups.value.find(g => g.groupId === groupId)
      if (group) {
        // 更新详细信息
        loading.value = false
      } else {
        error.value = `Consumer group ${groupId} not found`
        loading.value = false
      }
    }, 500)
  }

  function resetConsumerGroupOffset(
    clusterId, 
    groupId, 
    topic, 
    resetTo,
    value
  ) {
    // 这里应该调用API重置消费者组偏移量
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      const group = consumerGroups.value.find(g => g.groupId === groupId)
      if (group) {
        // 更新偏移量
        loading.value = false
      } else {
        error.value = `Consumer group ${groupId} not found`
        loading.value = false
      }
    }, 500)
  }

  function deleteConsumerGroup(clusterId, groupId) {
    // 这里应该调用API删除消费者组
    loading.value = true
    error.value = null
    
    // 模拟API调用
    setTimeout(() => {
      consumerGroups.value = consumerGroups.value.filter(g => g.groupId !== groupId)
      loading.value = false
    }, 500)
  }

  return {
    consumerGroups,
    loading,
    error,
    fetchConsumerGroups,
    getConsumerGroupDetail,
    resetConsumerGroupOffset,
    deleteConsumerGroup
  }
})