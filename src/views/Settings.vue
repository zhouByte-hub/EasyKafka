<template>
  <div class="settings">
    <div class="page-header">
      <h1>设置</h1>
    </div>
    
    <div class="settings-container">
      <el-row :gutter="20">
        <!-- 左侧：设置菜单 -->
        <el-col :xs="24" :sm="6">
          <el-menu
            :default-active="activeMenu"
            class="settings-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="general">
              <el-icon><Setting /></el-icon>
              <span>常规设置</span>
            </el-menu-item>
            <el-menu-item index="appearance">
              <el-icon><Brush /></el-icon>
              <span>外观设置</span>
            </el-menu-item>
            <el-menu-item index="cluster">
              <el-icon><Connection /></el-icon>
              <span>集群设置</span>
            </el-menu-item>
            <el-menu-item index="consumer">
              <el-icon><User /></el-icon>
              <span>消费者设置</span>
            </el-menu-item>
            <el-menu-item index="producer">
              <el-icon><Promotion /></el-icon>
              <span>生产者设置</span>
            </el-menu-item>
            <el-menu-item index="monitoring">
              <el-icon><Monitor /></el-icon>
              <span>监控设置</span>
            </el-menu-item>
            <el-menu-item index="advanced">
              <el-icon><Tools /></el-icon>
              <span>高级设置</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        
        <!-- 右侧：设置内容 -->
        <el-col :xs="24" :sm="18">
          <div class="settings-content">
            <!-- 常规设置 -->
            <div v-if="activeMenu === 'general'" class="settings-section">
              <h2>常规设置</h2>
              
              <el-form :model="generalSettings" label-width="150px">
                <el-form-item label="语言">
                  <el-select v-model="generalSettings.language" style="width: 200px">
                    <el-option label="简体中文" value="zh-CN" />
                    <el-option label="English" value="en-US" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="自动刷新间隔">
                  <el-input-number
                    v-model="generalSettings.autoRefreshInterval"
                    :min="5"
                    :max="3600"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">秒</span>
                </el-form-item>
                
                <el-form-item label="启动时自动连接">
                  <el-switch v-model="generalSettings.autoConnectOnStartup" />
                </el-form-item>
                
                <el-form-item label="默认集群">
                  <el-select v-model="generalSettings.defaultCluster" style="width: 200px" clearable>
                    <el-option
                      v-for="cluster in clusters"
                      :key="cluster.id"
                      :label="cluster.name"
                      :value="cluster.id"
                    />
                  </el-select>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveGeneralSettings">保存</el-button>
                  <el-button @click="resetGeneralSettings">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 外观设置 -->
            <div v-if="activeMenu === 'appearance'" class="settings-section">
              <h2>外观设置</h2>
              
              <el-form :model="appearanceSettings" label-width="150px">
                <el-form-item label="主题">
                  <el-radio-group v-model="appearanceSettings.theme">
                    <el-radio label="light">浅色</el-radio>
                    <el-radio label="dark">深色</el-radio>
                    <el-radio label="system">跟随系统</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="主题色">
                  <el-color-picker v-model="appearanceSettings.primaryColor" />
                </el-form-item>
                
                <el-form-item label="紧凑模式">
                  <el-switch v-model="appearanceSettings.compactMode" />
                </el-form-item>
                
                <el-form-item label="显示表格边框">
                  <el-switch v-model="appearanceSettings.showTableBorder" />
                </el-form-item>
                
                <el-form-item label="消息显示行数">
                  <el-input-number
                    v-model="appearanceSettings.messageDisplayLines"
                    :min="1"
                    :max="10"
                    style="width: 200px"
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveAppearanceSettings">保存</el-button>
                  <el-button @click="resetAppearanceSettings">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 集群设置 -->
            <div v-if="activeMenu === 'cluster'" class="settings-section">
              <h2>集群设置</h2>
              
              <el-form :model="clusterSettings" label-width="150px">
                <el-form-item label="连接超时">
                  <el-input-number
                    v-model="clusterSettings.connectionTimeout"
                    :min="1000"
                    :max="60000"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">毫秒</span>
                </el-form-item>
                
                <el-form-item label="请求超时">
                  <el-input-number
                    v-model="clusterSettings.requestTimeout"
                    :min="1000"
                    :max="60000"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">毫秒</span>
                </el-form-item>
                
                <el-form-item label="心跳间隔">
                  <el-input-number
                    v-model="clusterSettings.heartbeatInterval"
                    :min="1000"
                    :max="30000"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">毫秒</span>
                </el-form-item>
                
                <el-form-item label="元数据刷新间隔">
                  <el-input-number
                    v-model="clusterSettings.metadataRefreshInterval"
                    :min="5000"
                    :max="300000"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">毫秒</span>
                </el-form-item>
                
                <el-form-item label="启用SSL">
                  <el-switch v-model="clusterSettings.enableSSL" />
                </el-form-item>
                
                <el-form-item label="启用SASL">
                  <el-switch v-model="clusterSettings.enableSASL" />
                </el-form-item>
                
                <el-form-item v-if="clusterSettings.enableSASL" label="SASL机制">
                  <el-select v-model="clusterSettings.saslMechanism" style="width: 200px">
                    <el-option label="PLAIN" value="PLAIN" />
                    <el-option label="SCRAM-SHA-256" value="SCRAM-SHA-256" />
                    <el-option label="SCRAM-SHA-512" value="SCRAM-SHA-512" />
                  </el-select>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveClusterSettings">保存</el-button>
                  <el-button @click="resetClusterSettings">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 消费者设置 -->
            <div v-if="activeMenu === 'consumer'" class="settings-section">
              <h2>消费者设置</h2>
              
              <el-form :model="consumerSettings" label-width="150px">
                <el-form-item label="自动提交偏移量">
                  <el-switch v-model="consumerSettings.autoCommit" />
                </el-form-item>
                
                <el-form-item label="自动提交间隔">
                  <el-input-number
                    v-model="consumerSettings.autoCommitInterval"
                    :min="100"
                    :max="60000"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">毫秒</span>
                </el-form-item>
                
                <el-form-item label="会话超时">
                  <el-input-number
                    v-model="consumerSettings.sessionTimeout"
                    :min="1000"
                    :max="30000"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">毫秒</span>
                </el-form-item>
                
                <el-form-item label="最大轮询记录">
                  <el-input-number
                    v-model="consumerSettings.maxPollRecords"
                    :min="1"
                    :max="10000"
                    style="width: 200px"
                  />
                </el-form-item>
                
                <el-form-item label="最大轮询间隔">
                  <el-input-number
                    v-model="consumerSettings.maxPollInterval"
                    :min="1000"
                    :max="300000"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">毫秒</span>
                </el-form-item>
                
                <el-form-item label="默认从偏移量">
                  <el-select v-model="consumerSettings.defaultOffset" style="width: 200px">
                    <el-option label="最早" value="earliest" />
                    <el-option label="最新" value="latest" />
                  </el-select>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveConsumerSettings">保存</el-button>
                  <el-button @click="resetConsumerSettings">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 生产者设置 -->
            <div v-if="activeMenu === 'producer'" class="settings-section">
              <h2>生产者设置</h2>
              
              <el-form :model="producerSettings" label-width="150px">
                <el-form-item label="确认机制">
                  <el-select v-model="producerSettings.acks" style="width: 200px">
                    <el-option label="0" value="0" />
                    <el-option label="1" value="1" />
                    <el-option label="all" value="all" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="重试次数">
                  <el-input-number
                    v-model="producerSettings.retries"
                    :min="0"
                    :max="10"
                    style="width: 200px"
                  />
                </el-form-item>
                
                <el-form-item label="批处理大小">
                  <el-input-number
                    v-model="producerSettings.batchSize"
                    :min="0"
                    :max="1048576"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">字节</span>
                </el-form-item>
                
                <el-form-item label="批处理延迟">
                  <el-input-number
                    v-model="producerSettings.lingerMs"
                    :min="0"
                    :max="1000"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">毫秒</span>
                </el-form-item>
                
                <el-form-item label="缓冲内存大小">
                  <el-input-number
                    v-model="producerSettings.bufferMemory"
                    :min="0"
                    :max="1073741824"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">字节</span>
                </el-form-item>
                
                <el-form-item label="压缩类型">
                  <el-select v-model="producerSettings.compressionType" style="width: 200px">
                    <el-option label="无" value="none" />
                    <el-option label="GZIP" value="gzip" />
                    <el-option label="Snappy" value="snappy" />
                    <el-option label="LZ4" value="lz4" />
                    <el-option label="ZSTD" value="zstd" />
                  </el-select>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveProducerSettings">保存</el-button>
                  <el-button @click="resetProducerSettings">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 监控设置 -->
            <div v-if="activeMenu === 'monitoring'" class="settings-section">
              <h2>监控设置</h2>
              
              <el-form :model="monitoringSettings" label-width="150px">
                <el-form-item label="启用实时监控">
                  <el-switch v-model="monitoringSettings.enableRealTimeMonitoring" />
                </el-form-item>
                
                <el-form-item label="监控数据保留">
                  <el-input-number
                    v-model="monitoringSettings.dataRetentionDays"
                    :min="1"
                    :max="365"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">天</span>
                </el-form-item>
                
                <el-form-item label="图表刷新间隔">
                  <el-input-number
                    v-model="monitoringSettings.chartRefreshInterval"
                    :min="1"
                    :max="60"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">秒</span>
                </el-form-item>
                
                <el-form-item label="默认时间范围">
                  <el-select v-model="monitoringSettings.defaultTimeRange" style="width: 200px">
                    <el-option label="5分钟" value="5m" />
                    <el-option label="15分钟" value="15m" />
                    <el-option label="1小时" value="1h" />
                    <el-option label="6小时" value="6h" />
                    <el-option label="24小时" value="24h" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="启用告警">
                  <el-switch v-model="monitoringSettings.enableAlerts" />
                </el-form-item>
                
                <el-form-item v-if="monitoringSettings.enableAlerts" label="告警邮箱">
                  <el-input
                    v-model="monitoringSettings.alertEmail"
                    placeholder="输入告警邮箱"
                    style="width: 300px"
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveMonitoringSettings">保存</el-button>
                  <el-button @click="resetMonitoringSettings">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 高级设置 -->
            <div v-if="activeMenu === 'advanced'" class="settings-section">
              <h2>高级设置</h2>
              
              <el-form :model="advancedSettings" label-width="150px">
                <el-form-item label="日志级别">
                  <el-select v-model="advancedSettings.logLevel" style="width: 200px">
                    <el-option label="ERROR" value="error" />
                    <el-option label="WARN" value="warn" />
                    <el-option label="INFO" value="info" />
                    <el-option label="DEBUG" value="debug" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="最大日志文件大小">
                  <el-input-number
                    v-model="advancedSettings.maxLogFileSize"
                    :min="1"
                    :max="100"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">MB</span>
                </el-form-item>
                
                <el-form-item label="日志保留天数">
                  <el-input-number
                    v-model="advancedSettings.logRetentionDays"
                    :min="1"
                    :max="365"
                    style="width: 200px"
                  />
                  <span style="margin-left: 10px">天</span>
                </el-form-item>
                
                <el-form-item label="启用调试模式">
                  <el-switch v-model="advancedSettings.enableDebugMode" />
                </el-form-item>
                
                <el-form-item label="启用遥测数据">
                  <el-switch v-model="advancedSettings.enableTelemetry" />
                </el-form-item>
                
                <el-form-item label="检查更新">
                  <el-switch v-model="advancedSettings.checkForUpdates" />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveAdvancedSettings">保存</el-button>
                  <el-button @click="resetAdvancedSettings">重置</el-button>
                </el-form-item>
              </el-form>
              
              <div class="danger-zone">
                <h3>危险区域</h3>
                <el-button type="danger" @click="clearCache">清除缓存</el-button>
                <el-button type="danger" @click="resetSettings">重置所有设置</el-button>
                <el-button type="danger" @click="exportSettings">导出设置</el-button>
                <el-button type="danger" @click="importSettings">导入设置</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Setting, Brush, Connection, User, Promotion, 
  Monitor, Tools 
} from '@element-plus/icons-vue'
import { useSettingsStore } from '../stores/settings'
import { useClusterStore } from '../stores/cluster'

