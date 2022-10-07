import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
// https://apipc-xiaotuxian-front.itheima.net 线上展示的接口
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})
// 请求拦截
instance.interceptors.request.use(
  (config) => {
    // 拦截业务逻辑
    // 进行请求配置的修改
    // 如果本地又token就在头部携带
    // 1. 获取用户信息对象
    const { profile } = store.state.user
    if (profile.token) {
      config.headers.Authorization = `Bearer ${profile.token}`
    } else {
      // 没有token时TODO
    }
    return config
  },
  (err) => {
    // 发生错误时停止
    return Promise.reject(err)
  }
)
// 反应拦截
instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      // 1. 清空无效用户信息
      // 2. 跳转到登录页
      // 3. 跳转需要传参（当前路由地址）给登录页码
      store.commit('user/setUser', {})
      // encodeURIComponent 转换uri编码，防止解析地址出问题
      // router.currentRoute.value.fullPath 就是当前路由地址
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)

// 向外传出请求工具函数
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
