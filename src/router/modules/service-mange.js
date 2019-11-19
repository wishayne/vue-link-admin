/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import Vue from 'vue'
import Axios from 'axios'
// Axios.defaults.baseURL = `http://192.168.42.159:30534/`
Axios.defaults.baseURL = `http://10.147.18.103:8080/`
Vue.prototype.$http = Axios

const serviceManageRouter = {
  path: '/service-mange',
  component: Layout,
  name: 'service-mange',
  meta: {
    title: '服务管理',
    icon: 'lock'
  },
  children: [
    {
      path: '/service-mange/add-service/',
      component: () => import('@/views/service-mange/add-service/'),
      name: 'add-service',
      meta: {
        title: '服务注册', noCache: true
      }
    },
    {
      path: '/service-mange/list-service/',
      component: () => import('@/views/service-mange/list-service/'),
      name: 'list-service',
      meta: {
        title: '搜索服务', noCache: true
      }
    },
    {
      path: '/service-mange/list-service/list-api',
      component: () => import('@/views/service-mange/list-service/list-api'),
      name: 'list-api',
      meta: {
        title: '查看接口列表', noCache: true
      },
      hidden: true
    },
    {
      path: '/service-mange/service-category/',
      component: () => import('@/views/service-mange/service-category/'),
      name: 'service-category',
      meta: {
        title: '服务目录管理', noCache: true
      }
    },
    {
      path: '/service-mange/service-provider/',
      component: () => import('@/views/service-mange/service-provider/'),
      name: 'service-provider',
      meta: {
        title: '服务提供商管理', noCache: true
      }
    }
  ]
}

export default serviceManageRouter