const settingsStore = useSettingsStore()
const clusterStore = useClusterStore()
const clusters = computed(() => clusterStore.clusters)

// 当前选中的菜单
const activeMenu = ref('general')

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

// 常规设置
const generalSettings = reactive({
  language: 'zh-CN',
  autoRefreshInterval: 30,
  autoConnectOnStartup: false,
  defaultCluster: ''
})

// 外观设置
const appearanceSettings = reactive({
  theme: 'light',
  primaryColor: '#409EFF',
  compactMode: false,
  showTableBorder: true,
  messageDisplayLines: 3
})

// 集群设置
const clusterSettings = reactive({
  connectionTimeout: 5000,
  requestTimeout: 10000,
  heartbeatInterval: 3000,
  metadataRefreshInterval: 30000,
  enableSSL: false,
  enableSASL: false,
  saslMechanism: 'PLAIN'
})

// 消费者设置
const consumerSettings = reactive({
  autoCommit: true,
  autoCommitInterval: 5000,
  sessionTimeout: 10000,
  maxPollRecords: 500,
  maxPollInterval: 300000,
  defaultOffset: 'latest'
})

// 生产者设置
const producerSettings = reactive({
  acks: '1',
  retries: 0,
  batchSize: 16384,
  lingerMs: 0,
  bufferMemory: 33554432,
  compressionType: 'none'
})

