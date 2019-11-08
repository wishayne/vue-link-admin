/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const permissionRouter = {
  path: '/permission',
  component: Layout,
  name: 'Permission',
  meta: {
    title: '系统权限',
    icon: 'lock'
  },
  children: [
    {
      path: '/permission/user',
      component: () => import('@/views/permission/user'),
      name: 'User',
      meta: {
        title: '用户管理', noCache: true
      }
    },
    {
      path: '/permission/role',
      component: () => import('@/views/permission/role'),
      name: 'Role',
      meta: {
        title: '角色权限'
      }
    },
    {
      path: '/permission/permission',
      component: () => import('@/views/permission/permission'),
      name: 'Permission',
      meta: {
        title: '权限管理'
      }
    }
  ]
}

export default permissionRouter
