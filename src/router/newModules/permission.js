/** When your routing table is too long, you can split it into small modules**/

import ctriplikely from '@/layout/ctriplikely'

const permissionRouter = {
  path: '/permission',
  component: ctriplikely,
  name: 'PermissionManagement',
  title: '权限管理',
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
      path: '/permission/user-group',
      component: () => import('@/views/permission/user-group'),
      name: 'UserGroup',
      meta: {
        title: '用户组管理'
      }
    },
    {
      path: '/permission/permission',
      component: () => import('@/views/permission/permission'),
      name: 'MenusPermission',
      meta: {
        title: '菜单管理'
      }
    }
  ]
}

export default permissionRouter
