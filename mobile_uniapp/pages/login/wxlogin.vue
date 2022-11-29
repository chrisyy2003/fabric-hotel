<template>
	<view class="">
		<!-- 顶部导航 -->
		<fa-navbar title="授权登录"></fa-navbar>
		<view class="content">
			<view>
				<view class="login-item">
					<view class="logo"><open-data type="userAvatarUrl"></open-data></view>
				</view>
				<view class="login-tip">
					<view>申请获取以下权限</view>
					<view>获得你的公开信息 （昵称、头像等）</view>
				</view>
			</view>
			<view class="u-flex u-row-between">
				<!-- #ifdef MP-WEIXIN -->
				<u-button hover-class="none" shape="circle" @click="handleRefuse" class="u-flex-6" :custom-style="{ width: '95%' }">拒绝</u-button>
				<u-button
					hover-class="none"
					type="primary"
					shape="circle"
					class="u-flex-6"
					:custom-style="{ width: '95%', backgroundColor: theme.bgColor, color: theme.color }"
					@click="getUserInfo"
				>
					允许
				</u-button>
				<!-- #endif -->

				<!-- #ifdef MP-ALIPAY -->
				<u-button hover-class="none" shape="circle" @click="getALICode">授权登录</u-button>
				<!-- #endif -->
			</view>
			<u-top-tips ref="uTips"></u-top-tips>
		</view>
	</view>
</template>

<script>
import { loginfunc } from '@/common/fa.mixin.js';
export default {
	mixins: [loginfunc],
	data() {
		return {};
	},
	methods: {
		handleRefuse() {
			this.$u.toast('未授权');
			setTimeout(() => {
				uni.navigateBack({
					delta: 1
				});
			}, 1000);
		},
		getCode: async function() {
			return new Promise((resolve, reject) => {
				uni.login({
					// #ifdef MP-ALIPAY
					scopes: 'auth_user',
					// #endif
					success: function(res) {
						if (res.code) {
							resolve(res.code);
						} else {
							//login成功，但是没有取到code
							reject('未取得code');
						}
					},
					fail: function(res) {
						reject('用户授权失败wx.login');
					}
				});
			});
		},
		//用户授权得到用户的信息
		// #ifdef MP-WEIXIN
		getUserInfo: function() {
			let that = this;
			wx.getUserProfile({
				lang: 'zh',
				desc: '用户信息绑定',
				success: async function(e) {
					console.log(e);
					try {
						let code = await that.getCode();
						let data = {
							code: code,
							rawData: e.userInfo,
							__token__: that.vuex__token__
						};
						//有推荐码的话，带上
						if (that.vuex_invitecode) {
							data.invitecode = that.vuex_invitecode;
						}
						that.toLogin(data);
					} catch (e) {
						that.$u.toast(e);
					}
				},
				fail: function(e) {
					console.log(e);
					that.$u.toast(JSON.stringify(e));
				}
			});
		},
		// #endif
		//实际的去登陆
		toLogin: async function(data) {
			let res = await this.$api.gowxLogin(data);
			if (!res.code) {
				this.$u.toast(res.msg);
				return;
			}
			if (res.data.user) {
				this.$u.vuex('vuex_token', res.data.user.token);
				this.$u.vuex('vuex_user', res.data.user || {});
				this.success(2);
				return;
			}
			this.$u.vuex('vuex_third', res.data.third);
			//授权成功到登录或绑定页面
			this.$u.route('/pages/login/register?bind=bind');
		},
		// #ifdef MP-ALIPAY
		getALICode() {
			let that = this;
			uni.login({
				scopes: 'auth_user',
				success: res => {
					if (res.authCode) {
						uni.getUserInfo({
							provider: 'alipay',
							success: function(infoRes) {
								if (infoRes.errMsg == 'getUserInfo:ok') {
									let user_info = {
										nickname: infoRes.nickName,
										avatar: infoRes.avatar
									};
									that.aLiLoginStep1(res.authCode, user_info);
								}
							},
							fail: function(errorRes) {
								this.$u.toast('未取得用户昵称头像信息');
							}
						});
					} else {
						this.$u.toast('未取得code');
					}
				},
				fail: function(res) {
					this.$u.toast('用户授权失败my.login');
				}
			});
		},
		aLiLoginStep1: async function(code, user_info) {
			let data = {
				code: code,
				user_info: user_info
			};
			let res = await this.$api.alilogin1(data);
			if (!res.code) {
				this.$u.toast(res.msg);
			}
		}
		// #endif
	}
};
</script>

<style lang="scss">
.content {
	background-color: #fff;
	height: 100vh;
	padding: 100rpx 60rpx 0;
}

.login-item {
	display: flex;
	justify-content: center;
	padding-bottom: 40rpx;
	border-bottom: 1rpx solid #dddddd;
}

.logo {
	display: block;
	width: 180rpx;
	height: 180rpx;
	border-radius: 50%;
	overflow: hidden;
	border: 2px solid #fff;
	box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
}

.login-tip {
	padding: 60rpx 0;
	&-big {
		font-size: 28rpx;
		line-height: 80rpx;
	}
	&-small {
		font-size: 12px;
		color: #9e9e9e;
	}
}
</style>
