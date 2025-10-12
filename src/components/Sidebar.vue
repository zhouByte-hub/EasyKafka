<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapse }">
    <div class="logo-container">
      <img src="/src/assets/images/logo.svg" alt="EasyKafka" class="logo" />
      <h1 class="app-name">EasyKafka</h1>
    </div>
    
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isCollapse"
      @select="handleSelect"
    >
      <el-menu-item index="/">
        <el-icon><DataBoard /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      
      <el-menu-item index="/cluster-management">
        <el-icon><Connection /></el-icon>
        <span>集群管理</span>
      </el-menu-item>
      
      <el-menu-item index="/topic-management">
        <el-icon><Files /></el-icon>
        <span>主题管理</span>
      </el-menu-item>
      
      <el-menu-item index="/producer">
        <el-icon><Promotion /></el-icon>
        <span>消息生产</span>
      </el-menu-item>
      
      <el-menu-item index="/consumer">
        <el-icon><Download /></el-icon>
        <span>消息消费</span>
      </el-menu-item>
      
      <el-menu-item index="/consumer-group-management">
        <el-icon><User /></el-icon>
        <span>消费者组管理</span>
      </el-menu-item>
      
      <el-menu-item index="/logs">
        <el-icon><Document /></el-icon>
        <span>操作日志</span>
      </el-menu-item>
      
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </el-menu-item>
      
      <el-menu-item index="/about">
        <el-icon><InfoFilled /></el-icon>
        <span>关于</span>
      </el-menu-item>
    </el-menu>
    
    <div class="sidebar-footer" :style="{height: isCollapse ? '30px' : '40px'}">
      <el-button
        type="text"
        @click="toggleCollapse"
        class="collapse-btn"
      >
        <el-icon><Operation /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataBoard,
  Connection,
  Files,
  Promotion,
  Download,
  User,
  Document,
  Setting,
  InfoFilled,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)

const handleSelect = (index) => {
  router.push(index)
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 240px;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  flex-shrink: 0; /* 防止侧边栏被压缩 */
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 64px;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.app-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  white-space: nowrap; /* 防止标题换行 */
  overflow: hidden; /* 隐藏溢出部分 */
}

.sidebar.collapsed .app-name {
  display: none;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.sidebar-footer {
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  justify-content: center;
}

.collapse-btn {
  width: 100%;
  justify-content: center;
}
</style>