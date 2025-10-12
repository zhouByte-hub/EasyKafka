import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useClusterStore = defineStore('cluster', () => {
  const clusters = ref([])
  const activeClusterId = ref(null)

  const activeCluster = computed(() => {
    if (!activeClusterId.value) return null
    return clusters.value.find(cluster => cluster.id === activeClusterId.value) || null 
  })

  function addCluster(cluster) {
    const newCluster = {
      ...cluster,
      id: Date.now().toString()
    }
    clusters.value.push(newCluster)
    return newCluster.id
  }

  function updateCluster(id, updates) {
    const index = clusters.value.findIndex(cluster => cluster.id === id)
    if (index !== -1) {
      clusters.value[index] = { ...clusters.value[index], ...updates }
    }
  }

  function deleteCluster(id) {
    clusters.value = clusters.value.filter(cluster => cluster.id !== id)
    if (activeClusterId.value === id) {
      activeClusterId.value = null
    }
  }

  function setActiveCluster(id) {
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