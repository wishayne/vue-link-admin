/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const requireRouter = {
  path: '/require',
  component: Layout,
  name: 'require',
  meta: {
    title: '需求操作',
    icon: 'lock'
  },
  children: [
    {
      path: '/require/add-require',
      component: () => import('@/views/add-require'),
      name: 'add-require',
      meta: {
        title: '需求维护', noCache: true
      }
    }
  ]
}

export default requireRouter
