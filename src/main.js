import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入骨架组件插件
import ui from './components/library'

// 引入重置样式的包
import 'normalize.css'
// 引入公用样式
import '@/assets/styles/common.less'
// 引入mock数据
import './mock'

createApp(App).use(store).use(router).use(ui).mount('#app')
