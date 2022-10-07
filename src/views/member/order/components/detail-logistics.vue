<template>
  <div class="detail-logistics" v-if="list">
    <p>
      <span>{{ list.list[0].time }}</span>
      <span>{{ list.list[0].text }}</span>
    </p>
    <a @click="onLogisticsOrder(order)" href="javascript:;">查看物流</a>
    <OrderLogistics ref="logisticsOrderCom" />
  </div>
</template>
<script>
import OrderLogistics from './order-logistics.vue'
import { useLogisticsOrder } from '../index.vue'
import { logisticsOrder } from '@/api/order'
import { ref } from 'vue'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  async setup(props) {
    const list = ref(null)
    const { result } = await logisticsOrder(props.order.id)
    list.value = result
    return { list, ...useLogisticsOrder() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
