import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const curRole = store.getters && store.getters.curRole

    if (value && value instanceof Array && value.length > 0 && curRole) {
      let hasPermission = false
      for (var id of value) {
        if (id === curRole) {
          hasPermission = true
          break
        }
      }
      if (!hasPermission) {
        el.remove()
      }
    } else {
      throw new Error(`need permissions! Like v-visiable="[0,1]"`)
    }
  }
}
