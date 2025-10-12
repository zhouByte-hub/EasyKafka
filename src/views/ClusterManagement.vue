<template>
  <div class="cluster-management">
    <div class="page-header">
      <h1>集群管理</h1>
      <el-button type="primary" @click="showAddClusterDialog">
        <el-icon><Plus /></el-icon>
        添加集群
      </el-button>
    </div>
    
    <!-- 集群列表 -->
    <div class="cluster-list">
      <el-table :data="clusters" style="width: 100%">
        <el-table-column prop="name" label="集群名称" width="200" />
        <el-table-column prop="bootstrapServers" label="Bootstrap Servers" />
        <el-table-column prop="saslMechanism" label="SASL 机制" width="120" align="center">
          <template #default="scope">
            {{ scope.row.saslMechanism || '无' }}
          </template>
        </el-table-column>
        <el-table-column prop="sslEnabled" label="SSL 启用" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.sslEnabled ? 'success' : 'info'">
              {{ scope.row.sslEnabled ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
              {{ scope.row.isActive ? '已连接' : '未连接' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="testConnection(scope.row)"
              :loading="testingConnectionId === scope.row.id"
            >
              测试连接
            </el-button>
            <el-button
              size="small"
              @click="editCluster(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteCluster(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 添加/编辑集群对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑集群' : '添加集群'"
      width="600px"
    >
      <el-form
        ref="clusterFormRef"
        :model="clusterForm"
        :rules="clusterRules"
        label-width="150px"
      >
        <el-form-item label="集群名称" prop="name">
          <el-input v-model="clusterForm.name" placeholder="请输入集群名称" />
        </el-form-item>
        
        <el-form-item label="Bootstrap Servers" prop="bootstrapServers">
          <el-input
            v-model="clusterForm.bootstrapServers"
            placeholder="例如: localhost:9092,localhost:9093"
          />
        </el-form-item>
        
        <el-form-item label="SASL 机制">
          <el-select v-model="clusterForm.saslMechanism" placeholder="请选择SASL机制" clearable>
            <el-option label="PLAIN" value="PLAIN" />
            <el-option label="SCRAM-SHA-256" value="SCRAM-SHA-256" />
            <el-option label="SCRAM-SHA-512" value="SCRAM-SHA-512" />
          </el-select>
        </el-form-item>
        
        <el-form-item v-if="clusterForm.saslMechanism" label="SASL 用户名">
          <el-input v-model="clusterForm.saslUsername" placeholder="请输入SASL用户名" />
        </el-form-item>
        
        <el-form-item v-if="clusterForm.saslMechanism" label="SASL 密码">
          <el-input
            v-model="clusterForm.saslPassword"
            type="password"
            placeholder="请输入SASL密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="SSL 启用">
          <el-switch v-model="clusterForm.sslEnabled" />
        </el-form-item>
        
        <el-form-item label="超时时间(ms)" prop="timeout">
          <el-input-number
            v-model="clusterForm.timeout"
            :min="1000"
            :max="60000"
            :step="1000"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitClusterForm" :loading="submitting">
            {{ isEdit ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { ClusterConfig } from '../stores/cluster'
import { invoke } from '@tauri-apps/api/core';
import type { CommonResult } from '../stores/settings'

const clusters = ref<ClusterConfig[]>([])

const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const testingConnectionId = ref<string | null>(null)
const clusterFormRef = ref<FormInstance>()

// 集群表单数据
const clusterForm = reactive({
  id: '',
  name: '',
  bootstrapServers: '',
  saslMechanism: '',
  saslUsername: '',
  saslPassword: '',
  sslEnabled: false,
  timeout: 5000,
  isActive: false
})

// 表单验证规则
const clusterRules: FormRules = {
  name: [
    { required: true, message: '请输入集群名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  bootstrapServers: [
    { required: true, message: '请输入 Bootstrap Servers', trigger: 'blur' }
  ],
  timeout: [
    { required: true, message: '请输入超时时间', trigger: 'blur' },
    { type: 'number', min: 1000, max: 60000, message: '超时时间在 1000 到 60000 毫秒之间', trigger: 'blur' }
  ]
}

// 显示添加集群对话框
const showAddClusterDialog = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const clusterList = () => {
  invoke<ClusterConfig[]>('cluster_list').then(result => {
    clusters.value = result
  })
}

// 编辑集群
const editCluster = (cluster: ClusterConfig) => {
  isEdit.value = true
  Object.assign(clusterForm, cluster)
  dialogVisible.value = true
}

// 删除集群
const deleteCluster = (cluster: ClusterConfig) => {
  ElMessageBox.confirm(
    `确定要删除集群 "${cluster.name}" 吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    invoke<CommonResult>('delete_cluster', {token: cluster.id}).then(result => {
      if(result.code === 200){
        ElMessage.success(result.msg)
        clusterList()
      }else{
        ElMessage.error(result.msg)
      }
    })
  })
}

// 测试连接
const testConnection = async (cluster: ClusterConfig) => {
  testingConnectionId.value = cluster.id
  try {
    const result = await invoke<CommonResult>('check_connect', {token: cluster.id})
    if(result.code === 200){
      ElMessage.success(result.msg)
    }else{
      ElMessage.error(result.msg)
    }
  } catch (error) {
    ElMessage.error('连接测试失败')
  } finally {
    testingConnectionId.value = null
  }
}

// 提交集群表单
const submitClusterForm = async () => {
  if (!clusterFormRef.value) return
  
  await clusterFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        invoke<CommonResult>('cluster_create_or_update', {model: clusterForm}).then(result => {
           if(result.code === 200) {
             if(isEdit.value){
               ElMessage.success('集群更新成功')
             }else{
               ElMessage.success('集群添加成功')
             }
             clusterList()
           } else {
             ElMessage.error(result.msg)
           }
        })        
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  if (clusterFormRef.value) {
    clusterFormRef.value.resetFields()
  }
  Object.assign(clusterForm, {
    id: '',
    name: '',
    bootstrapServers: '',
    saslMechanism: '',
    saslUsername: '',
    saslPassword: '',
    sslEnabled: false,
    timeout: 5000,
    isActive: false
  })
}

// 在组件挂载时调用clusterList方法加载数据
onMounted(() => {
  clusterList()
})

</script>

<style scoped>
.cluster-management {
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

.cluster-list {
  background-color: var(--el-bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>