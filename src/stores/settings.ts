import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  autoRefreshInterval: number
  messageDisplayLimit: number
  logRetentionDays: number
  shortcuts: Record<string, string>
}

// 扩展设置接口，包含所有设置类别
export interface GeneralSettings {
  language: string
  autoRefreshInterval: number
  autoConnectOnStartup: boolean
  defaultCluster: string
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  primaryColor: string
  compactMode: boolean
  showTableBorder: boolean
  messageDisplayLines: number
}

export interface ClusterSettings {
  connectionTimeout: number
  requestTimeout: number
  heartbeatInterval: number
  metadataRefreshInterval: number
  enableSSL: boolean
  enableSASL: boolean
  saslMechanism: string
}

export interface ConsumerSettings {
  autoCommit: boolean
  autoCommitInterval: number
  sessionTimeout: number
  maxPollRecords: number
  maxPollInterval: number
  defaultOffset: string
}

export interface ProducerSettings {
  acks: string
  retries: number
  batchSize: number
  lingerMs: number
  bufferMemory: number
  compressionType: string
}

export interface MonitoringSettings {
  enableRealTimeMonitoring: boolean
  dataRetentionDays: number
  chartRefreshInterval: number
  defaultTimeRange: string
  enableAlerts: boolean
  alertEmail: string
}

export interface AdvancedSettings {
  logLevel: string
  maxLogFileSize: number
  logRetentionDays: number
  enableDebugMode: boolean
  enableTelemetry: boolean
  checkForUpdates: boolean
}

export interface CommonResult{
  code: number,
  data: any,
  msg: string,
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({
    theme: 'system',
    language: 'zh-CN',
    autoRefreshInterval: 30,
    messageDisplayLimit: 100,
    logRetentionDays: 7,
    shortcuts: {
      'newTopic': 'Ctrl+T',
      'newCluster': 'Ctrl+N',
      'search': 'Ctrl+F',
      'refresh': 'F5'
    }
  })

  // 各类设置
  const general = ref<GeneralSettings>({
    language: 'zh-CN',
    autoRefreshInterval: 30,
    autoConnectOnStartup: false,
    defaultCluster: ''
  })

  const appearance = ref<AppearanceSettings>({
    theme: 'light',
    primaryColor: '#409EFF',
    compactMode: false,
    showTableBorder: true,
    messageDisplayLines: 3
  })

  const cluster = ref<ClusterSettings>({
    connectionTimeout: 5000,
    requestTimeout: 10000,
    heartbeatInterval: 3000,
    metadataRefreshInterval: 30000,
    enableSSL: false,
    enableSASL: false,
    saslMechanism: 'PLAIN'
  })

  const consumer = ref<ConsumerSettings>({
    autoCommit: true,
    autoCommitInterval: 5000,
    sessionTimeout: 10000,
    maxPollRecords: 500,
    maxPollInterval: 300000,
    defaultOffset: 'latest'
  })

  const producer = ref<ProducerSettings>({
    acks: '1',
    retries: 0,
    batchSize: 16384,
    lingerMs: 0,
    bufferMemory: 33554432,
    compressionType: 'none'
  })

  const monitoring = ref<MonitoringSettings>({
    enableRealTimeMonitoring: true,
    dataRetentionDays: 7,
    chartRefreshInterval: 5,
    defaultTimeRange: '1h',
    enableAlerts: false,
    alertEmail: ''
  })

  const advanced = ref<AdvancedSettings>({
    logLevel: 'info',
    maxLogFileSize: 10,
    logRetentionDays: 30,
    enableDebugMode: false,
    enableTelemetry: true,
    checkForUpdates: true
  })

  function updateTheme(theme: 'light' | 'dark' | 'system') {
    settings.value.theme = theme
    appearance.value.theme = theme
    saveSettings()
  }

  function updateLanguage(language: string) {
    settings.value.language = language
    general.value.language = language
    saveSettings()
  }

  function updateAutoRefreshInterval(interval: number) {
    settings.value.autoRefreshInterval = interval
    general.value.autoRefreshInterval = interval
    saveSettings()
  }

  function updateMessageDisplayLimit(limit: number) {
    settings.value.messageDisplayLimit = limit
    saveSettings()
  }

  function updateLogRetentionDays(days: number) {
    settings.value.logRetentionDays = days
    saveSettings()
  }

