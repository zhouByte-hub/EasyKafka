import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import naive from 'naive-ui'
import { useThemeStore } from './stores/theme'

// 导入全局样式
import './assets/styles/global.scss'

// 导入路由
import router from './router'

// 导入应用根组件
import App from './App.vue'

// 创建应用实例
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用 Pinia
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 使用 Element Plus
app.use(ElementPlus)

// 使用 naive UI
app.use(naive)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

// 挂载应用
app.mount('#app')