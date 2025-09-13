<template>
  <div class="logs">
    <div class="page-header">
      <h1>操作日志</h1>
      <div class="header-actions">
        <el-input
          v-model="filterKeyword"
          placeholder="搜索日志"
          prefix-icon="Search"
          style="max-width: 300px"
          clearable
        />
        <el-select v-model="logLevel" placeholder="日志级别" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="信息" value="info" />
          <el-option label="警告" value="warning" />
          <el-option label="错误" value="error" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 350px"
        />
        <el-button type="primary" @click="refreshLogs">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button type="danger" @click="clearLogs">
          <el-icon><Delete /></el-icon>
          清空日志
        </el-button>
      </div>
    </div>
    
    <div class="logs-container">
      <el-table
        :data="filteredLogs"
        style="width: 100%"
        v-loading="loading"
        height="calc(100vh - 200px)"
      >
        <el-table-column prop="timestamp" label="时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别" width="100">
          <template #default="scope">
            <el-tag :type="getLogLevelType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="action" label="操作" width="150" />
        <el-table-column prop="message" label="消息" min-width="300" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="ip" label="IP地址" width="120" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="showLogDetails(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="totalLogs"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailsDialogVisible"
      title="日志详情"
      width="700px"
    >
      <div v-if="selectedLog">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ selectedLog.id }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ formatTime(selectedLog.timestamp) }}</el-descriptions-item>
          <el-descriptions-item label="级别">
            <el-tag :type="getLogLevelType(selectedLog.level)">
              {{ selectedLog.level }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="模块">{{ selectedLog.module }}</el-descriptions-item>
          <el-descriptions-item label="操作">{{ selectedLog.action }}</el-descriptions-item>
          <el-descriptions-item label="用户">{{ selectedLog.user }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ selectedLog.ip }}</el-descriptions-item>
          <el-descriptions-item label="会话ID">{{ selectedLog.sessionId }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="log-details-message">
          <h3>消息内容</h3>
          <el-input
            type="textarea"
            v-model="selectedLog.message"
            :rows="4"
            readonly
          />
        </div>
        
        <div class="log-details-data" v-if="selectedLog.data">
          <h3>附加数据</h3>
          <pre>{{ JSON.stringify(selectedLog.data, null, 2) }}</pre>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Delete, Search } from '@element-plus/icons-vue'

// 日志数据类型
interface LogEntry {
  id: string
  timestamp: Date
  level: 'info' | 'warning' | 'error'
  module: string
  action: string
  message: string
  user: string
  ip: string
  sessionId: string
  data?: any
}

// 状态变量
const loading = ref(false)
const filterKeyword = ref('')
const logLevel = ref('')
const dateRange = ref<[Date, Date] | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const totalLogs = ref(0)
const detailsDialogVisible = ref(false)
const selectedLog = ref<LogEntry | null>(null)

// 日志列表
const logs = ref<LogEntry[]>([])

// 过滤后的日志
const filteredLogs = computed(() => {
  let result = logs.value
  
  // 关键字过滤
  if (filterKeyword.value) {
    const keyword = filterKeyword.value.toLowerCase()
    result = result.filter(log => 
      log.message.toLowerCase().includes(keyword) ||
      log.module.toLowerCase().includes(keyword) ||
      log.action.toLowerCase().includes(keyword) ||
      log.user.toLowerCase().includes(keyword)
    )
  }
  
  // 日志级别过滤
  if (logLevel.value) {
    result = result.filter(log => log.level === logLevel.value)
  }
  
  // 日期范围过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value
    result = result.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= startDate && logDate <= endDate
    })
  }
  
  return result
})

onMounted(() => {
  fetchLogs()
})

