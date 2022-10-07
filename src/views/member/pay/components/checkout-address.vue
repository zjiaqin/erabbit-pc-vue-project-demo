<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="showAddress">
        <li>
          <span>
            收
            <i />
            货
            <i />
            人：
          </span>
          {{ showAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span>
          {{ showAddress.contact }}
        </li>
        <li>
          <span>收货地址：</span>
          {{ showAddress.fullLocation.replace(/ /g, '') + showAddress.address }}
        </li>
      </ul>
      <a href="javascript:;" @click="openAddressEdit(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog()">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 对话框组件 -->
  <XtxDialog title="切换收货地址" v-model:visible="dialogVisible">
    <div
      :class="{ active: selectedAddress && item.id === selectedAddress.id }"
      @click="selectedAddress = item"
      class="text item"
      v-for="item in list"
      :key="item.id"
    >
      <ul>
        <li>
          <span>
            收
            <i />
            货
            <i />
            人：
          </span>
          {{ item.receiver }}
        </li>
        <li>
          <span>联系方式：</span>
          {{ item.contact }}
        </li>
        <li>
          <span>收货地址：</span>
          {{ item.fullLocation.replace(/ /g, '') + item.address }}
        </li>
      </ul>
    </div>
    <template #footer>
      <XtxButton
        @click="dialogVisible = false"
        type="gray"
        style="margin-right: 20px"
      >
        取消
      </XtxButton>
      <XtxButton @click="confirmAddress()" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加编辑地址组件 -->
  <AddressEdit ref="addressEdit" @on-success="successHandler" />
</template>
<script>
import AddressEdit from './address-edit.vue'
import { ref } from 'vue'
import Message from '@/components/library/Message'
export default {
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    AddressEdit
  },
  emits: ['change'],
  setup(props, { emit }) {
    const showAddress = ref(null)
    if (props.list.length) {
      const defaultAddress = props.list.find((item) => item.isDefault === 1)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
      emit('change', showAddress.value?.id)
    }
    // 对话框显示隐藏
    const dialogVisible = ref(false)
    // 打开对话框
    const openDialog = () => {
      dialogVisible.value = true
      selectedAddress.value = null
    }

    // 确认地址
    const confirmAddress = () => {
      dialogVisible.value = false
      // 地址更改为已选择的地址
      showAddress.value = selectedAddress.value
      // 通知一个地址ID给父
      emit('change', showAddress.value?.id)
      Message({ type: 'success', text: '更换地址成功' })
    }
    // 默认通知一个地址ID给父

    // 已选择的地址
    const selectedAddress = ref(null)

    // 添加地址组件
    const addressEdit = ref(null)
    const openAddressEdit = (address) => {
      addressEdit.value.open(address)
    }

    // 添加或修改地址成功
    const successHandler = (formData) => {
      const editAddress = props.list.find((item) => item.id === formData.id)
      if (editAddress) {
        // 修改
        for (const key in formData) {
          editAddress[key] = formData[key]
        }
      } else {
        // 添加
        const json = JSON.stringify(formData) // 需要克隆下，不然使用的是对象的引用
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(json))
      }
    }
    return {
      showAddress,
      dialogVisible,
      openDialog,
      confirmAddress,
      selectedAddress,
      addressEdit,
      openAddressEdit,
      successHandler
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
