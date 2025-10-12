// 主题状态管理

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const theme = ref('light')
  const isDark = ref(false)
  
  // 计算属性
  const currentTheme = computed(() => {
    return theme.value
  })
  
  // 方法
  const setTheme = (newTheme) => {
    theme.value = newTheme
    updateTheme()
  }
  
  const toggleTheme = () => {
    if (theme.value === 'light') {
      theme.value = 'dark'
    } else {
      theme.value = 'light'
    }
    updateTheme()
  }
  
  const updateTheme = () => {
    const html = document.documentElement
    
    if (currentTheme.value === 'dark') {
      html.classList.add('dark')
      isDark.value = true
    } else {
      html.classList.remove('dark')
      isDark.value = false
    }
    
    // 保存到本地存储
    localStorage.setItem('theme', theme.value)
  }
  
  const initTheme = () => {
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    }
    
    // 初始化主题
    updateTheme()
  }
  
  // 监听主题变化
  watch(theme, () => {
    updateTheme()
  })
  
  return {
    theme,
    isDark,
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme,
  }
})