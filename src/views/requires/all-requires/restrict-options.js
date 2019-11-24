export default {
  maxexpandId: 95,
  treelist: [{
    id: 1,
    name: 'goal',
    restricts: [{
      key: '',
      valueType: '',
      value: ''
    }
    ],
    pid: '',
    isEdit: false,
    children: []
  }]
}
const initParam = {// 新增参数
  id: 0,
  goal: {
    content: 'goal',
    restricts: []
  },
  children: []
}
const requireState = {
  0: '未匹配需求模式',
  1: '未匹配服务模式',
  2: '未生成服务方案',
  3: '已生成服务方案'
}

const getRestrictString = function(r) {
  if (r.valueType === 'region') {
    return ` ${r.key}:${r.minValue}~${r.maxValue}${r.unit}`
  }
  if (r.valueType === 'after') {
    return ` 在${r.value}之后进行`
  }
  if (r.valueType !== '') {
    return ` ${r.key}:${r.value}`
  }
}

export { initParam, requireState, getRestrictString }

