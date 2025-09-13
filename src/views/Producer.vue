<template>
  <div class="producer">
    <div class="page-header">
      <h1>消息生产</h1>
    </div>
    
    <div class="producer-container">
      <el-row :gutter="20">
        <!-- 左侧：消息编辑区 -->
        <el-col :xs="24" :lg="16">
          <div class="message-editor">
            <div class="editor-header">
              <h2>消息编辑</h2>
              <div class="editor-actions">
                <el-button type="primary" @click="sendMessage" :loading="sending">
                  <el-icon><Promotion /></el-icon>
                  发送消息
                </el-button>
                <el-button @click="clearMessage">
                  <el-icon><Delete /></el-icon>
                  清空
                </el-button>
              </div>
            </div>
            
            <el-form :model="messageForm" label-width="100px">
              <el-form-item label="目标主题">
                <el-select
                  v-model="messageForm.topic"
                  placeholder="请选择主题"
                  style="width: 100%"
                  filterable
                >
                  <el-option
                    v-for="topic in topics"
                    :key="topic.name"
                    :label="topic.name"
                    :value="topic.name"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="消息键(Key)">
                <el-input
                  v-model="messageForm.key"
                  placeholder="可选，输入消息键"
                />
              </el-form-item>
              
              <el-form-item label="消息格式">
                <el-radio-group v-model="messageForm.format">
                  <el-radio label="text">纯文本</el-radio>
                  <el-radio label="json">JSON</el-radio>
                  <el-radio label="avro">AVRO</el-radio>
                  <el-radio label="protobuf">Protobuf</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="消息内容">
                <div class="code-editor">
                  <el-input
                    v-model="messageForm.value"
                    type="textarea"
                    :rows="10"
                    placeholder="请输入消息内容"
                  />
                </div>
              </el-form-item>
              
              <el-form-item label="消息头">
                <div class="headers-container">
                  <div
                    v-for="(header, index) in messageForm.headers"
                    :key="index"
                    class="header-item"
                  >
                    <el-input
                      v-model="header.key"
                      placeholder="Header键"
                      style="width: 45%"
                    />
                    <span class="header-separator">:</span>
                    <el-input
                      v-model="header.value"
                      placeholder="Header值"
                      style="width: 45%"
                    />
                    <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="removeHeader(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                  <el-button type="primary" size="small" @click="addHeader">
                    <el-icon><Plus /></el-icon>
                    添加Header
                  </el-button>
                </div>
              </el-form-item>
              
              <el-form-item label="发送选项">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="分区">
                      <el-select
                        v-model="messageForm.partition"
                        placeholder="自动选择"
                        clearable
                        style="width: 100%"
                      >
                        <el-option
                          v-for="i in 10"
                          :key="i"
                          :label="`分区 ${i-1}`"
                          :value="i-1"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="延迟发送">
                      <el-input-number
                        v-model="messageForm.delay"
                        :min="0"
                        :max="3600000"
                        :step="1000"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        
        <!-- 右侧：发送历史和批量发送 -->
        <el-col :xs="24" :lg="8">
          <!-- 发送历史 -->
          <div class="send-history">
            <div class="history-header">
              <h2>发送历史</h2>
              <el-button size="small" @click="clearHistory">
                <el-icon><Delete /></el-icon>
                清空历史
              </el-button>
            </div>
            
            <div class="history-list">
              <div
                v-for="(item, index) in sendHistory"
                :key="index"
                class="history-item"
              >
                <div class="history-item-header">
                  <span class="history-topic">{{ item.topic }}</span>
                  <el-tag
                    :type="item.success ? 'success' : 'danger'"
                    size="small"
                  >
                    {{ item.success ? '成功' : '失败' }}
                  </el-tag>
                </div>
                <div class="history-item-content">
                  <div class="history-time">{{ formatTime(item.timestamp) }}</div>
                  <div class="history-message" :title="item.message">
                    {{ truncateMessage(item.message) }}
                  </div>
                </div>
              </div>
              
              <div v-if="sendHistory.length === 0" class="empty-history">
                暂无发送历史
              </div>
            </div>
          </div>
          
          <!-- 批量发送 -->
          <div class="batch-send">
            <h2>批量发送</h2>
            <el-form :model="batchForm" label-width="80px">
              <el-form-item label="主题">
                <el-select
                  v-model="batchForm.topic"
                  placeholder="请选择主题"
                  style="width: 100%"
                  filterable
                >
                  <el-option
                    v-for="topic in topics"
                    :key="topic.name"
                    :label="topic.name"
                    :value="topic.name"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="消息数">
                <el-input-number
                  v-model="batchForm.count"
                  :min="1"
                  :max="10000"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item label="间隔(ms)">
                <el-input-number
                  v-model="batchForm.interval"
                  :min="0"
                  :max="10000"
                  :step="100"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button
                  type="primary"
                  @click="sendBatchMessages"
                  :loading="batchSending"
                  style="width: 100%"
                >
                  <el-icon><Promotion /></el-icon>
                  批量发送
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useTopicStore } from '../stores/topic'
import { Promotion, Delete, Plus } from '@element-plus/icons-vue'
import type { Topic } from '../stores/topic'

