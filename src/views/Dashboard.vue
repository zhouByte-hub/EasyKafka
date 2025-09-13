<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>监控仪表盘</h1>
      <div class="header-actions">
        <el-select v-model="timeRange" placeholder="时间范围" style="width: 150px">
          <el-option label="最近5分钟" value="5m" />
          <el-option label="最近15分钟" value="15m" />
          <el-option label="最近1小时" value="1h" />
          <el-option label="最近6小时" value="6h" />
          <el-option label="最近24小时" value="24h" />
        </el-select>
        <el-button type="primary" @click="refreshDashboard">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>
    
    <!-- 集群概览卡片 -->
    <div class="overview-cards">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="card in overviewCards" :key="card.title">
          <el-card class="overview-card" shadow="hover">
            <div class="card-content">
              <div class="card-icon" :style="{ backgroundColor: card.color }">
                <el-icon :size="24"><component :is="card.icon" /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">{{ card.title }}</div>
                <div class="card-value">{{ card.value }}</div>
                <div class="card-trend" :class="card.trend">
                  <el-icon><component :is="card.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                  {{ card.trendValue }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-container">
      <el-row :gutter="20">
        <!-- 消息速率图表 -->
        <el-col :xs="24" :lg="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>消息速率</span>
                <el-radio-group v-model="messageRateChartType" size="small">
                  <el-radio-button label="produce">生产</el-radio-button>
                  <el-radio-button label="consume">消费</el-radio-button>
                  <el-radio-button label="both">全部</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div ref="messageRateChartRef" class="chart"></div>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>消费者组Lag</span>
              </div>
            </template>
            <div ref="consumerGroupLagChartRef" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
  
      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 磁盘使用率图表 -->
        <el-col :xs="24" :lg="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>磁盘使用率</span>
              </div>
            </template>
            <div ref="diskUsageChartRef" class="chart"></div>
          </el-card>
        </el-col>
        
        <!-- 网络I/O图表 -->
        <el-col :xs="24" :lg="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>网络I/O</span>
              </div>
            </template>
            <div ref="networkIOChartRef" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, ArrowUp, ArrowDown, Monitor, DataLine, Connection, Document, Histogram, PieChart, TrendCharts } from '@element-plus/icons-vue'

// 导入ECharts
import * as echarts from 'echarts'

// 状态变量
const timeRange = ref('1h')
const messageRateChartType = ref('both')
const topicDistributionMetric = ref('messages')

// 图表引用
const messageRateChartRef = ref<HTMLDivElement | null>(null)
const clusterStatusChartRef = ref<HTMLDivElement | null>(null)
const topicDistributionChartRef = ref<HTMLDivElement | null>(null)
const consumerGroupLagChartRef = ref<HTMLDivElement | null>(null)
const diskUsageChartRef = ref<HTMLDivElement | null>(null)
const networkIOChartRef = ref<HTMLDivElement | null>(null)

// 图表实例
let messageRateChart: echarts.ECharts | null = null
let clusterStatusChart: echarts.ECharts | null = null
let topicDistributionChart: echarts.ECharts | null = null
let consumerGroupLagChart: echarts.ECharts | null = null
let diskUsageChart: echarts.ECharts | null = null
let networkIOChart: echarts.ECharts | null = null

// 概览卡片数据
const overviewCards = reactive([
  {
    title: 'Broker数量',
    value: '3/3',
    icon: 'Connection',
    color: '#409EFF',
    trend: 'up',
    trendValue: '0%'
  },
  {
    title: 'Topic总数',
    value: '24',
    icon: 'Document',
    color: '#67C23A',
    trend: 'up',
    trendValue: '4.2%'
  },
  {
    title: '分区总数',
    value: '96',
    icon: 'Histogram',
    color: '#E6A23C',
    trend: 'up',
    trendValue: '2.1%'
  },
  {
    title: '总Lag',
    value: '3.2K',
    icon: 'TrendCharts',
    color: '#F56C6C',
    trend: 'down',
    trendValue: '5.8%'
  }
])

// 刷新仪表盘
const refreshDashboard = () => {
  fetchDashboardData()
}

