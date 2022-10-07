import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state() {
    return {
      // 分类信息集合
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  mutations: {
    setList(state, payload) {
      state.list = payload
    },
    // 修改当前一级分类下的open数据为true
    show(state, item) {
      const category = state.list.find((category) => category.id === item.id)
      category.open = true
    },
    hide(state, item) {
      const category = state.list.find((category) => category.id === item.id)
      category.open = false
    }
  },
  actions: {
    //   context:{
    //     state,   等同于store.$state，若在模块中则为局部状态
    //     rootState,   等同于store.$state,只存在模块中
    //     commit,   等同于store.$commit
    //     dispatch,   等同于store.$dispatch
    //     getters   等同于store.$getters
    // }
    // 也可用context作为形参，再调用其中的方法，例如：context.commit('xxx',xxx)
    async getList({ commit }) {
      const { result } = await findAllCategory()
      result.forEach((item) => {
        item.open = false
      })
      commit('setList', result)
    }
  }
}
