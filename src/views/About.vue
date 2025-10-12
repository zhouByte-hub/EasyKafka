<template>
  <div class="about">
    <div class="page-header">
      <h1>关于</h1>
    </div>
    
    <div class="about-container">
      <div class="about-header">
        <div class="logo-container">
          <div class="logo">
            <el-icon size="64"><Connection /></el-icon>
          </div>
          <h1>EasyKafka</h1>
          <p class="version">版本 {{ version }}</p>
        </div>
      </div>
      
      <div class="about-content">
        <el-row :gutter="20">
          <!-- 应用信息 -->
          <el-col :span="24">
            <el-card class="info-card">
              <template #header>
                <div class="card-header">
                  <span>应用信息</span>
                </div>
              </template>
              
              <el-descriptions :column="1" border>
                <el-descriptions-item label="应用名称">EasyKafka</el-descriptions-item>
                <el-descriptions-item label="版本">{{ version }}</el-descriptions-item>
                <el-descriptions-item label="构建时间">{{ buildTime }}</el-descriptions-item>
                <el-descriptions-item label="构建号">{{ buildNumber }}</el-descriptions-item>
                <el-descriptions-item label="Git提交">{{ gitCommit }}</el-descriptions-item>
                <el-descriptions-item label="许可证">{{ license }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
        
        <!-- 更新日志 -->
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <el-card class="changelog-card">
              <template #header>
                <div class="card-header">
                  <span>更新日志</span>
                  <el-button type="primary" size="small" @click="checkForUpdates">
                    <el-icon><Refresh /></el-icon>
                    检查更新
                  </el-button>
                </div>
              </template>
              
              <el-timeline>
                <el-timeline-item
                  v-for="(log, index) in changelog"
                  :key="index"
                  :timestamp="log.version"
                  :type="log.type"
                >
                  <h3>{{ log.title }}</h3>
                  <p>{{ log.date }}</p>
                  <ul>
                    <li v-for="(item, itemIndex) in log.items" :key="itemIndex">
                      {{ item }}
                    </li>
                  </ul>
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection, Refresh } from '@element-plus/icons-vue'

// 版本信息
const version = ref('1.0.0')
const buildTime = ref('2023-11-15 10:30:00')
const buildNumber = ref('20231115.1')
const gitCommit = ref('a1b2c3d4')
const license = ref('MIT')

// 更新日志
const changelog = reactive([
  {
    version: 'v1.0.0',
    title: '正式版发布',
    date: '2023-11-15',
    type: 'success',
    items: [
      '正式发布 EasyKafka 1.0.0 版本',
      '支持集群管理、主题管理、消息生产和消费',
      '支持消费者组管理和监控',
      '提供仪表盘监控 Kafka 集群状态',
      '支持明暗主题切换'
    ]
  },
  {
    version: 'v0.9.0',
    title: 'Beta 版发布',
    date: '2023-10-20',
    type: 'warning',
    items: [
      '发布 Beta 版本，邀请用户测试',
      '完善主题管理功能',
      '优化消息消费性能',
      '修复多个已知问题'
    ]
  },
  {
    version: 'v0.5.0',
    title: 'Alpha 版发布',
    date: '2023-09-10',
    type: 'info',
    items: [
      '发布 Alpha 版本',
      '实现基本的消息生产和消费功能',
      '支持集群连接管理'
    ]
  }
])

// 检查更新
const checkForUpdates = () => {
  ElMessage.info('正在检查更新...')
  
  // 模拟检查更新
  setTimeout(() => {
    ElMessage.success('当前已是最新版本')
  }, 1500)
}

onMounted(() => {
  // 这里可以加载实际的版本信息
})
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 24px;
  color: var(--el-text-color-primary);
}

.about-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-header {
  display: flex;
  justify-content: center;
  padding: 30px 0;
  background-color: var(--el-bg-color-page);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--el-color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.logo-container h1 {
  font-size: 32px;
  color: var(--el-text-color-primary);
  margin: 0;
}

.version {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.changelog-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.changelog-card :deep(.el-timeline-item__content) h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.changelog-card :deep(.el-timeline-item__content) p {
  margin: 0 0 10px 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.changelog-card :deep(.el-timeline-item__content) ul {
  margin: 0;
  padding-left: 20px;
}

.changelog-card :deep(.el-timeline-item__content) li {
  margin-bottom: 5px;
  color: var(--el-text-color-regular);
}
</style>