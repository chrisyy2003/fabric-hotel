<template>
	<view class="">
		<!-- 顶部导航 -->
		<fa-navbar title="登录"></fa-navbar>
		<view class="login">
			<view class="u-m-t-50">
				<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
					<u-form-item :label-position="labelPosition" label="手机号码:" prop="mobile" label-width="120">
						<u-input :border="border" placeholder="请输入手机号码" v-model="form.mobile" type="number"></u-input>
					</u-form-item>
					<u-form-item :label-position="labelPosition" label="验证码:" prop="captcha" label-width="120">
						<u-input :border="border" placeholder="请输入验证码" v-model="form.captcha" type="text"></u-input>
						<u-button
							hover-class="none"
							type="primary"
							slot="right"
							:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
							size="mini"
							@click="getCode"
						>
							{{ codeTips }}
						</u-button>
					</u-form-item>
				</u-form>
			</view>
			<view class="u-m-t-80">
				<u-button hover-class="none" type="primary" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" shape="circle" @click="goLogin">
					登录
				</u-button>
			</view>
			<view class="u-flex u-row-right u-tips-color u-m-t-30 u-p-20"><view class="" @click="goPage">账号登录</view></view>
			<view class="u-text-center other" v-if="isThreeLogin">
				<u-grid :col="1" :border="false">
					<u-grid-item @click="goThreeLogin">
						<u-icon name="weixin-fill" color="#53c240" :size="50"></u-icon>
						<view class="grid-text">微信</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
	</view>
</template>

<script>
import { loginfunc } from '@/common/fa.mixin.js';
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
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	data() {
		return {
			labelPosition: 'top',
			border: false,
			errorType: ['message'],
			form: {
				mobile: '',
				captcha: ''
			},
			rules: {
				mobile: [
					{
						required: true,
						message: '请输入手机号码',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					},
					{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						trigger: ['change', 'blur']
					}
				],
				captcha: [
					{
						required: true,
						message: '请输入验证码',
						trigger: 'change'
					}
				]
			},
			isThreeLogin: false,
			codeTips: ''
		};
	},
	methods: {
		codeChange(text) {
			this.codeTips = text;
		},
		// 获取验证码
		getCode: async function() {
			if (!this.$u.test.mobile(this.form.mobile)) {
				this.$u.toast('手机号码格式不正确！');
				return;
			}
			if (this.$refs.uCode.canGetCode) {
				let res = await this.$api.getSmsSend({
					mobile: this.form.mobile,
					event: 'mobilelogin'
				});
				this.$u.toast(res.msg);
				if(res.code==1){
					this.$refs.uCode.start();
				}
			} else {
				this.$u.toast('倒计时结束后再发送');
			}
		},
		goPage(index) {
			this.$u.route('/pages/login/login');
		},
		goThreeLogin: async function() {
			// #ifdef MP-WEIXIN
			this.$u.route('/pages/login/wxlogin');
			// #endif

			// #ifdef H5
			this.goAuth();
			// #endif

			// #ifdef APP-PLUS
			this.goAppLogin();
			// #endif
		},
		goLogin: function() {
			this.$refs.uForm.validate(async valid => {
				if (valid) {					
					let res = await this.$api.mobilelogin(this.form);
					if (!res.code) {
						this.$u.toast(res.msg);
						return;
					}
					this.$u.vuex('vuex_token', res.data.token);
					this.$u.vuex('vuex_user', res.data.user || {});
					this.success(1);
				} else {
					this.$u.toast('验证失败');
				}
			});
		}
	}
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