// 获取仪表盘数据
const fetchDashboardData = async () => {
  try {
    // 这里应该调用API获取仪表盘数据
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新图表
    updateMessageRateChart()
    updateClusterStatusChart()
    updateTopicDistributionChart()
    updateConsumerGroupLagChart()
    updateDiskUsageChart()
    updateNetworkIOChart()
    
    ElMessage.success('仪表盘数据已更新')
  } catch (error) {
    ElMessage.error('获取仪表盘数据失败')
  }
}

// 初始化图表
const initCharts = () => {
  // 初始化消息速率图表
  if (messageRateChartRef.value) {
    messageRateChart = echarts.init(messageRateChartRef.value)
    updateMessageRateChart()
  }
  
  // 初始化集群状态图表
  if (clusterStatusChartRef.value) {
    clusterStatusChart = echarts.init(clusterStatusChartRef.value)
    updateClusterStatusChart()
  }
  
  // 初始化Topic分布图表
  if (topicDistributionChartRef.value) {
    topicDistributionChart = echarts.init(topicDistributionChartRef.value)
    updateTopicDistributionChart()
  }
  
  // 初始化消费者组Lag图表
  if (consumerGroupLagChartRef.value) {
    consumerGroupLagChart = echarts.init(consumerGroupLagChartRef.value)
    updateConsumerGroupLagChart()
  }
  
  // 初始化磁盘使用率图表
  if (diskUsageChartRef.value) {
    diskUsageChart = echarts.init(diskUsageChartRef.value)
    updateDiskUsageChart()
  }
  
  // 初始化网络I/O图表
  if (networkIOChartRef.value) {
    networkIOChart = echarts.init(networkIOChartRef.value)
    updateNetworkIOChart()
  }
}

// 更新消息速率图表
const updateMessageRateChart = () => {
  if (!messageRateChart) return
  
  // 生成模拟数据
  const now = new Date()
  const categories = []
  const produceData = []
  const consumeData = []
  
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000)
    categories.push(`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`)
    produceData.push(Math.floor(Math.random() * 1000) + 500)
    consumeData.push(Math.floor(Math.random() * 800) + 400)
  }
  
  const series = []
  
  if (messageRateChartType.value === 'produce' || messageRateChartType.value === 'both') {
    series.push({
      name: '生产速率',
      type: 'line',
      smooth: true,
      data: produceData,
      itemStyle: {
        color: '#409EFF'
      }
    })
  }
  
  if (messageRateChartType.value === 'consume' || messageRateChartType.value === 'both') {
    series.push({
      name: '消费速率',
      type: 'line',
      smooth: true,
      data: consumeData,
      itemStyle: {
        color: '#67C23A'
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: messageRateChartType.value === 'both' ? ['生产速率', '消费速率'] : 
             messageRateChartType.value === 'produce' ? ['生产速率'] : ['消费速率']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categories
    },
    yAxis: {
      type: 'value',
      name: '消息数'
    },
    series
  }
  
  messageRateChart.setOption(option)
}

// 更新集群状态图表
const updateClusterStatusChart = () => {
  if (!clusterStatusChart) return
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '集群状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 3, name: '在线Broker' },
          { value: 0, name: '离线Broker' },
          { value: 24, name: '活跃Topic' },
          { value: 5, name: '不活跃Topic' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  clusterStatusChart.setOption(option)
}

// 更新Topic分布图表
const updateTopicDistributionChart = () => {
  if (!topicDistributionChart) return
  
  // 生成模拟数据
  const topics = []
  const data = []
  
  for (let i = 1; i <= 10; i++) {
    topics.push(`Topic-${i}`)
    
    if (topicDistributionMetric.value === 'messages') {
      data.push(Math.floor(Math.random() * 100000) + 10000)
    } else if (topicDistributionMetric.value === 'partitions') {
      data.push(Math.floor(Math.random() * 10) + 1)
    } else {
      data.push(Math.floor(Math.random() * 1000))
    }
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: topicDistributionMetric.value === 'messages' ? '消息数' : 
            topicDistributionMetric.value === 'partitions' ? '分区数' : 'Lag'
    },
    yAxis: {
      type: 'category',
      data: topics
    },
    series: [
      {
        name: topicDistributionMetric.value === 'messages' ? '消息数' : 
              topicDistributionMetric.value === 'partitions' ? '分区数' : 'Lag',
        type: 'bar',
        data
      }
    ]
  }
  
  topicDistributionChart.setOption(option)
}

// 更新消费者组Lag图表
const updateConsumerGroupLagChart = () => {
  if (!consumerGroupLagChart) return
  
  // 生成模拟数据
  const now = new Date()
  const categories = []
  const group1Data = []
  const group2Data = []
  const group3Data = []
  
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000)
    categories.push(`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`)
    group1Data.push(Math.floor(Math.random() * 1000) + 500)
    group2Data.push(Math.floor(Math.random() * 800) + 300)
    group3Data.push(Math.floor(Math.random() * 600) + 200)
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Group-1', 'Group-2', 'Group-3']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categories
    },
    yAxis: {
      type: 'value',
      name: 'Lag'
    },
    series: [
      {
        name: 'Group-1',
        type: 'line',
        smooth: true,
        data: group1Data,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: 'Group-2',
        type: 'line',
        smooth: true,
        data: group2Data,
        itemStyle: {
          color: '#67C23A'
        }
      },
      {
        name: 'Group-3',
        type: 'line',
        smooth: true,
        data: group3Data,
        itemStyle: {
          color: '#E6A23C'
        }
      }
    ]
  }
  
  consumerGroupLagChart.setOption(option)
}

