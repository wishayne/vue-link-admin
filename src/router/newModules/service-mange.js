import ctriplikely from '@/layout/ctriplikely'

const serviceManageRouter = {
  path: '/service-mange',
  component: ctriplikely,
  name: 'service-mange',
  title: '已有服务',
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
        title: '服务领域管理', noCache: true
      }
    },
    {
      path: '/service-mange/service-provider/',
      component: () => import('@/views/service-mange/service-provider/'),
      name: 'service-provider',
      meta: {
        title: '服务提供商管理', noCache: true
      }
    },
    {
      path: '/service-mange/add-service/add_feature',
      component: () => import('@/views/service-mange/add-service/add_feature'),
      name: 'add-feature',
      meta: {
        title: '服务类型新增', noCache: true
      }
    },
    {
      path: '/service-mange/list-service/list_feature',
      component: () => import('@/views/service-mange/list-service/list_feature'),
      name: 'list-feature',
      meta: {
        title: '服务类型检索', noCache: true
      }
    }
  ]
}

export default serviceManageRouter
