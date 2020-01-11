import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import ctriplikely from '@/layout/ctriplikely'
import requiresRouter from './newModules/require'
import serviceManageRouter from './newModules/service-mange'
import servicePatternRouter from './newModules/service-pattern'
import solutionRouter from './newModules/service-solution'
import Home from '@/views/home/home'
import permissionRouter from './newModules/permission';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * 所有角色都拥有的路由
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: ctriplikely,
    redirect: '/home',
    name: 'home1',
    hidden: true,
    title: '首页',
    children: [
      {
        path: '/home',
        name: 'home2',
        component: Home,
        meta: {
          title: '首页', noCache: true
        }
      }
    ]
  },

  /** ***********************/
  {
    path: '/service-mange',
    component: ctriplikely,
    name: 'service-mange',
    title: '已有服务',
    children: [
      {
        path: '/service-mange/list-service/',
        component: () => import('@/views/service-mange/list-service/'),
        name: 'list-service',
        meta: {
          title: '服务检索', noCache: true
        }
      }
    ]
  },
  {
    path: '/sp',
    component: ctriplikely,
    name: 'spManagement',
    title: '服务模式',
    children: [
      {
        path: '/service-pattern/TableMain',
        component: () => import('@/views/service-pattern/TableMain'),
        name: 'sp',
        meta: {
          title: '服务模式维护',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/service-solution',
    component: ctriplikely,
    name: 'service-solution',
    title: '服务方案管理',
    children: [
      {
        path: '/service-solution/list-solution',
        component: () => import('@/views/service-solution/list-solution'),
        name: 'list-solution',
        meta: {
          title: '查询服务方案', noCache: true
        }
      }
    ]
  },
  {
    path: '/requires',
    component: ctriplikely,
    name: 'require',
    title: '需求模式',
    children: [
      {
        path: '/requires/all-rps/index',
        component: () => import('@/views/requires/all-rps/index'),
        name: 'all-rps',
        meta: {
          title: '需求模式维护', noCache: true
        }
      }
    ]
  },
  /** ***********************/

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: {title: '个人中心', icon: 'user', noCache: true}
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  requiresRouter,
  serviceManageRouter,
  servicePatternRouter,
  solutionRouter,
  permissionRouter,

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
