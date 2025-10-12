import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ClusterListResponse {
  current: number
  limit: number
  total: number
  list: ClusterConfig[]
}

export interface ClusterConfig {
  id: string
  name: string
  bootstrapServers: string
  saslMechanism?: string
  saslUsername?: string
  saslPassword?: string
  sslEnabled: boolean
  timeout: number
  isActive: boolean
}

export const useClusterStore = defineStore('cluster', () => {
  const clusters = ref<ClusterConfig[]>([])
  const activeClusterId = ref<string | null>(null)

  const activeCluster = computed(() => {
    if (!activeClusterId.value) return null
    return clusters.value.find(cluster => cluster.id === activeClusterId.value) || null 
  })

  function addCluster(cluster: Omit<ClusterConfig, 'id'>) {
    const newCluster: ClusterConfig = {
      ...cluster,
      id: Date.now().toString()
    }
    clusters.value.push(newCluster)
    return newCluster.id
  }

  function updateCluster(id: string, updates: Partial<ClusterConfig>) {
    const index = clusters.value.findIndex(cluster => cluster.id === id)
    if (index !== -1) {
      clusters.value[index] = { ...clusters.value[index], ...updates }
    }
  }

  function deleteCluster(id: string) {
    clusters.value = clusters.value.filter(cluster => cluster.id !== id)
    if (activeClusterId.value === id) {
      activeClusterId.value = null
    }
  }

  function setActiveCluster(id: string) {
    activeClusterId.value = id
  }

  return {
    clusters,
    activeCluster,
    activeClusterId,
    addCluster,
    updateCluster,
    deleteCluster,
    setActiveCluster
  }
})