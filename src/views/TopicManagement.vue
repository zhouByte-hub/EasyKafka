<template>
  <div class="topic-management">
    <div class="page-header">
      <h1>主题管理</h1>
      <el-button type="primary" @click="showAddTopicDialog">
        <el-icon><Plus /></el-icon>
        创建主题
      </el-button>
    </div>
    
    <!-- 主题列表 -->
    <div class="topic-list">
      <el-table :data="topics" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="主题名称" width="200" />
        <el-table-column prop="partitionCount" label="分区数" width="100" align="center" />
        <el-table-column prop="replicationFactor" label="副本因子" width="100" align="center"/>
        <el-table-column label="配置">
          <template #default="scope">
            <el-tooltip
              :content="formatConfig(scope.row.config)"
              placement="top"
              effect="light"
            >
              <div class="config-preview">
                {{ formatConfigPreview(scope.row.config) }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button
              size="small"
              @click="viewTopicDetail(scope.row)"
            >
              详情
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="editTopicConfig(scope.row)"
            >
              配置
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteTopic(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 添加主题对话框 -->
    <el-dialog
      v-model="addTopicDialogVisible"
      title="创建主题"
      width="600px"
    >
      <el-form
        ref="topicFormRef"
        :model="topicForm"
        :rules="topicRules"
        label-width="120px"
      >
        <el-form-item label="主题名称" prop="name">
          <el-input v-model="topicForm.name" placeholder="请输入主题名称" />
        </el-form-item>
        
        <el-form-item label="分区数" prop="partitionCount">
          <el-input-number
            v-model="topicForm.partitionCount"
            :min="1"
            :max="100"
            :step="1"
          />
        </el-form-item>
        
        <el-form-item label="副本因子" prop="replicationFactor">
          <el-input-number
            v-model="topicForm.replicationFactor"
            :min="1"
            :max="10"
            :step="1"
          />
        </el-form-item>
        
        <el-form-item label="配置">
          <div class="config-items">
            <div
              v-for="(config, index) in topicForm.configItems"
              :key="index"
              class="config-item"
            >
              <el-input
                v-model="config.key"
                placeholder="配置键"
                style="width: 45%"
              />
              <span class="config-separator">=</span>
              <el-input
                v-model="config.value"
                placeholder="配置值"
                style="width: 45%"
              />
              <el-button
                type="danger"
                size="small"
                circle
                @click="removeConfigItem(index)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button type="primary" size="small" @click="addConfigItem">
              <el-icon><Plus /></el-icon>
              添加配置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addTopicDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTopicForm" :loading="submitting">
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 主题详情对话框 -->
    <el-dialog
      v-model="topicDetailDialogVisible"
      title="主题详情"
      width="800px"
    >
      <div v-if="selectedTopic">
        <h3>基本信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主题名称">{{ selectedTopic.name }}</el-descriptions-item>
          <el-descriptions-item label="分区数">{{ selectedTopic.partitionCount }}</el-descriptions-item>
          <el-descriptions-item label="副本因子">{{ selectedTopic.replicationFactor }}</el-descriptions-item>
          <el-descriptions-item label="总消息数">{{ getTotalMessages(selectedTopic) }}</el-descriptions-item>
        </el-descriptions>
        
        <h3>分区信息</h3>
        <el-table :data="selectedTopic.partitions" style="width: 100%">
          <el-table-column prop="id" label="分区ID" width="100" />
          <el-table-column prop="leader" label="Leader" width="100" />
          <el-table-column label="副本" width="200">
            <template #default="scope">
              {{ scope.row.replicas.join(', ') }}
            </template>
          </el-table-column>
          <el-table-column label="ISR" width="200">
            <template #default="scope">
              {{ scope.row.isr.join(', ') }}
            </template>
          </el-table-column>
          <el-table-column prop="offset" label="偏移量" width="120" />
          <el-table-column prop="size" label="大小 (字节)" width="120" />
        </el-table>
        
        <h3>配置</h3>
        <el-table :data="formatConfigForTable(selectedTopic.config)" style="width: 100%">
          <el-table-column prop="key" label="配置键" />
          <el-table-column prop="value" label="配置值" />
        </el-table>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="topicDetailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 编辑主题配置对话框 -->
    <el-dialog
      v-model="editConfigDialogVisible"
      title="编辑主题配置"
      width="600px"
    >
      <el-form
        ref="configFormRef"
        :model="configForm"
        label-width="120px"
      >
        <el-form-item label="主题名称">
          <el-input v-model="configForm.name" disabled />
        </el-form-item>
        
        <el-form-item label="配置">
          <div class="config-items">
            <div
              v-for="(config, index) in configForm.configItems"
              :key="index"
              class="config-item"
            >
              <el-input
                v-model="config.key"
                placeholder="配置键"
                style="width: 45%"
              />
              <span class="config-separator">=</span>
              <el-input
                v-model="config.value"
                placeholder="配置值"
                style="width: 45%"
              />
              <el-button
                type="danger"
                size="small"
                circle
                @click="removeConfigItemFromEdit(index)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button type="primary" size="small" @click="addConfigItemToEdit">
              <el-icon><Plus /></el-icon>
              添加配置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editConfigDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitConfigForm" :loading="submitting">
            更新
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useTopicStore } from '../stores/topic'
import { Plus, Delete } from '@element-plus/icons-vue'
import type { Topic } from '../stores/topic'

const topicStore = useTopicStore()
const topics = computed(() => topicStore.topics)
const loading = computed(() => topicStore.loading)

const addTopicDialogVisible = ref(false)
const topicDetailDialogVisible = ref(false)
const editConfigDialogVisible = ref(false)
const submitting = ref(false)
const topicFormRef = ref<FormInstance>()
const configFormRef = ref<FormInstance>()
const selectedTopic = ref<Topic | null>(null)

// 主题表单数据
const topicForm = reactive({
  name: '',
  partitionCount: 1,
  replicationFactor: 1,
  configItems: [
    { key: 'cleanup.policy', value: 'delete' },
    { key: 'retention.ms', value: '604800000' }
  ]
})

// 配置表单数据
const configForm = reactive({
  name: '',
  configItems: [] as { key: string; value: string }[]
})

// 表单验证规则
const topicRules: FormRules = {
  name: [
    { required: true, message: '请输入主题名称', trigger: 'blur' },
    { min: 1, max: 249, message: '长度在 1 到 249 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9._-]+$/, message: '只能包含字母、数字、点、下划线和连字符', trigger: 'blur' }
  ],
  partitionCount: [
    { required: true, message: '请输入分区数', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '分区数在 1 到 100 之间', trigger: 'blur' }
  ],
  replicationFactor: [
    { required: true, message: '请输入副本因子', trigger: 'blur' },
    { type: 'number', min: 1, max: 10, message: '副本因子在 1 到 10 之间', trigger: 'blur' }
  ]
}

onMounted(() => {
  topicStore.fetchTopics()
})

// 显示添加主题对话框
const showAddTopicDialog = () => {
  resetTopicForm()
  addTopicDialogVisible.value = true
}

// 查看主题详情
const viewTopicDetail = (topic: Topic) => {
  selectedTopic.value = topic
  topicDetailDialogVisible.value = true
}

// 编辑主题配置
const editTopicConfig = (topic: Topic) => {
  configForm.name = topic.name
  configForm.configItems = Object.entries(topic.config).map(([key, value]) => ({
    key,
    value
  }))
  editConfigDialogVisible.value = true
}

// 删除主题
const deleteTopic = (topic: Topic) => {
  ElMessageBox.confirm(
    `确定要删除主题 "${topic.name}" 吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      topicStore.deleteTopic(topic.name)
      ElMessage.success('主题删除成功')
    })
    .catch(() => {
      // 用户取消删除
    })
}

// 提交主题表单
const submitTopicForm = async () => {
  if (!topicFormRef.value) return
  
  await topicFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      
      try {
        // 将配置项转换为对象
        const config: Record<string, string> = {}
        topicForm.configItems.forEach(item => {
          if (item.key && item.value) {
            config[item.key] = item.value
          }
        })
        
        // 创建主题
        topicStore.createTopic({
          name: topicForm.name,
          partitionCount: topicForm.partitionCount,
          replicationFactor: topicForm.replicationFactor,
          config
        })
        
        ElMessage.success('主题创建成功')
        addTopicDialogVisible.value = false
      } catch (error) {
        ElMessage.error('创建主题失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 提交配置表单
const submitConfigForm = async () => {
  if (!configFormRef.value || !selectedTopic.value) return
  
  submitting.value = true
  
  try {
    // 将配置项转换为对象
    const config: Record<string, string> = {}
    configForm.configItems.forEach(item => {
      if (item.key && item.value) {
        config[item.key] = item.value
      }
    })
    
    // 更新主题配置
    topicStore.updateTopicConfig(configForm.name, config)
    
    ElMessage.success('主题配置更新成功')
    editConfigDialogVisible.value = false
  } catch (error) {
    ElMessage.error('更新主题配置失败')
  } finally {
    submitting.value = false
  }
}

// 添加配置项
const addConfigItem = () => {
  topicForm.configItems.push({ key: '', value: '' })
}

// 移除配置项
const removeConfigItem = (index: number) => {
  topicForm.configItems.splice(index, 1)
}

// 添加配置项到编辑表单
const addConfigItemToEdit = () => {
  configForm.configItems.push({ key: '', value: '' })
}

// 移除配置项从编辑表单
const removeConfigItemFromEdit = (index: number) => {
  configForm.configItems.splice(index, 1)
}

// 重置主题表单
const resetTopicForm = () => {
  if (topicFormRef.value) {
    topicFormRef.value.resetFields()
  }
  
  Object.assign(topicForm, {
    name: '',
    partitionCount: 1,
    replicationFactor: 1,
    configItems: [
      { key: 'cleanup.policy', value: 'delete' },
      { key: 'retention.ms', value: '604800000' }
    ]
  })
}

// 格式化配置
const formatConfig = (config: Record<string, string>) => {
  return Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
}

// 格式化配置预览
const formatConfigPreview = (config: Record<string, string>) => {
  const entries = Object.entries(config)
  if (entries.length === 0) return '无配置'
  
  if (entries.length <= 2) {
    return entries.map(([key, value]) => `${key}=${value}`).join(', ')
  }
  
  return `${entries[0][0]}=${entries[0][1]}...`
}

// 格式化配置为表格数据
const formatConfigForTable = (config: Record<string, string>) => {
  return Object.entries(config).map(([key, value]) => ({
    key,
    value
  }))
}

// 获取主题总消息数
const getTotalMessages = (topic: Topic) => {
  return topic.partitions.reduce((total, partition) => total + partition.offset, 0)
}
</script>

<style scoped>
.topic-management {
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

.topic-list {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
}

.config-preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-separator {
  color: var(--el-text-color-secondary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

h3 {
  margin: 15px 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}
</style>