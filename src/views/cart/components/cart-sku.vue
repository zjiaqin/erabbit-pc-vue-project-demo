<template>
  <div class="cart-sku">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible" ref="target">
      <div v-if="!goods" class="loading"></div>
      <GoodsSku
        v-if="goods"
        @change="changeSku"
        :skuId="skuId"
        :goods="goods"
      />
      <XtxButton
        v-if="goods"
        type="primary"
        size="mini"
        style="margin-left: 60px"
        @click="submit()"
      >
        确认
      </XtxButton>
    </div>
  </div>
</template>
<script>
import { getSpecsAndSkus } from '@/api/product'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
export default {
  name: 'CartSku',
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  components: {
    GoodsSku
  },
  setup(props, { emit }) {
    const visible = ref(false)
    const goods = ref(null)
    const show = () => {
      visible.value = true
      getSpecsAndSkus(props.skuId).then((data) => {
        goods.value = data.result
      })
    }
    const hide = () => {
      visible.value = false
    }
    const toggle = () => {
      visible.value ? hide() : show()
    }
    const target = ref(null)
    onClickOutside(target, () => {
      hide()
    })

    // 选择SKU时候触发
    const currSku = ref(null)
    const changeSku = (sku) => {
      currSku.value = sku
    }

    // 点击确认时，提交sku信息给购物车组件
    const submit = () => {
      // 给购物车组件数据的前提：有sku信息，sku信息完整，sku中的skuId不能现有props.skuId一样
      if (
        currSku.value &&
        currSku.value.skuId &&
        currSku.value.skuId !== props.skuId
      ) {
        emit('change', currSku.value)
        hide()
      }
    }
    return { toggle, goods, visible, target, changeSku, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
