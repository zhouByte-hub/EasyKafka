import { defineStore } from 'pinia'
import { ref } from 'vue'

// 扩展设置接口，包含所有设置类别
export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    theme: 'auto',
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
  const general = ref({
    language: 'zh-CN',
    autoRefreshInterval: 30,
    autoConnectOnStartup: false,
    defaultCluster: ''
  })

  const appearance = ref({
    theme: 'light',
    primaryColor: '#409EFF',
    compactMode: false,
    showTableBorder: true,
    messageDisplayLines: 3
  })

  const cluster = ref({
    connectionTimeout: 5000,
    requestTimeout: 10000,
    heartbeatInterval: 3000,
    metadataRefreshInterval: 30000,
    enableSSL: false,
    enableSASL: false,
    saslMechanism: 'PLAIN'
  })

  const consumer = ref({
    autoCommit: true,
    autoCommitInterval: 5000,
    sessionTimeout: 10000,
    maxPollRecords: 500,
    maxPollInterval: 300000,
    defaultOffset: 'latest'
  })

  const producer = ref({
    acks: '1',
    retries: 0,
    batchSize: 16384,
    lingerMs: 0,
    bufferMemory: 33554432,
    compressionType: 'none'
  })

  const monitoring = ref({
    enableRealTimeMonitoring: true,
    dataRetentionDays: 7,
    chartRefreshInterval: 5,
    defaultTimeRange: '1h',
    enableAlerts: false,
    alertEmail: ''
  })

  const advanced = ref({
    logLevel: 'info',
    maxLogFileSize: 10,
    logRetentionDays: 30,
    enableDebugMode: false,
    enableTelemetry: true,
    checkForUpdates: true
  })

  function updateTheme(theme) {
    settings.value.theme = theme
    appearance.value.theme = theme
    saveSettings()
  }

  function updateLanguage(language) {
    settings.value.language = language
    general.value.language = language
    saveSettings()
  }

  function updateAutoRefreshInterval(interval) {
    settings.value.autoRefreshInterval = interval
    general.value.autoRefreshInterval = interval
    saveSettings()
  }

  function updateMessageDisplayLimit(limit) {
    settings.value.messageDisplayLimit = limit
    saveSettings()
  }

  function updateLogRetentionDays(days) {
    settings.value.logRetentionDays = days
    saveSettings()
  }

  function updateShortcut(action, shortcut) {
    settings.value.shortcuts[action] = shortcut
    saveSettings()
  }

  // 更新各类设置的方法
  function updateGeneral(newSettings) {
    general.value = { ...newSettings }
    settings.value.language = newSettings.language
    settings.value.autoRefreshInterval = newSettings.autoRefreshInterval
    saveSettings()
  }

  function updateAppearance(newSettings) {
    appearance.value = { ...newSettings }
    settings.value.theme = newSettings.theme
    saveSettings()
  }

  function updateCluster(newSettings) {
    cluster.value = { ...newSettings }
    saveSettings()
  }

  function updateConsumer(newSettings) {
    consumer.value = { ...newSettings }
    saveSettings()
  }

  function updateProducer(newSettings) {
    producer.value = { ...newSettings }
    saveSettings()
  }

  function updateMonitoring(newSettings) {
    monitoring.value = { ...newSettings }
    saveSettings()
  }

  function updateAdvanced(newSettings) {
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