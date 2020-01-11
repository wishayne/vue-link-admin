
import { constantRoutes, asyncRoutes } from '@/router'
import store from '@/store'
import { deepClone } from '@/utils'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
  },
  ORIGINAL_ROUTE: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      var accessedRoutes = deepClone(asyncRoutes)
      accessedRoutes = filterAsyncRoutes(accessedRoutes)
      commit('SET_ROUTES', concatRoutes(accessedRoutes))
      resolve(accessedRoutes)
    })
  },
  originalRoutes({ commit }) {
    commit('ORIGINAL_ROUTE', deepClone(constantRoutes))
  }
}

function concatRoutes(routes){
  var newRoutes = deepClone(constantRoutes)
  for (var tempRoute of newRoutes) {
    switch (tempRoute.name) {
      case 'service-mange' :
        for (const tempRoute2 of routes) {
          if (tempRoute2.name === 'service-mange'){
            tempRoute.children = tempRoute.children.concat(tempRoute2.children)
            break
          }
        }
        break
      case 'spManagement' :
        for (const tempRoute2 of routes) {
          if (tempRoute2.name === 'spManagement'){
            tempRoute.children = tempRoute.children.concat(tempRoute2.children)
            break
          }
        }
        break
      case 'service-solution' :
        for (const tempRoute2 of routes) {
          if (tempRoute2.name === 'service-solution'){
            tempRoute.children = tempRoute.children.concat(tempRoute2.children)
            break
          }
        }
        break
      case 'require' :
        for (const tempRoute2 of routes) {
          if (tempRoute2.name === 'require'){
            tempRoute.children = tempRoute.children.concat(tempRoute2.children)
            break
          }
        }
        break
      default:
    }
  }
  for (const tempRoute2 of routes) {
    if (tempRoute2.name === 'PermissionManagement'){
      newRoutes.push(tempRoute2)
      break
    }
  }
  return newRoutes
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(route) {
  const menus = store.getters.menus
  if (route.path) {
    // eslint-disable-next-line eqeqeq
    if (route.path == '*') {
      return true
    }
    for (var menu of menus) {
      // eslint-disable-next-line eqeqeq
      if (route.path == menu.url) {
        return true
      }
    }
  }
  return false
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (hasPermission(route)) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children)
      }
      res.push(route)
    }
  })

  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