// 获取日志列表
const fetchLogs = async () => {
  loading.value = true
  
  try {
    // 这里应该调用API获取日志列表
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        level: 'info',
        module: '集群管理',
        action: '添加集群',
        message: '成功添加集群 "test-cluster-1"',
        user: 'admin',
        ip: '192.168.1.100',
        sessionId: 'session-12345',
        data: {
          clusterName: 'test-cluster-1',
          bootstrapServers: 'localhost:9092',
          config: {
            'security.protocol': 'PLAINTEXT'
          }
        }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        level: 'warning',
        module: '主题管理',
        action: '创建主题',
        message: '创建主题 "test-topic" 时警告：分区数超过推荐值',
        user: 'admin',
        ip: '192.168.1.100',
        sessionId: 'session-12345',
        data: {
          topicName: 'test-topic',
          partitions: 20,
          replicationFactor: 3
        }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        level: 'error',
        module: '消费者组',
        action: '重置偏移量',
        message: '重置消费者组 "test-group" 偏移量失败：消费者组不存在',
        user: 'admin',
        ip: '192.168.1.100',
        sessionId: 'session-12345',
        data: {
          groupId: 'test-group',
          resetType: 'earliest'
        }
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        level: 'info',
        module: '消息生产',
        action: '发送消息',
        message: '成功发送消息到主题 "test-topic"',
        user: 'user1',
        ip: '192.168.1.101',
        sessionId: 'session-67890',
        data: {
          topic: 'test-topic',
          partition: 0,
          key: 'key-1',
          valueSize: 1024
        }
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        level: 'info',
        module: '消息消费',
        action: '消费消息',
        message: '从主题 "test-topic" 消费了 10 条消息',
        user: 'user2',
        ip: '192.168.1.102',
        sessionId: 'session-abcde',
        data: {
          topic: 'test-topic',
          consumerGroup: 'test-group',
          messageCount: 10,
          bytesConsumed: 5120
        }
      }
    ]
    
    // 生成更多模拟数据
    for (let i = 6; i <= 50; i++) {
      const modules = ['集群管理', '主题管理', '消息生产', '消息消费', '消费者组', '系统设置']
      const actions = ['添加', '删除', '修改', '查询', '刷新', '导出']
      const levels: ('info' | 'warning' | 'error')[] = ['info', 'warning', 'error']
      const users = ['admin', 'user1', 'user2', 'user3']
      
      const randomModule = modules[Math.floor(Math.random() * modules.length)]
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const randomLevel = levels[Math.floor(Math.random() * levels.length)]
      const randomUser = users[Math.floor(Math.random() * users.length)]
      
      mockLogs.push({
        id: i.toString(),
        timestamp: new Date(Date.now() - 1000 * 60 * 30 * (i - 5)),
        level: randomLevel,
        module: randomModule,
        action: randomAction,
        message: `${randomAction}${randomModule}相关操作`,
        user: randomUser,
        ip: `192.168.1.${100 + Math.floor(Math.random() * 10)}`,
        sessionId: `session-${Math.random().toString(36).substring(2, 10)}`
      })
    }
    
    logs.value = mockLogs
    totalLogs.value = mockLogs.length
  } catch (error) {
    ElMessage.error('获取日志列表失败')
  } finally {
    loading.value = false
  }
}

// 刷新日志列表
const refreshLogs = () => {
  fetchLogs()
}

// 清空日志
const clearLogs = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有日志吗？此操作不可逆！', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 这里应该调用API清空日志
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    logs.value = []
    totalLogs.value = 0
    ElMessage.success('日志已清空')
  } catch (error) {
    // 用户取消操作
  }
}

// 显示日志详情
const showLogDetails = (log: LogEntry) => {
  selectedLog.value = log
  detailsDialogVisible.value = true
}

// 获取日志级别类型
const getLogLevelType = (level: string) => {
  switch (level.toLowerCase()) {
    case 'info':
      return 'success'
    case 'warning':
      return 'warning'
    case 'error':
      return 'danger'
    default:
      return 'info'
  }
}

// 格式化时间
const formatTime = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString()
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}
</script>

<style scoped>
.logs {
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

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.logs-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.log-details-message {
  margin-top: 20px;
}

.log-details-message h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.log-details-data {
  margin-top: 20px;
}

.log-details-data h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.log-details-data pre {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--border-radius);
  padding: 10px;
  overflow: auto;
  max-height: 300px;
}
</style>