import request from '@/utils/request'

export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}

// 获取首页轮播图的API
export const findBanner = () => {
  return request('/home/banner', 'get')
}
// 获取新鲜好玩数据的API
export const findNew = () => {
  return request('/home/new', 'get')
}
// 获取人气推荐数据的API
export const findHot = () => {
  return request('/home/hot', 'get')
}
// 获取商品数据的API
export const findGoods = () => {
  return request('/home/goods', 'get')
}
// 获取最新专题API
export const findSpecial = () => {
  return request('home/special', 'get')
}