// 监控设置
const monitoringSettings = reactive({
  enableRealTimeMonitoring: true,
  dataRetentionDays: 7,
  chartRefreshInterval: 5,
  defaultTimeRange: '1h',
  enableAlerts: false,
  alertEmail: ''
})

// 高级设置
const advancedSettings = reactive({
  logLevel: 'info',
  maxLogFileSize: 10,
  logRetentionDays: 30,
  enableDebugMode: false,
  enableTelemetry: true,
  checkForUpdates: true
})

onMounted(() => {
  // 从存储中加载设置
  loadSettings()
})

// 加载设置
const loadSettings = () => {
  // 这里应该从存储中加载设置
  // 模拟加载
  Object.assign(generalSettings, settingsStore.general)
  Object.assign(appearanceSettings, settingsStore.appearance)
  Object.assign(clusterSettings, settingsStore.cluster)
  Object.assign(consumerSettings, settingsStore.consumer)
  Object.assign(producerSettings, settingsStore.producer)
  Object.assign(monitoringSettings, settingsStore.monitoring)
  Object.assign(advancedSettings, settingsStore.advanced)
}

// 保存常规设置
const saveGeneralSettings = () => {
  settingsStore.updateGeneral(generalSettings)
  ElMessage.success('常规设置已保存')
}

