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
      width="670px"
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
          <div style="border: 1px solid #dcdfe6; border-radius: 4px; overflow: hidden;">
            <Codemirror
              v-model="topicForm.configJson"
              placeholder="请输入JSON格式的配置，支持注释（//）"
              :extensions="[basicSetup, json(), isDark ? oneDark : EditorView.theme({}), EditorView.lineWrapping]"
              :style="{ height: '300px', width: '600px' }"
            />
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: #909399;">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover"
            >
              <div style="padding: 10px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px;">常用配置项说明</h4>
                <table style="width: 100%;">
                  <thead>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                      <th style="text-align: left; padding: 6px 0;">属性名</th>
                      <th style="text-align: left; padding: 6px 0;">作用</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid #f0f0f0;" v-for="p_desc in mockPropertiesDesc">
                      <td style="padding: 6px 0; font-family: monospace;">{{ p_desc.name }}</td>
                      <td style="padding: 6px 0; font-size: 12px;">{{ p_desc.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <template #reference>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <el-icon><InfoFilled /></el-icon>
                  <span>配置说明</span>
                </div>
              </template>
            </el-popover>
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
    
    <!-- 主题详情对话框
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
    </el-dialog> -->
    
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
          <div style="border: 1px solid #dcdfe6; border-radius: 4px; overflow: hidden;">
            <Codemirror
              v-model="configForm.configJson"
              placeholder="请输入JSON格式的配置，支持注释（//）"
              :extensions="[basicSetup, json(), isDark ? oneDark : EditorView.theme({}), EditorView.lineWrapping]"
              :style="{ height: '300px', width: '600px' }"
            />
          </div>
          <div style="margin-top: 10px; color: #606266;">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover"
            >
              <div style="padding: 10px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px;">常用配置项说明</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                      <th style="text-align: left; padding: 6px 0;">属性名</th>
                      <th style="text-align: left; padding: 6px 0;">作用</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid #f0f0f0;" v-for="p_desc in mockPropertiesDesc">
                      <td style="padding: 6px 0; font-family: monospace;">{{ p_desc.name }}</td>
                      <td style="padding: 6px 0; font-size: 12px;">{{ p_desc.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <template #reference>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <el-icon><InfoFilled /></el-icon>
                  <span>配置说明</span>
                </div>
              </template>
            </el-popover>
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
import { useThemeStore } from '../stores/theme'
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import type { Topic } from '../stores/topic'
import { Codemirror } from 'vue-codemirror'
import { EditorView, basicSetup } from 'codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { invoke } from '@tauri-apps/api/core'

const topicStore = useTopicStore()
const themeStore = useThemeStore()
const topics = computed(() => topicStore.topics)
const loading = computed(() => topicStore.loading)
const isDark = computed(() => themeStore.currentTheme === 'dark')

const addTopicDialogVisible = ref(false)
const topicDetailDialogVisible = ref(false)
const editConfigDialogVisible = ref(false)
const submitting = ref(false)
const topicFormRef = ref<FormInstance>()
const configFormRef = ref<FormInstance>()
const selectedTopic = ref<Topic | null>(null)
const mockPropertiesDesc = ref([{
  name: "cleanup.policy",
  value: "删除策略，用于控制Kafka如何清理过期数据。设置为'delete'表示删除过期数据，'compact'表示日志压缩（只保留每个key的最新值）。"
}, {
  name: "retention.ms",
  value: "消息保留时间，单位为毫秒。"
}, {
  name: "max.message.bytes", 
  value: "最大消息大小，单位为字节。"
}, {
  name: "segment.bytes",
  value: "日志段大小，单位为字节。"
}, {
  name: "segment.ms",
  value: "日志段滚动时间，单位为毫秒。"
}, {
  name: "delete.retention.ms",
  value: "删除保留时间，单位为毫秒。"
}, {
  name: "retention.bytes",
  value: "日志保留大小，单位为字节；设置为-1表示无限制。"
}])

// 主题表单数据
const topicForm = reactive({
  name: '',
  partitionCount: 1,
  replicationFactor: 1,
  configJson: ''
})

// 配置表单数据
const configForm = reactive({
  name: '',
  configJson: '{}'
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

onMounted(async () => {
  topicStore.fetchTopics()
  topicForm.configJson = await invoke<string>('load_topic_config_template')
  console.log(topicForm.configJson)
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
  configForm.configJson = JSON.stringify(topic.config, null, 2)
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

// 移除JSON字符串中的注释，使带注释的JSON能被标准JSON.parse解析
const removeCommentsFromJson = (jsonString: string): string => {
  // 去除行注释
  let cleanJson = jsonString.replace(/\/\/.*$/gm, '')
  // 去除空格和换行，便于后续处理
  cleanJson = cleanJson.replace(/\s+/g, ' ')
  return cleanJson
}

// 提交主题表单
const submitTopicForm = async () => {
  if (!topicFormRef.value) return
  
  await topicFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      
      try {    
        
        // 创建主题
        topicStore.createTopic({
          name: topicForm.name,
          partitionCount: topicForm.partitionCount,
          replicationFactor: topicForm.replicationFactor,
          properties: removeCommentsFromJson(topicForm.configJson)
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
    // 将配置JSON转换为对象
    let config: Record<string, string> = {}        
    try {
      // 移除注释后再解析
      const cleanJson = removeCommentsFromJson(configForm.configJson)
      config = JSON.parse(cleanJson) || {}        
    } catch (error) {
      ElMessage.error('配置JSON格式错误')
      submitting.value = false
      return
    }
    
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

// 重置主题表单
const resetTopicForm = () => {
  if (topicFormRef.value) {
    topicFormRef.value.resetFields()
  }
  
  Object.assign(topicForm, {
    name: '',
    partitionCount: 1,
    replicationFactor: 1
    // 保留configJson的值，不重置为空字符串，以便显示从后端加载的模板配置
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