<template>
  <view class="">
    <!-- 顶部导航 -->
    <fa-navbar title="注册"></fa-navbar>
    <view class="login">
      <view class="u-text-center" v-if="is_bind"
        ><u-avatar :size="150" :src="vuex_third.avatar"></u-avatar
      ></view>
      <view class="u-text-center u-p-t-20" v-if="is_bind">{{
        vuex_third.nickname
      }}</view>
      <view class="u-m-t-30" v-if="!is_wx_phone || !is_bind">
        <u-form :model="form" ref="uForm">
          <block v-if="!is_bind">
            <u-form-item
              :label-position="labelPosition"
              label="私钥:"
              prop="username"
              label-width="150"
            >
              <u-input
                :border="border"
                placeholder="通过私钥唯一确定用户，请牢记"
                v-model="form.password"
              />
            </u-form-item>
          </block>
        </u-form>
      </view>

      <view class="u-m-t-80" v-if="!is_wx_phone || !is_bind">
        <u-button
          hover-class="none"
          type="primary"
          :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
          shape="circle"
          @click="register"
        >
          {{ is_bind ? "立即绑定" : "注册" }}
        </u-button>
      </view>

      <view class="info">{{ userpk }}</view>
      <view class="info">{{ proof }}</view>

      <template>
			<u-read-more>
				<rich-text :nodes="userpk"></rich-text>
			</u-read-more>
		</template>

    </view>
    <u-verification-code
      seconds="60"
      ref="uCode"
      @change="codeChange"
    ></u-verification-code>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { loginfunc } from "@/common/fa.mixin.js";
export default {
  mixins: [loginfunc],
  onLoad(e) {},
  onReady() {
    if (!this.is_bind) {
      this.$refs.uForm.setRules(this.rules);
    }
  },
  watch: {
    is_wx_phone(newValue, oldValue) {
      if (!newValue) {
        this.$nextTick(() => {
          this.$refs.uForm.setRules(this.rules);
        });
      }
    },
  },
  data() {
    return {
      userpk: "empty",
      proof: "empty",
      is_bind: "",
      // #ifdef MP-WEIXIN
      is_wx_phone: true, //微信小程序默认为手机号码授权登录，不显示表单
      // #endif
      // #ifndef MP-WEIXIN
      is_wx_phone: false, //非微信小程序，需要显示表单
      // #endif
      agreeChecked: false,
      labelPosition: "top",
      border: false,
      form: {
        password: null,
      },
    };
  },
  methods: {
    codeChange(text) {
      this.codeTips = text;
    },
    register() {
      this.goReg();
    },
    //去注册
    goReg: async function () {
      console.log(this.form);

      let res = await this.$api.goRegister({
        passwd: this.form.password,
      });
      this.userpk = res.data.user.userpk;
      this.proof = res.data.user.proof;

      this.$u.vuex('vuex_token', res.data.token);

      console.log('token:', res.data.token)
      // this.success(2);
    },
    // #ifdef MP-WEIXIN
    getPhoneNumber(e) {
      if (!this.agreeChecked) {
        this.$refs.uToast.show({
          title: "请阅读并同意遵守《用户协议》",
          type: "error",
        });
        return;
      }
      let that = this;
      uni.login({
        provider: "weixin",
        success: function (loginRes) {
          console.log(loginRes);
          that.$api
            .getWechatMobile({
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              code: loginRes.code,
            })
            .then(function (res) {
              if (res.code == 1) {
                that.$u.vuex("vuex_token", res.data.token);
                that.success(3);
              } else {
                that.$u.toast(res.msg);
              }
            });
        },
        fail(e) {
          console.log(e);
        },
      });
    },
    // #endif
    //绑定账号
    goBind: async function () {
      let res = await this.$api.goThirdAccount(this.form);
      if (!res.code) {
        this.$u.toast(res.msg);
        return;
      }
      let delta = 2;
      // #ifdef MP-WEIXIN
      delta = 3;
      // #endif
      if (res.data.userinfo) {
        this.$u.vuex("vuex_token", res.data.userinfo.token);
        this.success(3);
      }
    },
  },
};
</script>

<style>
page {
  background-color: #ffffff;
}
.login {
  padding: 20% 10%;
}
.agree {
  margin-left: -25rpx;
}

.info {
  margin-top: 20px;
}
</style>
