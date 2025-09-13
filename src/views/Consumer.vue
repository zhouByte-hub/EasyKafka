<template>
  <div class="consumer">
    <div class="page-header">
      <h1>消息消费</h1>
    </div>
    
    <div class="consumer-container">
      <el-row :gutter="20">
        <!-- 左侧：消费配置 -->
        <el-col :xs="24" :lg="8">
          <div class="consumer-config">
            <h2>消费配置</h2>
            
            <el-form :model="consumerForm" label-width="120px">
              <el-form-item label="目标主题">
                <el-select
                  v-model="consumerForm.topic"
                  placeholder="请选择主题"
                  style="width: 100%"
                  filterable
                  @change="onTopicChange"
                >
                  <el-option
                    v-for="topic in topics"
                    :key="topic.name"
                    :label="topic.name"
                    :value="topic.name"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="消费者组">
                <el-input
                  v-model="consumerForm.groupId"
                  placeholder="输入消费者组ID"
                />
              </el-form-item>
              
              <el-form-item label="分区">
                <el-select
                  v-model="consumerForm.partition"
                  placeholder="所有分区"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="partition in partitions"
                    :key="partition.id"
                    :label="`分区 ${partition.id}`"
                    :value="partition.id"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="起始偏移量">
                <el-radio-group v-model="consumerForm.offsetOption">
                  <el-radio label="earliest">最早</el-radio>
                  <el-radio label="latest">最新</el-radio>
                  <el-radio label="timestamp">时间戳</el-radio>
                  <el-radio label="specific">指定偏移量</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item v-if="consumerForm.offsetOption === 'timestamp'" label="时间戳">
                <el-date-picker
                  v-model="consumerForm.timestamp"
                  type="datetime"
                  placeholder="选择时间"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item v-if="consumerForm.offsetOption === 'specific'" label="偏移量">
                <el-input-number
                  v-model="consumerForm.offset"
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item label="消费数量">
                <el-input-number
                  v-model="consumerForm.limit"
                  :min="1"
                  :max="10000"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item label="自动提交偏移量">
                <el-switch v-model="consumerForm.autoCommit" />
              </el-form-item>
              
            </el-form>
            <div>
               <div>
                <el-button
                  type="primary"
                  @click="startConsuming"
                  :loading="consuming"
                  style="width: 100%"
                >
                  <el-icon size="18" style="margin-right: 5px;"><VideoPlay /></el-icon>
                  开始消费
                </el-button>
              </div>
              
              <div v-if="consuming">
                <el-button
                  type="danger"
                  @click="stopConsuming"
                  style="width: 100%; margin-top: 10px;"
                >
                  <el-icon size="18" style="margin-right: 5px;"><VideoPause /></el-icon>
                  停止消费
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 右侧：消息列表 -->
        <el-col :xs="24" :lg="16">
          <div class="message-list">
            <div class="list-header">
              <h2>消息列表</h2>
              <div class="list-actions">
                <el-input
                  v-model="filterKeyword"
                  placeholder="过滤消息"
                  prefix-icon="Search"
                  style="width: 200px"
                  clearable
                />
                <el-button @click="clearMessages">
                  <el-icon><Delete /></el-icon>
                  清空
                </el-button>
                <el-button @click="exportMessages">
                  <el-icon><Download /></el-icon>
                  导出
                </el-button>
              </div>
            </div>
            
            <div class="message-table-container">
              <el-table
                :data="filteredMessages"
                style="width: 100%"
                height="500"
                v-loading="loading"
              >
                <el-table-column prop="partition" label="分区" width="80" />
                <el-table-column prop="offset" label="偏移量" width="100" />
                <el-table-column prop="timestamp" label="时间戳" width="180">
                  <template #default="scope">
                    {{ formatTime(scope.row.timestamp) }}
                  </template>
                </el-table-column>
                <el-table-column prop="key" label="键" width="150" />
                <el-table-column prop="value" label="值">
                  <template #default="scope">
                    <div class="message-value" @click="showMessageDetail(scope.row)">
                      {{ truncateMessage(scope.row.value) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="scope">
                    <el-button
                      size="small"
                      type="primary"
                      @click="showMessageDetail(scope.row)"
                    >
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <div class="list-footer">
              <div class="message-count">
                共 {{ messages.length }} 条消息
              </div>
              <el-pagination
                v-if="messages.length > 0"
                v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="messages.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 消息详情对话框 -->
    <el-dialog
      v-model="messageDetailVisible"
      title="消息详情"
      width="800px"
    >
      <div v-if="selectedMessage">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="分区">{{ selectedMessage.partition }}</el-descriptions-item>
          <el-descriptions-item label="偏移量">{{ selectedMessage.offset }}</el-descriptions-item>
          <el-descriptions-item label="时间戳">{{ formatTime(selectedMessage.timestamp) }}</el-descriptions-item>
          <el-descriptions-item label="键">{{ selectedMessage.key || '无' }}</el-descriptions-item>
        </el-descriptions>
        
        <h3>消息头</h3>
        <el-table :data="formatHeaders(selectedMessage.headers)" style="width: 100%">
          <el-table-column prop="key" label="键" />
          <el-table-column prop="value" label="值" />
        </el-table>
        
        <h3>消息内容</h3>
        <div class="message-content">
          <pre>{{ formatMessageContent(selectedMessage.value) }}</pre>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="messageDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useTopicStore } from '../stores/topic'
import { VideoPlay, VideoPause, Delete, Download, Search } from '@element-plus/icons-vue'
import type { Topic, Partition } from '../stores/topic'

const topicStore = useTopicStore()
const topics = computed(() => topicStore.topics)

const consuming = ref(false)
const loading = ref(false)
const messageDetailVisible = ref(false)
const selectedMessage = ref<any>(null)
const filterKeyword = ref('')

// 消费表单
const consumerForm = reactive({
  topic: '',
  groupId: 'easy-kafka-consumer',
  partition: undefined as number | undefined,
  offsetOption: 'latest',
  timestamp: null as Date | null,
  offset: 0,
  limit: 100,
  autoCommit: true
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 20
})

// 消息列表
const messages = ref<Array<{
  partition: number
  offset: number
  timestamp: Date
  key: string
  value: string
  headers: Record<string, string>
}>>([])

// 分区列表
const partitions = ref<Partition[]>([])

// 模拟消费定时器
let consumeTimer: number | null = null

onMounted(() => {
  topicStore.fetchTopics()
})

onUnmounted(() => {
  stopConsuming()
})

// 主题变化时更新分区列表
const onTopicChange = () => {
  if (!consumerForm.topic) return
  
  const topic = topics.value.find(t => t.name === consumerForm.topic)
  if (topic) {
    partitions.value = topic.partitions
  } else {
    partitions.value = []
  }
}

// 开始消费
const startConsuming = async () => {
  if (!consumerForm.topic) {
    ElMessage.warning('请选择目标主题')
    return
  }
  
  consuming.value = true
  loading.value = true
  
  try {
    // 这里应该调用API开始消费
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 清空现有消息
    messages.value = []
    
    // 模拟消费消息
    consumeTimer = window.setInterval(() => {
      if (messages.value.length >= consumerForm.limit) {
        stopConsuming()
        return
      }
      
      // 生成模拟消息
      const newMessage = {
        partition: Math.floor(Math.random() * (partitions.value.length || 3)),
        offset: messages.value.length,
        timestamp: new Date(),
        key: `key-${messages.value.length}`,
        value: `这是第 ${messages.value.length + 1} 条消息，内容为随机生成的测试数据。`,
        headers: {
          'content-type': 'text/plain',
          'source': 'easy-kafka'
        }
      }
      
      messages.value.unshift(newMessage)
    }, 1000)
    
    ElMessage.success('开始消费消息')
  } catch (error) {
    ElMessage.error('开始消费失败')
    consuming.value = false
  } finally {
    loading.value = false
  }
}

// 停止消费
const stopConsuming = () => {
  if (consumeTimer) {
    clearInterval(consumeTimer)
    consumeTimer = null
  }
  
  consuming.value = false
  ElMessage.info('已停止消费消息')
}

// 清空消息
const clearMessages = () => {
  messages.value = []
  ElMessage.success('消息已清空')
}

// 导出消息
const exportMessages = () => {
  if (messages.value.length === 0) {
    ElMessage.warning('没有可导出的消息')
    return
  }
  
  // 这里应该实现导出功能
  ElMessage.success(`导出 ${messages.value.length} 条消息`)
}

// 显示消息详情
const showMessageDetail = (message: any) => {
  selectedMessage.value = message
  messageDetailVisible.value = true
}

// 格式化时间
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

// 截断消息
const truncateMessage = (message: string) => {
  if (message.length <= 50) {
    return message
  }
  return message.substring(0, 50) + '...'
}

// 格式化消息头
const formatHeaders = (headers: Record<string, string>) => {
  return Object.entries(headers).map(([key, value]) => ({
    key,
    value
  }))
}

// 格式化消息内容
const formatMessageContent = (content: string) => {
  // 尝试解析JSON
  try {
    const parsed = JSON.parse(content)
    return JSON.stringify(parsed, null, 2)
  } catch (e) {
    return content
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

// 过滤消息
const filteredMessages = computed(() => {
  if (!filterKeyword.value) {
    return messages.value
  }
  
  const keyword = filterKeyword.value.toLowerCase()
  return messages.value.filter(message => 
    message.key.toLowerCase().includes(keyword) || 
    message.value.toLowerCase().includes(keyword)
  )
})
</script>

<style scoped>
.consumer {
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

.consumer-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.consumer-config {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
}

.consumer-config h2 {
  font-size: 18px;
  color: var(--el-text-color-primary);
  margin: 0 0 15px 0;
}

.message-list {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.list-header h2 {
  font-size: 18px;
  color: var(--el-text-color-primary);
  margin: 0;
}

.list-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.message-table-container {
  flex: 1;
  overflow: hidden;
}

.message-value {
  cursor: pointer;
  color: var(--el-color-primary);
}

.message-value:hover {
  text-decoration: underline;
}

.list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.message-count {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.message-content {
  background-color: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--border-radius);
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.message-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

h3 {
  margin: 15px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}
</style>