<template>
  <div class="header">
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.path !== '/'">{{ route.meta.title || route.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="header-right">
      <!-- 集群选择器 -->
      <el-select
        v-model="activeClusterId"
        placeholder="选择集群"
        style="width: 350px; margin-right: 20px"
        @change="handleClusterChange"
      >
        <el-option
          v-for="cluster in clusters"
          :key="cluster.id"
          :label="cluster.name"
          :value="cluster.id"
        >
          <div class="cluster-option">
            <span>{{ cluster.name }}</span>
            <el-tag
              size="small"
              :type="cluster.isActive ? 'success' : 'info'"
            >
              {{ cluster.isActive ? '已连接' : '未连接' }}
            </el-tag>
          </div>
        </el-option>
        <template #empty>
          <div class="empty-cluster">
            <span>暂无集群</span>
            <el-button type="text" @click="goToClusterManagement">去添加</el-button>
          </div>
        </template>
      </el-select>
      
      <!-- 主题切换 -->
      <el-tooltip
        :content="isDark ? '切换到亮色主题' : '切换到暗色主题'"
        placement="bottom"
      >
        <el-button
          type="text"
          @click="toggleTheme"
          class="theme-toggle"
        >
          <el-icon>
            <component :is="isDark ? 'Sunny' : 'Moon'" />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClusterStore } from '../stores/cluster'
import { useThemeStore } from '../stores/theme'
import { ElMessage } from 'element-plus'
import { invoke } from '@tauri-apps/api/core';
import type { ClusterListResponse } from '../stores/cluster'


const route = useRoute()
const router = useRouter()
const clusterStore = useClusterStore()
const themeStore = useThemeStore()

const clusters = computed(() => clusterStore.clusters)
const activeClusterId = computed({
  get: () => clusterStore.activeClusterId || '',
  set: (value) => clusterStore.setActiveCluster(value)
})

// 主题相关
const isDark = computed(() => themeStore.currentTheme === 'dark')

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleClusterChange = (clusterId: string) => {
  clusterStore.setActiveCluster(clusterId)
  ElMessage.success(`已切换到集群: ${clusters.value.find(c => c.id === clusterId)?.name}`)
}

const goToClusterManagement = () => {
  router.push('/cluster-management')
}
onMounted(() => {
  invoke<ClusterListResponse>('cluster_list', {page: 1, limit: 100}).then(result => {
    clusterStore.clearClusters()
     result.list.forEach(cluster => {
      clusterStore.addCluster(cluster)
     })
  })
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 73px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.cluster-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.empty-cluster {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.theme-toggle {
  margin-right: 15px;
  font-size: 18px;
}

.user-avatar {
  cursor: pointer;
}
</style>