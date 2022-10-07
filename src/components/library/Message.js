// 实现使用函数调用xtx-message组件的逻辑
import { createVNode, render } from 'vue'
// 引入需要渲染的vue组件
import XtxMessage from './xtx-message.vue'

// 准备dom容器，用于放置转译后的vue组件
const div = document.createElement('div')
// 给dom容器设置class属性，便于查找
div.setAttribute('class', 'xtx-message-container')
// 将容器放在html结构中
document.body.appendChild(div)

// 定时器标识
let timer = null

// 实现：根据xtx-message.vue渲染消息提示
export default ({ type, text }) => {
  // 1. 导入组件
  // 2. 根据组件创建虚拟节点
  const vnode = createVNode(XtxMessage, { type, text })
  // 3. 准备一个DOM容器
  // 4. 把虚拟节点渲染DOM容器中
  render(vnode, div)

  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
