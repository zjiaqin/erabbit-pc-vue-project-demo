<template>
  <div class="member-order-page">
    <XtxTabs v-model="activeName" @tab-click="clickTab">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      ></XtxTabsPanel>
    </XtxTabs>
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        v-for="item in orderList"
        :key="item.id"
        :order="item"
        @on-cancel-order="onCancelOrder(item)"
        @on-delete-order="onDeleteOrder(item)"
        @on-confirm-order="onConfirmOrder(item)"
        @on-logistics-order="onLogisticsOrder(item)"
      />
    </div>
    <XtxPagination
      v-if="total > requestParams.pageSize"
      @current-change="requestParams.page = $event"
      :total="total"
      :page-size="requestParams.pageSize"
      :current-page="requestParams.page"
    />
    <OrderCancel ref="orderCancelCom" />
    <OrderLogistics ref="logisticsOrderCom" />
  </div>
</template>

<script>
import OrderLogistics from './components/order-logistics.vue'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
import OrderCancel from './components/order-cancel.vue'
import OrderItem from './components/order-item'
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList, delteOrder, confirmOrder } from '@/api/order'

export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup() {
    const loading = ref(false)
    const total = ref(0)
    const activeName = ref('all')
    const clickTab = (tab) => {
      // 此时：tab.index 就是订单的状态
      requestParams.orderState = tab.index
      requestParams.page = 1
    }
    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 订单列表
    const orderList = ref([])
    // // 查询订单
    // findOrderList(requestParams).then((data) => {
    //   orderList.value = data.result.items
    // })
    // 监听查询订单参数改变,查询订单
    const findOrderListFn = () => {
      loading.value = true
      findOrderList(requestParams).then((data) => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    watch(
      requestParams,
      () => {
        findOrderListFn()
      },
      { immediate: true }
    )

    // // 分页事件
    // const changePager = (np) => {
    //   requestParams.page = np
    // }
    // 删除订单
    const onDeleteOrder = (item) => {
      Confirm({ text: '您确认删除该条订单吗？' })
        .then(() => {
          delteOrder([item.id]).then(() => {
            Message({ text: '删除订单成功', type: 'success' })
            findOrderListFn()
          })
        })
        .catch((e) => {})
    }

    return {
      activeName,
      clickTab,
      orderStatus,
      orderList,
      loading,
      total,
      onDeleteOrder,
      requestParams,
      ...useCancelOrder(),
      ...useConfirmOrder(),
      ...useLogisticsOrder()
    }
  }
}
// 取消订单
export const useCancelOrder = () => {
  const orderCancelCom = ref(null)
  const onCancelOrder = (item) => {
    // item 就是你要取消的订单
    orderCancelCom.value.open(item)
  }
  return { orderCancelCom, onCancelOrder }
}
// 封装逻辑-确认收货
export const useConfirmOrder = () => {
  const onConfirmOrder = (item) => {
    // item 就是你要确认收货的订单
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
      confirmOrder(item.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        // 确认收货后状态变成 待评价
        item.orderState = 4
      })
    })
  }
  return { onConfirmOrder }
}
// 封装逻辑-查看物流
export const useLogisticsOrder = () => {
  const logisticsOrderCom = ref(null)
  const onLogisticsOrder = (item) => {
    logisticsOrderCom.value.open(item)
  }
  return { onLogisticsOrder, logisticsOrderCom }
}
</script>

<style scoped lang="less">
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
