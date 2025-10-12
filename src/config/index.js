// 配置索引文件
import dev from './dev'
import prod from './prod'

// 获取当前环境
const env = import.meta.env.MODE || 'development'

// 根据环境选择配置
const config = env === 'production' ? prod : dev

// 导出配置
export default config

// 导出环境类型常量
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
}

// 导出配置类型常量
export const CONFIG_TYPES = {
  // 主题配置类型
  THEME: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  // 语言配置类型
  LANGUAGE: {
    ZH_CN: 'zh-CN',
    EN_US: 'en-US'
  }
}