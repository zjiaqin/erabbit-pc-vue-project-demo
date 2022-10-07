<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类导航 -->
        <HomeCategory />
        <!-- 首页轮播图 -->
        <HomeBanner />
        <!-- 新鲜好物 -->
        <HomeNew />
        <!-- 人气推荐 -->
        <HomeHot />
        <!-- 热门品牌 -->
        <HomeBrand />
        <!-- 商品区域 -->
        <HomeProduct />
        <!-- 最新专题 -->
        <HomeSpecial />
      </div>
    </div>
  </div>
</template>

<script>
import HomeSpecial from './components/home-special'
import HomeBrand from './components/home-brand.vue'
import HomeHot from './components/home-hot.vue'
import HomeProduct from './components/home-product.vue'

import HomeNew from './components/home-new.vue'
import HomeBanner from './components/home-banner.vue'
import HomeCategory from './components/home-category'
export default {
  name: 'PageHome',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>

<style scoped lang="less"></style>
