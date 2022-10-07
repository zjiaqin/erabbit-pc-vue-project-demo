<template>
  <app-topnav />
  <app-header />
  <app-header-sticky />
  <main class="app-body">
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <app-footer />
</template>

<script>
import { useStore } from 'vuex'
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
export default {
  name: 'xtx-layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup() {
    // 获取下分类数据
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang="less">
.app-body {
  min-height: 600px;
}
</style>
