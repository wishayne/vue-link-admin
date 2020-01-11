/** When your routing table is too long, you can split it into small modules**/

import ctriplikely from '@/layout/ctriplikely'

const spRouter = {
  path: '/sp',
  component: ctriplikely,
  name: 'spManagement',
  title: '服务模式',
  children: [
    {
      path: '/service-pattern/rpsp',
      component: () => import('@/views/service-pattern/rpsp'),
      name: 'rpsp',
      meta: {
        title: '偶对表维护',
        noCache: true
      }
    },
    {
      path: '/service-pattern/list-domain-inner',
      component: () => import('@/views/service-pattern/list-domain-inner'),
      name: 'list-domain-inner',
      meta: {
        title: '领域内服务模式', noCache: true
      }
    },
    {
      path: '/service-pattern/list-provider-inner',
      component: () => import('@/views/service-pattern/list-provider-inner'),
      name: 'list-provider-inner',
      meta: {
        title: '组织内服务模式', noCache: true
      }
    }
  ]
}

export default spRouter