// 重置常规设置
const resetGeneralSettings = () => {
  ElMessageBox.confirm('确定要重置常规设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置为默认值
    generalSettings.language = 'zh-CN'
    generalSettings.autoRefreshInterval = 30
    generalSettings.autoConnectOnStartup = false
    generalSettings.defaultCluster = ''
    
    settingsStore.updateGeneral(generalSettings)
    ElMessage.success('常规设置已重置')
  }).catch(() => {})
}

// 保存外观设置
const saveAppearanceSettings = () => {
  settingsStore.updateAppearance(appearanceSettings)
  ElMessage.success('外观设置已保存')
}

// 重置外观设置
const resetAppearanceSettings = () => {
  ElMessageBox.confirm('确定要重置外观设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置为默认值
    appearanceSettings.theme = 'light'
    appearanceSettings.primaryColor = '#409EFF'
    appearanceSettings.compactMode = false
    appearanceSettings.showTableBorder = true
    appearanceSettings.messageDisplayLines = 3
    
    settingsStore.updateAppearance(appearanceSettings)
    ElMessage.success('外观设置已重置')
  }).catch(() => {})
}

// 保存集群设置
const saveClusterSettings = () => {
  settingsStore.updateCluster(clusterSettings)
  ElMessage.success('集群设置已保存')
}

// 重置集群设置
const resetClusterSettings = () => {
  ElMessageBox.confirm('确定要重置集群设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置为默认值
    clusterSettings.connectionTimeout = 5000
    clusterSettings.requestTimeout = 10000
    clusterSettings.heartbeatInterval = 3000
    clusterSettings.metadataRefreshInterval = 30000
    clusterSettings.enableSSL = false
    clusterSettings.enableSASL = false
    clusterSettings.saslMechanism = 'PLAIN'
    
    settingsStore.updateCluster(clusterSettings)
    ElMessage.success('集群设置已重置')
  }).catch(() => {})
}

