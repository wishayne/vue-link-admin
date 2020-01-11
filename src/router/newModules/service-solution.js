/** When your routing table is too long, you can split it into small modules**/

import ctriplikely from '@/layout/ctriplikely'

const serviceSolutionRouter = {
  path: '/service-solution',
  component: ctriplikely,
  name: 'service-solution',
  title: '服务方案管理',
  children: [
    {
      path: '/service-solution/list-by-user',
      component: () => import('@/views/service-solution/list-by-user'),
      name: 'list-by-user',
      meta: {
        title: '服务任务清单', noCache: true
      }
    },
    {
      path: '/service-solution/list-by-creator',
      component: () => import('@/views/service-solution/list-by-creator'),
      name: 'list-by-creator',
      meta: {
        title: '执行中的方案', noCache: true
      }
    }
  ]
}

export default serviceSolutionRouter
