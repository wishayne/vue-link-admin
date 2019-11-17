/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const requireRouter = {
  path: '/requires',
  component: Layout,
  name: 'require',
  meta: {
    title: '需求操作',
    icon: 'lock'
  },
  children: [
    {
      path: '/requires/all-requires/index',
      component: () => import('@/views/requires/all-requires/index'),
      name: 'all-requires',
      meta: {
        title: '需求维护', noCache: true
      }
    },
    {
      path: '/requires/all-rps/index',
      component: () => import('@/views/requires/all-rps/index'),
      name: 'all-rps',
      meta: {
        title: '需求模式维护', noCache: true
      }
    },
    {
      path: '/requires/add-require/index',
      component: () => import('@/views/requires/add-require/index'),
      name: 'add-require',
      meta: {
        title: '新增需求', noCache: true
      },
      hidden: true
    },
    {
      path: '/requires/add-rp/index',
      component: () => import('@/views/requires/add-rp/index'),
      name: 'add-rp',
      meta: {
        title: '新增需求模式', noCache: true
      },
      hidden: true
    }
  ]
}

export default requireRouter
