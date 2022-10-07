<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBand">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { ref } from 'vue'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'PageCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup() {
    const hasAccount = ref(true)
    // 判断是否成功登录
    const isBand = ref(true)
    // 存储回调地址，提供将来QQ回调页使用  setup中
    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)

    // 候获取openId去登录
    if (QC.Login.check()) {
      // 检测QQ是否登录，如果登录了再获取登录所需的openId

      QC.Login.getMe((openId) => {
        unionId.value = openId
        userQQLogin(openId)
          .then((data) => {
            // 解析data数据
            const { id, account, avatar, mobile, nickname, token } = data.result
            // 1. 存储用户信息
            store.commit('user/setUser', {
              id,
              account,
              avatar,
              mobile,
              nickname,
              token
            })
            store.dispatch('cart/mergeLocalCart').then(() => {
              // 2. 跳转到来源页或者首页
              router.push(store.state.user.redirectUrl || '/')
              // 3. 成功提示
              Message({ type: 'success', text: 'QQ登录成功' })
            })
          })
          .catch((e) => {
            isBand.value = false
          })
      })
    }

    return { hasAccount, isBand, unionId }
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
