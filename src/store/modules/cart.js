import {
  getNewCartGoods,
  mergeLocalCart,
  findCartList,
  insertCart,
  deleteCart,
  updateCart,
  checkAllCart
} from '@/api/cart'

export default {
  namespaced: true,
  state() {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      return state.list.filter((item) => item.stock && item.isEffective)
    },
    // 有效商品件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      return (
        getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) /
        100
      )
    },
    // 无效商品列表
    invalidList(state) {
      return state.list.filter((item) => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList(state, getters) {
      return getters.validList.filter((item) => item.selected)
    },
    // 选中商品件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount(state, getters) {
      return (
        getters.selectedList.reduce(
          (p, c) => p + c.nowPrice * 100 * c.count,
          0
        ) / 100
      )
    },
    // 是否全选
    isCheckAll(state, getters) {
      return (
        getters.selectedList.length !== 0 &&
        getters.selectedList.length === getters.validList.length
      )
    }
  },
  mutations: {
    insertCart(state, goods) {
      const sameIndex = state.list.findIndex(
        (item) => item.skuId === goods.skuId
      )
      if (sameIndex > -1) {
        goods.count = state.list[sameIndex].count + goods.count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(goods)
    },
    // 修改购物车商品
    updateCart(state, goods) {
      const updateGoods = state.list.find((item) => item.skuId === goods.skuId)
      for (const key in goods) {
        if (
          goods[key] !== null &&
          goods[key] !== undefined &&
          goods[key] !== ''
        ) {
          // find()方法获取的是复杂数据是，其实获取的是地址，当修改获取复杂数据的值时，原数组中想对应的复杂数据也会改变！！！，因此list中的商品属性可通过以下这条代码修改！！
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      const index = state.list.findIndex((item) => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车列表
    setCartList(state, list) {
      state.list = list
    }
  },
  actions: {
    insertCart(ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录就调用服务器操作服务器上的购物车
          insertCart(goods)
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          ctx.commit('insertCart', goods)
          resolve()
        }
      })
    },
    // 修改SKU规格
    updateCartSku(ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录TODO
          const oldGoods = ctx.state.list.find(
            (item) => item.skuId === oldSkuId
          )
          deleteCart([oldSkuId])
            .then(() => {
              return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
            })
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          const oldGoods = ctx.state.list.find(
            (item) => item.skuId === oldSkuId
          )
          ctx.commit('deleteCart', oldSkuId)
          const {
            skuId,
            price: nowPrice,
            inventory: stock,
            specsText: attrsText
          } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          ctx.commit('insertCart', newGoods)
        }
      })
    },
    // 删除购物车商品
    deleteCart(ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
          deleteCart([skuId])
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 批量删除选中商品
    batchDeleteCart(ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(
            (item) => item.skuId
          )
          deleteCart(ids)
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutataions函数
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(
            (item) => {
              ctx.commit('deleteCart', item.skuId)
            }
          )
          resolve()
        }
      })
    },
    // 做有效商品的全选&反选
    checkAllCart(ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          const ids = ctx.getters.validList.map((item) => item.skuId)
          checkAllCart({ selected, ids })
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          ctx.getters.validList.forEach((item) => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })

          resolve()
        }
      })
    },
    // 修改购物车商品
    updateCart(ctx, goods) {
      // goods 中：必须有skuId，其他想修改的属性 selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录TODO
          updateCart(goods)
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          ctx.commit('updateCart', goods)

          resolve()
        }
      })
    },
    // 更新购物车
    findCarList(ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录TODO
          findCartList().then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          const PromiseArr = ctx.state.list.map((item) => {
            // 返回接口函数的调用
            return getNewCartGoods(item.skuId)
          })
          Promise.all(PromiseArr)
            .then((dataArr) => {
              dataArr.forEach((data, i) => {
                ctx.commit('updateCart', {
                  skuId: ctx.state.list[i].skuId,
                  ...data.result
                })
              })
              resolve()
            })
            .catch((e) => {
              reject(e)
            })
        }
      })
    },
    // 合并本地购物车
    async mergeLocalCart(ctx) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.getters.validList.map(
        ({ skuId, selected, count }) => {
          return { skuId, selected, count }
        }
      )
      // 调用服务器合并服务器上的购物车
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
      findCartList().then((data) => {
        ctx.commit('setCartList', data.result)
      })
    }
  }
}