// 更新磁盘使用率图表
const updateDiskUsageChart = () => {
  if (!diskUsageChart) return
  
  // 生成模拟数据
  const brokers = ['Broker-1', 'Broker-2', 'Broker-3']
  const usedData = []
  const totalData = []
  
  for (let i = 0; i < brokers.length; i++) {
    const used = Math.floor(Math.random() * 800) + 200
    const total = used + Math.floor(Math.random() * 200) + 100
    usedData.push(used)
    totalData.push(total)
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['已使用', '总容量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: brokers
    },
    yAxis: {
      type: 'value',
      name: 'MB'
    },
    series: [
      {
        name: '已使用',
        type: 'bar',
        stack: '总量',
        data: usedData,
        itemStyle: {
          color: '#F56C6C'
        }
      },
      {
        name: '总容量',
        type: 'bar',
        stack: '总量',
        data: totalData.map((total, i) => total - usedData[i]),
        itemStyle: {
          color: '#909399'
        }
      }
    ]
  }
  
  diskUsageChart.setOption(option)
}

// 更新网络I/O图表
const updateNetworkIOChart = () => {
  if (!networkIOChart) return
  
  // 生成模拟数据
  const now = new Date()
  const categories = []
  const inData = []
  const outData = []
  
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000)
    categories.push(`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`)
    inData.push(Math.floor(Math.random() * 100) + 50)
    outData.push(Math.floor(Math.random() * 80) + 40)
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['输入', '输出']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categories
    },
    yAxis: {
      type: 'value',
      name: 'MB/s'
    },
    series: [
      {
        name: '输入',
        type: 'line',
        smooth: true,
        data: inData,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '输出',
        type: 'line',
        smooth: true,
        data: outData,
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  
  networkIOChart.setOption(option)
}

// 窗口大小改变时重绘图表
const handleResize = () => {
  messageRateChart?.resize()
  clusterStatusChart?.resize()
  topicDistributionChart?.resize()
  consumerGroupLagChart?.resize()
  diskUsageChart?.resize()
  networkIOChart?.resize()
}

onMounted(async () => {
  await nextTick()
  initCharts()
  fetchDashboardData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例
  messageRateChart?.dispose()
  clusterStatusChart?.dispose()
  topicDistributionChart?.dispose()
  consumerGroupLagChart?.dispose()
  diskUsageChart?.dispose()
  networkIOChart?.dispose()
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
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

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  height: 120px;
}

.card-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  color: white;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 5px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 5px;
}

.card-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.card-trend.up {
  color: var(--el-color-success);
}

.card-trend.down {
  color: var(--el-color-danger);
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.chart {
  min-height: 280px;
  max-height: 280px;
}
</style>