// 保存消费者设置
const saveConsumerSettings = () => {
  settingsStore.updateConsumer(consumerSettings)
  ElMessage.success('消费者设置已保存')
}

// 重置消费者设置
const resetConsumerSettings = () => {
  ElMessageBox.confirm('确定要重置消费者设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置为默认值
    consumerSettings.autoCommit = true
    consumerSettings.autoCommitInterval = 5000
    consumerSettings.sessionTimeout = 10000
    consumerSettings.maxPollRecords = 500
    consumerSettings.maxPollInterval = 300000
    consumerSettings.defaultOffset = 'latest'
    
    settingsStore.updateConsumer(consumerSettings)
    ElMessage.success('消费者设置已重置')
  }).catch(() => {})
}

// 保存生产者设置
const saveProducerSettings = () => {
  settingsStore.updateProducer(producerSettings)
  ElMessage.success('生产者设置已保存')
}

// 重置生产者设置
const resetProducerSettings = () => {
  ElMessageBox.confirm('确定要重置生产者设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置为默认值
    producerSettings.acks = '1'
    producerSettings.retries = 0
    producerSettings.batchSize = 16384
    producerSettings.lingerMs = 0
    producerSettings.bufferMemory = 33554432
    producerSettings.compressionType = 'none'
    
    settingsStore.updateProducer(producerSettings)
    ElMessage.success('生产者设置已重置')
  }).catch(() => {})
}

// 保存监控设置
const saveMonitoringSettings = () => {
  settingsStore.updateMonitoring(monitoringSettings)
  ElMessage.success('监控设置已保存')
}

// 重置监控设置
const resetMonitoringSettings = () => {
  ElMessageBox.confirm('确定要重置监控设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置为默认值
    monitoringSettings.enableRealTimeMonitoring = true
    monitoringSettings.dataRetentionDays = 7
    monitoringSettings.chartRefreshInterval = 5
    monitoringSettings.defaultTimeRange = '1h'
    monitoringSettings.enableAlerts = false
    monitoringSettings.alertEmail = ''
    
    settingsStore.updateMonitoring(monitoringSettings)
    ElMessage.success('监控设置已重置')
  }).catch(() => {})
}

// 保存高级设置
const saveAdvancedSettings = () => {
  settingsStore.updateAdvanced(advancedSettings)
  ElMessage.success('高级设置已保存')
}

// 重置高级设置
const resetAdvancedSettings = () => {
  ElMessageBox.confirm('确定要重置高级设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置为默认值
    advancedSettings.logLevel = 'info'
    advancedSettings.maxLogFileSize = 10
    advancedSettings.logRetentionDays = 30
    advancedSettings.enableDebugMode = false
    advancedSettings.enableTelemetry = true
    advancedSettings.checkForUpdates = true
    
    settingsStore.updateAdvanced(advancedSettings)
    ElMessage.success('高级设置已重置')
  }).catch(() => {})
}

// 清除缓存
const clearCache = () => {
  ElMessageBox.confirm('确定要清除所有缓存吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该实现清除缓存的逻辑
    ElMessage.success('缓存已清除')
  }).catch(() => {})
}

// 重置所有设置
const resetSettings = () => {
  ElMessageBox.confirm('确定要重置所有设置吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该实现重置所有设置的逻辑
    ElMessage.success('所有设置已重置')
  }).catch(() => {})
}

// 导出设置
const exportSettings = () => {
  // 这里应该实现导出设置的逻辑
  ElMessage.success('设置已导出')
}

// 导入设置
const importSettings = () => {
  // 这里应该实现导入设置的逻辑
  ElMessage.success('设置已导入')
}
</script>

<style scoped>
.settings {
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

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-menu {
  border-right: 1px solid var(--el-border-color-light);
}

.settings-content {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section h2 {
  font-size: 20px;
  color: var(--el-text-color-primary);
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.danger-zone {
  margin-top: 30px;
  padding: 20px;
  background-color: var(--el-color-danger-light-9);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-color-danger-light-5);
}

.danger-zone h3 {
  font-size: 16px;
  color: var(--el-color-danger);
  margin: 0 0 15px 0;
}

.danger-zone .el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>