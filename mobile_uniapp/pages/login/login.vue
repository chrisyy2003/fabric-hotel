<template>
  <view class="">
    <!-- 顶部导航 -->
    <fa-navbar title="登录"></fa-navbar>
    <view class="login">
      <view class="u-m-t-50">
        <u-form :model="form" ref="uForm" :errorType="errorType">
          <u-form-item
            :label-position="labelPosition"
            label="用户公钥: "
            prop="account"
            left-icon="account"
            label-width="120"
          >
            <u-input
              :border="border"
              placeholder="请输入用户公钥"
              v-model="form.account"
            />
          </u-form-item>
          <u-form-item
            v-if="!form.passwdLogin"
            :label-position="labelPosition"
            label="证明:"
            prop="password"
            left-icon="lock"
            label-width="120"
          >
            <u-input
              :password-icon="true"
              placeholder="请输入证明Proof"
              :border="border"
              type="password"
              v-model="form.proof"
              :maxlength="1000"
            ></u-input>
          </u-form-item>

          <u-form-item
            v-if="form.passwdLogin"
            :label-position="labelPosition"
            label="密码:"
            prop="password"
            left-icon="lock"
            label-width="120"
          >
            <u-input placeholder="请输入密码" type="password" v-model="form.password"></u-input>
          </u-form-item>

          <u-switch v-model="form.passwdLogin" style="margin-top: 10px"></u-switch>
        </u-form>
      </view>
      <view class="u-m-t-80">
        <u-button
          type="primary"
          hover-class="none"
          :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
          shape="circle"
          @click="goLogin"
          >登录</u-button
        >
      </view>
      <view class="u-flex u-row-between u-tips-color u-m-t-10 u-p-20">
        测试账号:请用Postman生成
        <!-- <view class="" @click="goPage('/pages/login/forgetpwd')">忘记密码</view> -->
        <view class="" @click="goPage('/pages/login/register')">注册账号</view>
      </view>
    </view>
  </view>
</template>

<script>
import { loginfunc } from "@/common/fa.mixin.js";
export default {
  mixins: [loginfunc],
  onLoad() {
    // #ifdef MP-WEIXIN || APP-PLUS
    this.isThreeLogin = true;
    // #endif

    // #ifdef H5
    if (this.$util.isWeiXinBrowser()) {
      this.isThreeLogin = true;
    }
    // #endif
  },

  data() {
    return {
      labelPosition: "top",
      border: false,
      errorType: ["message"],
      form: {
        account: "",
        password: "",
		proof: "",
		passwdLogin: false,
      },

      isThreeLogin: false,
    };
  },
  methods: {
    goThreeLogin: async function () {
      // #ifdef MP-WEIXIN
      this.$u.route("/pages/login/wxlogin");
      // #endif

      // #ifdef H5
      this.goAuth();
      // #endif

      // #ifdef APP-PLUS
      this.goAppLogin(2);
      // #endif
    },
    goLogin: async function () {
      let res = await this.$api.goLogin(this.form);
      console.log(res)
      if (!res.code) {
        this.$u.toast(res.msg);
        return;
      }else{
        this.$u.vuex("vuex_token", res.data.token);
        this.$u.vuex("vuex_user", res.data.user || {});
        this.$u.toast(res.msg)
      }
      
    //   this.success(2);
    },
  },
};
</script>

<style>
page {
  background-color: #ffffff;
}
.login {
  padding: 80rpx 100rpx 0 100rpx;
}
.other {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 40rpx;
}
</style>
