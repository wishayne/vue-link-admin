import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'home', affix: true }
      }
    ]
  },
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
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/video',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Video',
    meta: {
      title: '视频+',
      icon: 'video'
    },
    children: [
      {
        path: '/video/tiktok',
        component: () => import('@/views/video/tiktok'),
        name: 'TikTok',
        meta: { title: '抖音视频', noCache: true }
      }
    ]
  },
  {
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
      },
      {
        path: '/permission/dept',
        component: () => import('@/views/permission/department'),
        name: 'Department',
        meta: {
          title: '部门管理'
        }
      },
      {
        path: '/permission/dict',
        component: () => import('@/views/permission/dict'),
        name: 'Blog',
        meta: { title: '数据字典', noCache: true }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: 'Monitor',
    meta: {
      title: '系统监控',
      icon: 'monitor'
    },
    children: [
      {
        path: '/monitor/blog',
        component: () => import('@/views/monitor/blog'),
        name: 'Blog',
        meta: { title: '业务日志', noCache: true }
      },
      {
        path: '/monitor/error-log',
        component: () => import('@/views/monitor/error-log'),
        name: 'ErrorLog',
        meta: { title: '错误日志', noCache: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'bug'
    },
    children: [
      {
        path: '/system/notice',
        component: () => import('@/views/error-page/404'),
        name: 'ErrorLog',
        meta: { title: '通知公告', noCache: true }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [
      {
        path: '/error/401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401' }
      },
      {
        path: '/error/404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404' }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: '/documentation',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: '文档', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: '/icon',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: '图标', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: 'https://github.com/252956/vue-link-admin',
    meta: { title: '外链', icon: 'link' }
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
