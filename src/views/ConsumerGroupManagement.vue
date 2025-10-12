<template>
  <div class="consumer-group-management">
    <div class="page-header">
      <h1>消费者组管理</h1>
      <el-button type="primary" @click="refreshConsumerGroups">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>
    
    <div class="consumer-group-container">
      <!-- 消费者组列表 -->
      <div class="group-list">
        <div class="list-header">
          <h2>消费者组列表</h2>
          <div class="list-actions">
            <el-input
              v-model="filterKeyword"
              placeholder="搜索消费者组"
              prefix-icon="Search"
              style="width: 200px"
              clearable
            />
          </div>
        </div>
        
        <el-table
          :data="filteredGroups"
          style="width: 100%"
          v-loading="loading"
          @row-click="selectGroup"
        >
          <el-table-column prop="groupId" label="消费者组ID" min-width="200" />
          <el-table-column prop="state" label="状态" width="120" align="center">
            <template #default="scope">
              <el-tag :type="getGroupStateType(scope.row.state)">
                {{ scope.row.state }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="members" label="成员数" width="120" align="center" />
          <el-table-column prop="partitions" label="分区数" width="120" align="center" />
          <el-table-column prop="totalLag" label="总Lag" width="120" align="center">
            <template #default="scope">
              {{ formatNumber(scope.row.totalLag) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                @click.stop="showGroupDetails(scope.row)"
              >
                详情
              </el-button>
              <el-button
                size="small"
                type="warning"
                @click.stop="showResetOffsetDialog(scope.row)"
              >
                重置偏移量
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.stop="confirmDeleteGroup(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 消费者组详情 -->
      <div v-if="selectedGroup" class="group-details">
        <div class="details-header">
          <h2>消费者组详情: {{ selectedGroup.groupId }}</h2>
          <el-button @click="selectedGroup = null">
            <el-icon><Close /></el-icon>
            关闭
          </el-button>
        </div>
        
        <el-tabs v-model="activeTab">
          <!-- 概览 -->
          <el-tab-pane label="概览" name="overview">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="消费者组ID">{{ selectedGroup.groupId }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getGroupStateType(selectedGroup.state)">
                  {{ selectedGroup.state }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="协调器">{{ selectedGroup.coordinator }}</el-descriptions-item>
              <el-descriptions-item label="成员数">{{ selectedGroup.members }}</el-descriptions-item>
              <el-descriptions-item label="分区数">{{ selectedGroup.partitions }}</el-descriptions-item>
              <el-descriptions-item label="总Lag">{{ formatNumber(selectedGroup.totalLag) }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          
          <!-- 成员 -->
          <el-tab-pane label="成员" name="members">
            <el-table :data="selectedGroup.memberDetails" style="width: 100%">
              <el-table-column prop="memberId" label="成员ID" min-width="200" />
              <el-table-column prop="clientId" label="客户端ID" min-width="150" />
              <el-table-column prop="host" label="主机" min-width="150" />
              <el-table-column prop="assignment" label="分区分配" min-width="200">
                <template #default="scope">
                  {{ formatPartitionAssignment(scope.row.assignment) }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <!-- 分区 -->
          <el-tab-pane label="分区" name="partitions">
            <el-table :data="selectedGroup.partitionDetails" style="width: 100%">
              <el-table-column prop="topic" label="主题" min-width="150" />
              <el-table-column prop="partition" label="分区" width="100" />
              <el-table-column prop="currentOffset" label="当前偏移量" width="150" />
              <el-table-column prop="endOffset" label="结束偏移量" width="150" />
              <el-table-column prop="lag" label="Lag" width="100">
                <template #default="scope">
                  {{ formatNumber(scope.row.lag) }}
                </template>
              </el-table-column>
              <el-table-column prop="consumerId" label="消费者ID" min-width="200" />
            </el-table>
          </el-tab-pane>
          
          <!-- 偏移量历史 -->
          <el-tab-pane label="偏移量历史" name="offset-history">
            <div class="chart-container">
              <div ref="offsetChartRef" style="width: 100%; height: 400px;"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 重置偏移量对话框 -->
    <el-dialog
      v-model="resetOffsetDialogVisible"
      title="重置消费者组偏移量"
      width="500px"
    >
      <div v-if="groupToReset">
        <p>消费者组: <strong>{{ groupToReset.groupId }}</strong></p>
        
        <el-form :model="resetForm" label-width="100px">
          <el-form-item label="重置方式">
            <el-radio-group v-model="resetForm.resetType">
              <el-radio label="earliest">到最早</el-radio>
              <el-radio label="latest">到最新</el-radio>
              <el-radio label="timestamp">到指定时间</el-radio>
              <el-radio label="specific">到指定偏移量</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item v-if="resetForm.resetType === 'timestamp'" label="时间">
            <el-date-picker
              v-model="resetForm.timestamp"
              type="datetime"
              placeholder="选择时间"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item v-if="resetForm.resetType === 'specific'" label="偏移量">
            <el-input-number
              v-model="resetForm.offset"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item v-if="resetForm.resetType === 'specific'" label="分区">
            <el-select
              v-model="resetForm.partition"
              placeholder="选择分区"
              style="width: 100%"
            >
              <el-option
                v-for="partition in groupToReset.partitionDetails"
                :key="partition.partition"
                :label="`${partition.topic}-${partition.partition}`"
                :value="partition.partition"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetOffsetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="resetOffset">确认重置</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除消费者组"
      width="400px"
    >
      <div v-if="groupToDelete">
        <p>确定要删除消费者组 <strong>{{ groupToDelete.groupId }}</strong> 吗？</p>
        <p style="color: var(--el-color-danger);">此操作不可逆，请谨慎操作！</p>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteGroup">确认删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Close, Search } from '@element-plus/icons-vue'

// 状态变量
const loading = ref(false)
const filterKeyword = ref('')
const selectedGroup = ref(null)
const activeTab = ref('overview')
const resetOffsetDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const groupToReset = ref(null)
const groupToDelete = ref(null)
const offsetChartRef = ref(null)

// 重置表单
const resetForm = reactive({
  resetType: 'earliest',
  timestamp: null,
  offset: 0,
  partition: null
})

// 消费者组列表
const consumerGroups = ref([])

// 过滤后的消费者组
const filteredGroups = computed(() => {
  if (!filterKeyword.value) {
    return consumerGroups.value
  }
  
  const keyword = filterKeyword.value.toLowerCase()
  return consumerGroups.value.filter(group => 
    group.groupId.toLowerCase().includes(keyword)
  )
})

onMounted(() => {
  fetchConsumerGroups()
})

// 获取消费者组列表
const fetchConsumerGroups = async () => {
  loading.value = true
  
  try {
    // 这里应该调用API获取消费者组列表
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    consumerGroups.value = [
      {
        groupId: 'test-consumer-group-1',
        state: 'Stable',
        coordinator: 'broker-1',
        members: 3,
        partitions: 10,
        totalLag: 1250,
        memberDetails: [
          {
            memberId: 'member-1',
            clientId: 'client-1',
            host: '192.168.1.100',
            assignment: [
              { topic: 'test-topic-1', partitions: [0, 1, 2] },
              { topic: 'test-topic-2', partitions: [0, 1] }
            ]
          },
          {
            memberId: 'member-2',
            clientId: 'client-2',
            host: '192.168.1.101',
            assignment: [
              { topic: 'test-topic-1', partitions: [3, 4, 5] },
              { topic: 'test-topic-2', partitions: [2, 3] }
            ]
          },
          {
            memberId: 'member-3',
            clientId: 'client-3',
            host: '192.168.1.102',
            assignment: [
              { topic: 'test-topic-1', partitions: [6, 7, 8, 9] },
              { topic: 'test-topic-2', partitions: [4, 5] }
            ]
          }
        ],
        partitionDetails: [
          { topic: 'test-topic-1', partition: 0, currentOffset: 1000, endOffset: 1050, lag: 50, consumerId: 'member-1' },
          { topic: 'test-topic-1', partition: 1, currentOffset: 980, endOffset: 1030, lag: 50, consumerId: 'member-1' },
          { topic: 'test-topic-1', partition: 2, currentOffset: 950, endOffset: 1000, lag: 50, consumerId: 'member-1' },
          { topic: 'test-topic-1', partition: 3, currentOffset: 1100, endOffset: 1150, lag: 50, consumerId: 'member-2' },
          { topic: 'test-topic-1', partition: 4, currentOffset: 1050, endOffset: 1100, lag: 50, consumerId: 'member-2' },
          { topic: 'test-topic-1', partition: 5, currentOffset: 1000, endOffset: 1050, lag: 50, consumerId: 'member-2' },
          { topic: 'test-topic-1', partition: 6, currentOffset: 1200, endOffset: 1250, lag: 50, consumerId: 'member-3' },
          { topic: 'test-topic-1', partition: 7, currentOffset: 1150, endOffset: 1200, lag: 50, consumerId: 'member-3' },
          { topic: 'test-topic-1', partition: 8, currentOffset: 1100, endOffset: 1150, lag: 50, consumerId: 'member-3' },
          { topic: 'test-topic-1', partition: 9, currentOffset: 1050, endOffset: 1100, lag: 50, consumerId: 'member-3' },
          { topic: 'test-topic-2', partition: 0, currentOffset: 500, endOffset: 550, lag: 50, consumerId: 'member-1' },
          { topic: 'test-topic-2', partition: 1, currentOffset: 450, endOffset: 500, lag: 50, consumerId: 'member-1' },
          { topic: 'test-topic-2', partition: 2, currentOffset: 600, endOffset: 650, lag: 50, consumerId: 'member-2' },
          { topic: 'test-topic-2', partition: 3, currentOffset: 550, endOffset: 600, lag: 50, consumerId: 'member-2' },
          { topic: 'test-topic-2', partition: 4, currentOffset: 650, endOffset: 700, lag: 50, consumerId: 'member-3' },
          { topic: 'test-topic-2', partition: 5, currentOffset: 600, endOffset: 650, lag: 50, consumerId: 'member-3' }
        ]
      },
      {
        groupId: 'test-consumer-group-2',
        state: 'Stable',
        coordinator: 'broker-2',
        members: 2,
        partitions: 6,
        totalLag: 300,
        memberDetails: [
          {
            memberId: 'member-4',
            clientId: 'client-4',
            host: '192.168.1.103',
            assignment: [
              { topic: 'test-topic-3', partitions: [0, 1, 2] }
            ]
          },
          {
            memberId: 'member-5',
            clientId: 'client-5',
            host: '192.168.1.104',
            assignment: [
              { topic: 'test-topic-3', partitions: [3, 4, 5] }
            ]
          }
        ],
        partitionDetails: [
          { topic: 'test-topic-3', partition: 0, currentOffset: 2000, endOffset: 2050, lag: 50, consumerId: 'member-4' },
          { topic: 'test-topic-3', partition: 1, currentOffset: 1950, endOffset: 2000, lag: 50, consumerId: 'member-4' },
          { topic: 'test-topic-3', partition: 2, currentOffset: 1900, endOffset: 1950, lag: 50, consumerId: 'member-4' },
          { topic: 'test-topic-3', partition: 3, currentOffset: 2100, endOffset: 2150, lag: 50, consumerId: 'member-5' },
          { topic: 'test-topic-3', partition: 4, currentOffset: 2050, endOffset: 2100, lag: 50, consumerId: 'member-5' },
          { topic: 'test-topic-3', partition: 5, currentOffset: 2000, endOffset: 2050, lag: 50, consumerId: 'member-5' }
        ]
      }
    ]
    
    ElMessage.success('获取消费者组列表成功')
  } catch (error) {
    ElMessage.error('获取消费者组列表失败')
  } finally {
    loading.value = false
  }
}

// 刷新消费者组列表
const refreshConsumerGroups = () => {
  fetchConsumerGroups()
}

// 选择消费者组
const selectGroup = (group) => {
  selectedGroup.value = group
  activeTab.value = 'overview'
}

// 显示消费者组详情
const showGroupDetails = (group) => {
  selectedGroup.value = group
  activeTab.value = 'overview'
}

// 显示重置偏移量对话框
const showResetOffsetDialog = (group) => {
  groupToReset.value = group
  resetForm.resetType = 'earliest'
  resetForm.timestamp = null
  resetForm.offset = 0
  resetForm.partition = null
  resetOffsetDialogVisible.value = true
}

// 重置偏移量
const resetOffset = async () => {
  if (!groupToReset.value) return
  
  try {
    // 这里应该调用API重置偏移量
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(`重置消费者组 ${groupToReset.value.groupId} 的偏移量成功`)
    resetOffsetDialogVisible.value = false
    
    // 刷新数据
    fetchConsumerGroups()
  } catch (error) {
    ElMessage.error('重置偏移量失败')
  }
}

// 确认删除消费者组
const confirmDeleteGroup = (group) => {
  groupToDelete.value = group
  deleteDialogVisible.value = true
}

// 删除消费者组
const deleteGroup = async () => {
  if (!groupToDelete.value) return
  
  try {
    // 这里应该调用API删除消费者组
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(`删除消费者组 ${groupToDelete.value.groupId} 成功`)
    deleteDialogVisible.value = false
    
    // 刷新数据
    fetchConsumerGroups()
    
    // 如果删除的是当前选中的组，清空选中
    if (selectedGroup.value && selectedGroup.value.groupId === groupToDelete.value.groupId) {
      selectedGroup.value = null
    }
  } catch (error) {
    ElMessage.error('删除消费者组失败')
  }
}

// 获取消费者组状态类型
const getGroupStateType = (state) => {
  switch (state.toLowerCase()) {
    case 'stable':
      return 'success'
    case 'preparingrebalance':
    case 'completingrebalance':
      return 'warning'
    case 'dead':
    case 'empty':
      return 'danger'
    default:
      return 'info'
  }
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化分区分配
const formatPartitionAssignment = (assignment) => {
  return assignment.map(a => `${a.topic}: [${a.partitions.join(', ')}]`).join(', ')
}
</script>

<style scoped>
.consumer-group-management {
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

.consumer-group-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.group-list {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
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

.group-details {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.details-header h2 {
  font-size: 18px;
  color: var(--el-text-color-primary);
  margin: 0;
}

.chart-container {
  margin-top: 20px;
}
</style>