const topicStore = useTopicStore()
const topics = computed(() => topicStore.topics)

const sending = ref(false)
const batchSending = ref(false)

// 消息表单
const messageForm = reactive({
  topic: '',
  key: '',
  value: '',
  format: 'text',
  headers: [{ key: '', value: '' }],
  partition: undefined as number | undefined,
  delay: 0
})

// 批量发送表单
const batchForm = reactive({
  topic: '',
  count: 10,
  interval: 100
})

// 发送历史
const sendHistory = ref<Array<{
  topic: string
  message: string
  timestamp: Date
  success: boolean
}>>([])

onMounted(() => {
  topicStore.fetchTopics()
})

// 发送消息
const sendMessage = async () => {
  if (!messageForm.topic) {
    ElMessage.warning('请选择目标主题')
    return
  }
  
  if (!messageForm.value) {
    ElMessage.warning('请输入消息内容')
    return
  }
  
  sending.value = true
  
  try {
    // 这里应该调用API发送消息
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 添加到发送历史
    sendHistory.value.unshift({
      topic: messageForm.topic,
      message: messageForm.value,
      timestamp: new Date(),
      success: true
    })
    
    // 限制历史记录数量
    if (sendHistory.value.length > 50) {
      sendHistory.value = sendHistory.value.slice(0, 50)
    }
    
    ElMessage.success('消息发送成功')
  } catch (error) {
    // 添加到发送历史
    sendHistory.value.unshift({
      topic: messageForm.topic,
      message: messageForm.value,
      timestamp: new Date(),
      success: false
    })
    
    ElMessage.error('消息发送失败')
  } finally {
    sending.value = false
  }
}

// 批量发送消息
const sendBatchMessages = async () => {
  if (!batchForm.topic) {
    ElMessage.warning('请选择目标主题')
    return
  }
  
  batchSending.value = true
  
  try {
    // 这里应该调用API批量发送消息
    // 模拟API调用
    for (let i = 0; i < batchForm.count; i++) {
      await new Promise(resolve => setTimeout(resolve, batchForm.interval))
      
      // 添加到发送历史
      sendHistory.value.unshift({
        topic: batchForm.topic,
        message: `批量消息 ${i + 1}/${batchForm.count}`,
        timestamp: new Date(),
        success: true
      })
    }
    
    // 限制历史记录数量
    if (sendHistory.value.length > 50) {
      sendHistory.value = sendHistory.value.slice(0, 50)
    }
    
    ElMessage.success(`成功发送 ${batchForm.count} 条消息`)
  } catch (error) {
    ElMessage.error('批量发送失败')
  } finally {
    batchSending.value = false
  }
}

// 清空消息
const clearMessage = () => {
  messageForm.key = ''
  messageForm.value = ''
  messageForm.headers = [{ key: '', value: '' }]
  messageForm.partition = undefined
  messageForm.delay = 0
}

// 添加Header
const addHeader = () => {
  messageForm.headers.push({ key: '', value: '' })
}

// 移除Header
const removeHeader = (index: number) => {
  if (messageForm.headers.length > 1) {
    messageForm.headers.splice(index, 1)
  }
}

// 清空历史
const clearHistory = () => {
  sendHistory.value = []
}

// 格式化时间
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
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
</script>

<style scoped>
.producer {
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

.producer-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-editor {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-header h2 {
  font-size: 18px;
  color: var(--el-text-color-primary);
  margin: 0;
}

.editor-actions {
  display: flex;
  gap: 10px;
}

.code-editor {
  width: 100%;
}

.headers-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-separator {
  color: var(--el-text-color-secondary);
}

.send-history {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
  margin-bottom: 20px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.history-header h2 {
  font-size: 18px;
  color: var(--el-text-color-primary);
  margin: 0;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--border-radius);
  padding: 10px;
  margin-bottom: 10px;
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.history-topic {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.history-item-content {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.history-time {
  margin-bottom: 5px;
}

.history-message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-history {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 20px 0;
}

.batch-send {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
}

.batch-send h2 {
  font-size: 18px;
  color: var(--el-text-color-primary);
  margin: 0 0 15px 0;
}
</style>