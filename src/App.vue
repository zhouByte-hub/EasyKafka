<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from './stores/theme'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const route = useRoute()
const themeStore = useThemeStore()

// 计算当前路由名称
const routeName = computed(() => route.name as string)

// 判断是否显示侧边栏和头部
const showLayout = computed(() => {
  // 可以添加不需要显示布局的路由
  return !['login'].includes(routeName.value)
})
</script>

<template>
  <div class="app-container" :class="{ 'dark': themeStore.currentTheme === 'dark' }">
    <!-- 布局容器 -->
    <div v-if="showLayout" class="app-layout">
      <!-- 侧边栏 -->
      <Sidebar />
      
      <!-- 主内容区 -->
      <div class="main-container">
        <!-- 头部导航 -->
        <Header />
        
        <!-- 页面内容 -->
        <div class="page-content">
          <router-view />
        </div>
        
        <!-- 底部信息 -->
        <div class="footer">
          <p>EasyKafka © {{ new Date().getFullYear() }} - 让 Kafka 的使用像呼吸一样简单</p>
        </div>
      </div>
    </div>
    
    <!-- 无布局的页面（如登录页） -->
    <div v-else class="full-page">
      <router-view />
    </div>
  </div>
</template>

<style>
/* 全局样式已在 global.scss 中定义 */
</style>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  transition: background-color 0.3s, color 0.3s;
}

.app-layout {
  display: flex;
  height: 100%;
  width: 100%;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0; /* 防止flex子项溢出 */
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: var(--el-bg-color-page);
  min-width: 0; /* 防止flex子项溢出 */
}

.footer {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
  color: var(--el-text-color-secondary);
  font-size: 12px;
  flex-shrink: 0; /* 防止footer被压缩 */
}

.full-page {
  height: 100%;
  width: 100%;
}

/* 暗色主题适配 */
.app-container.dark {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}
</style>