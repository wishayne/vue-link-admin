import visiable from './visiable'

const install = function(Vue) {
  Vue.directive('visiable', visiable)
}

if (window.Vue) {
  window['visiable'] = visiable
  Vue.use(install); // eslint-disable-line
}

visiable.install = install
export default visiable
