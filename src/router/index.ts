import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      title: '仪表盘',
      icon: 'dashboard'
    }
  },
  {
    path: '/cluster-management',
    name: 'ClusterManagement',
    component: () => import('../views/ClusterManagement.vue'),
    meta: {
      title: '集群管理',
      icon: 'cluster'
    }
  },
  {
    path: '/topic-management',
    name: 'TopicManagement',
    component: () => import('../views/TopicManagement.vue'),
    meta: {
      title: '主题管理',
      icon: 'topic'
    }
  },
  {
    path: '/producer',
    name: 'Producer',
    component: () => import('../views/Producer.vue'),
    meta: {
      title: '生产者',
      icon: 'producer'
    }
  },
  {
    path: '/consumer',
    name: 'Consumer',
    component: () => import('../views/Consumer.vue'),
    meta: {
      title: '消费者',
      icon: 'consumer'
    }
  },
  {
    path: '/consumer-group-management',
    name: 'ConsumerGroupManagement',
    component: () => import('../views/ConsumerGroupManagement.vue'),
    meta: {
      title: '消费者组管理',
      icon: 'group'
    }
  },
  {
    path: '/logs',
    name: 'Logs',
    component: () => import('../views/Logs.vue'),
    meta: {
      title: '日志',
      icon: 'log'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: '设置',
      icon: 'settings'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于',
      icon: 'info'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - EasyKafka` : 'EasyKafka'
  next()
})

export default router