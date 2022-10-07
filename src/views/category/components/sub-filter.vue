<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:;"
          @click="changeBrand(brand.id)"
          :class="{ active: filterData.selectedBrand === brand.id }"
          v-for="brand in filterData.brands"
          :key="brand.id"
        >
          {{ brand.name }}
        </a>
      </div>
    </div>
    <div class="item" v-for="p in filterData.saleProperties" :key="p.id">
      <div class="head">{{ p.name }}：</div>
      <div class="body">
        <a
          href="javascript:;"
          @click="changeAttr(p, attr.id)"
          :class="{ active: p.selectedProp === attr.id }"
          v-for="attr in p.properties"
          :key="attr.id"
        >
          {{ attr.name }}
        </a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
import { findSubCategoryFilter } from '@/api/category'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
export default {
  name: 'SubFilter',
  setup(props, { emit }) {
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    const filterFn = () => {
      findSubCategoryFilter(route.params.id).then(({ result }) => {
        // 品牌全部
        filterLoading.value = true
        result.selectedBrand = null
        result.brands.unshift({ id: null, name: '全部' })
        // 销售属性全部
        result.saleProperties.forEach((p) => {
          p.selectedProp = undefined
          p.properties.unshift({ id: null, name: '全部' })
        })
        filterLoading.value = false
        filterData.value = result
      })
    }
    // 获取筛选参数
    const getFilterParams = () => {
      const filterParams = {}
      const attrs = []
      filterParams.brandsId = filterData.value.selectedBrand
      filterData.value.saleProperties.forEach((p) => {
        const attr = p.properties.find((attr) => attr.id === p.selectedProp)
        if (attr && attr.id !== undefined) {
          attrs.push({ groupName: p.name, propertyName: attr.name })
        }
      })
      if (attrs.length) filterParams.attrs = attrs
      return filterParams
    }
    // 选择品牌
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.selectedBrand = brandId
      emit('filte-change', getFilterParams())
    }
    // 选择属性
    const changeAttr = (p, attrId) => {
      if (p.selectedProp === attrId) return
      p.selectedProp = attrId
    }
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && `/category/sub/${route.params.id}` === route.path) {
          filterFn()
        }
      },
      { immediate: true }
    )
    return {
      filterData,
      filterLoading,
      changeBrand,
      changeAttr
    }
  }
}
</script>
<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
  padding: 10px 0;
}
</style>
