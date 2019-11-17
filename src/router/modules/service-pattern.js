/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const spRouter = {
  path: '/sp',
  component: Layout,
  name: 'spManagement',
  alwaysShow: true,
  meta: {
    title: '服务模式操作',
    icon: 'lock'
  },
  children: [
    {
      path: '/service-pattern/rpsp',
      component: () => import('@/views/service-pattern/rpsp'),
      name: 'rpsp',
      meta: {
        title: '偶对表维护', noCache: true
      }
    },
    {
      path: '/service-pattern/TableMain',
      component: () => import('@/views/service-pattern/TableMain'),
      name: 'sp',
      meta: {
        title: '服务模式维护', noCache: true
      }
    }
  ]
}

export default spRouter