  function updateShortcut(action: string, shortcut: string) {
    settings.value.shortcuts[action] = shortcut
    saveSettings()
  }

  // 更新各类设置的方法
  function updateGeneral(newSettings: GeneralSettings) {
    general.value = { ...newSettings }
    settings.value.language = newSettings.language
    settings.value.autoRefreshInterval = newSettings.autoRefreshInterval
    saveSettings()
  }

  function updateAppearance(newSettings: AppearanceSettings) {
    appearance.value = { ...newSettings }
    settings.value.theme = newSettings.theme
    saveSettings()
  }

  function updateCluster(newSettings: ClusterSettings) {
    cluster.value = { ...newSettings }
    saveSettings()
  }

  function updateConsumer(newSettings: ConsumerSettings) {
    consumer.value = { ...newSettings }
    saveSettings()
  }

  function updateProducer(newSettings: ProducerSettings) {
    producer.value = { ...newSettings }
    saveSettings()
  }

  function updateMonitoring(newSettings: MonitoringSettings) {
    monitoring.value = { ...newSettings }
    saveSettings()
  }

  function updateAdvanced(newSettings: AdvancedSettings) {
    advanced.value = { ...newSettings }
    saveSettings()
  }

  function saveSettings() {
    localStorage.setItem('app-settings', JSON.stringify(settings.value))
    localStorage.setItem('general-settings', JSON.stringify(general.value))
    localStorage.setItem('appearance-settings', JSON.stringify(appearance.value))
    localStorage.setItem('cluster-settings', JSON.stringify(cluster.value))
    localStorage.setItem('consumer-settings', JSON.stringify(consumer.value))
    localStorage.setItem('producer-settings', JSON.stringify(producer.value))
    localStorage.setItem('monitoring-settings', JSON.stringify(monitoring.value))
    localStorage.setItem('advanced-settings', JSON.stringify(advanced.value))
  }

  function loadSettings() {
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      try {
        settings.value = JSON.parse(savedSettings)
      } catch (e) {
        console.error('Failed to parse saved settings:', e)
      }
    }

    const savedGeneral = localStorage.getItem('general-settings')
    if (savedGeneral) {
      try {
        general.value = JSON.parse(savedGeneral)
      } catch (e) {
        console.error('Failed to parse saved general settings:', e)
      }
    }

    const savedAppearance = localStorage.getItem('appearance-settings')
    if (savedAppearance) {
      try {
        appearance.value = JSON.parse(savedAppearance)
      } catch (e) {
        console.error('Failed to parse saved appearance settings:', e)
      }
    }

    const savedCluster = localStorage.getItem('cluster-settings')
    if (savedCluster) {
      try {
        cluster.value = JSON.parse(savedCluster)
      } catch (e) {
        console.error('Failed to parse saved cluster settings:', e)
      }
    }

    const savedConsumer = localStorage.getItem('consumer-settings')
    if (savedConsumer) {
      try {
        consumer.value = JSON.parse(savedConsumer)
      } catch (e) {
        console.error('Failed to parse saved consumer settings:', e)
      }
    }

    const savedProducer = localStorage.getItem('producer-settings')
    if (savedProducer) {
      try {
        producer.value = JSON.parse(savedProducer)
      } catch (e) {
        console.error('Failed to parse saved producer settings:', e)
      }
    }

    const savedMonitoring = localStorage.getItem('monitoring-settings')
    if (savedMonitoring) {
      try {
        monitoring.value = JSON.parse(savedMonitoring)
      } catch (e) {
        console.error('Failed to parse saved monitoring settings:', e)
      }
    }

    const savedAdvanced = localStorage.getItem('advanced-settings')
    if (savedAdvanced) {
      try {
        advanced.value = JSON.parse(savedAdvanced)
      } catch (e) {
        console.error('Failed to parse saved advanced settings:', e)
      }
    }
  }

  // 初始化时加载设置
  loadSettings()

  return {
    settings,
    general,
    appearance,
    cluster,
    consumer,
    producer,
    monitoring,
    advanced,
    updateTheme,
    updateLanguage,
    updateAutoRefreshInterval,
    updateMessageDisplayLimit,
    updateLogRetentionDays,
    updateShortcut,
    updateGeneral,
    updateAppearance,
    updateCluster,
    updateConsumer,
    updateProducer,
    updateMonitoring,
    updateAdvanced,
    loadSettings
  }
})