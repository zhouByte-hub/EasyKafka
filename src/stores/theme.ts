// 主题状态管理

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const theme = ref<'light' | 'dark' | 'auto'>('auto')
  const isDark = ref(false)
  
  // 计算属性
  const currentTheme = computed(() => {
    if (theme.value === 'auto') {
      // 检查系统主题偏好
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme.value
  })
  
  // 方法
  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    theme.value = newTheme
    updateTheme()
  }
  
  const toggleTheme = () => {
    if (theme.value === 'light') {
      theme.value = 'dark'
    } else if (theme.value === 'dark') {
      theme.value = 'auto'
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
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
    if (savedTheme) {
      theme.value = savedTheme
    }
    
    // 监听系统主题变化
    if (theme.value === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme.value === 'auto') {
          updateTheme()
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
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