import md5 from 'js-md5'
const handleTime = function(t) {
  return t.slice(0, 10) + ' ' + t.slice(11, 19)
}
const rpRequireMap = function(result) {
  const map = {}
  const getMap = (goal, rp) => {
    map[goal.goal.goalId] = rp
    for (let i = 0; i < goal.children.length; i++) {
      getMap(goal.children[i], rp)
    }
  }
  result.success.forEach((item) => {
    const rp = item.rps.info
    const goals = item.goals
    for (let i = 0; i < goals.length; i++) {
      getMap(goals[i], rp)
    }
  })
  return map
}

const ergodicGoals = function(goals, handle) {
  const ergodicGoal = goal => {
    handle(goal)
    ergodicGoals(goal.children, handle)
  }
  for (let i = 0; i < goals.length; i++) {
    ergodicGoal(goals[i])
  }
}
const calcColor = function(s) {
  const sMd5 = md5(s)
  return '#' + sMd5.slice(0, 6)
}

const optimizationOpt = [
  '人工蜂群算法', '遗传算法', '差分进化算法'
]

export { handleTime, rpRequireMap, ergodicGoals, calcColor, optimizationOpt }

