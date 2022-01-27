const state = {
  count: 0,
  commonText: 'learn',
  asyncText: '',
  toDos: [
    { id: 1, text: '...', done: true },
    { id: 2, text: '...', done: false }
  ],
  wm_inner_route_query: {}
}

const getters = {
  doneTools: (state, getters) => {
    return state.toDos.filter(todo => todo.done)
  },
  // 通过让 getter 返回一个函数，来实现给 getter 传参
  // this.$store.getters.getTodoById(2)
  getTodoById: (state, getters) => (id) => {
    return state.toDos.find(todo => todo.id === id)
  },
  getInnerRouteQuery(state) {
    return state.wm_inner_route_query
  }
}

const mutations = {
  increment: (state, val) => {
    state.count = val
  },
  asyncMutation: (state, val) => {
    state.asyncText = val
  },
  setInnerRouteQuery: (state, val) => {
    // Object.assign(state.wm_inner_route_query , val)
    state.wm_inner_route_query = val
  }
}

// Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
// context.state 和 context.getters 来获取 state 和 getters
const actions = {
  actionA(context, val) {
    setTimeout(() => {
      context.commit('increment', val)
    }, 1000)
  },

  // store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise
  // store.dispatch 仍旧返回 Promise
  // 组件中通过store.dispatch('actionB').then()使用
  actionB({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('asyncMutation')
        resolve()
      }, 1000)
    })
  },
  actionC({ dispatch, commit }) {
    return dispatch('actionB').then(() => {
      commit('someOtherMutation')
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
