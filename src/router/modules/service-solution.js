/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import Vue from 'vue'
import Axios from 'axios'
// Axios.defaults.baseURL = `http://192.168.42.159:30534/`
Axios.defaults.baseURL = `http://10.147.18.103:8080/`
Vue.prototype.$http = Axios
const serviceSolutionRouter = {
  path: '/service-solution',
  component: Layout,
  name: 'service-solution',
  meta: {
    title: '服务方案管理',
    icon: 'lock'
  },
  children: [
    {
      path: '/service-solution/list-solution',
      component: () => import('@/views/service-solution/list-solution'),
      name: 'list-solution',
      meta: {
        title: '查询服务方案', noCache: true
      }
    },
    {
      path: '/service-solution/list-by-user',
      component: () => import('@/views/service-solution/list-by-user'),
      name: 'list-by-user',
      meta: {
        title: '进行中方案', noCache: true
      }
    },
    {
      path: '/service-solution/list-by-creator',
      component: () => import('@/views/service-solution/list-by-creator'),
      name: 'list-by-creator',
      meta: {
        title: '已发起的方案', noCache: true
      }
    }
  ]
}

export default serviceSolutionRouter
