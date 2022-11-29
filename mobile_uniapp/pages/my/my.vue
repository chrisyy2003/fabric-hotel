<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="个人中心" :border-bottom="false"></fa-navbar>
		<!-- 会员中心 -->
		<view class="u-p-t-30 u-p-b-50 home" :style="[{ backgroundColor: theme.bgColor || '#374486' }]">
			<view class="userinfo">

				<!-- 返回token页面 -->
				<block v-if="vuex_token">
					<u-avatar size="120" :show-sex="false" :sex-icon="vuex_user.gender == 1 ? 'man' : 'woman'" :src="url || vuex_user.avatar" @click="chooseAvatar"></u-avatar>
					<view class="u-skeleton-fillet u-m-t-10 u-p-l-80 u-p-r-80 u-line-1">{{ "用户: " + vuex_user.nickname.slice(0, 10) + '...' || '' }}</view>
					<view class="u-skeleton-fillet u-m-t-10 u-p-l-80 u-p-r-80 u-line-2">{{ vuex_user.bio || '' }}</view>
				</block>
				<block v-else>
					<u-avatar size="120" src="0"></u-avatar>
					<view class="u-m-t-30"><u-button hover-class="none" size="mini" @click="goPage('/pages/login/login')">立即登录</u-button></view>
				</block>
			</view>
			<view class="corrugated">
				<view class="wave-top wave-item" :style="[{ backgroundImage: 'url(' + wavetop + ')' }]"></view>
				<view class="wave-middle wave-item" :style="[{ backgroundImage: 'url(' + wavemiddle + ')' }]"></view>
				<view class="wave-bottom wave-item" :style="[{ backgroundImage: 'url(' + wavebottom + ')' }]"></view>
			</view>
		</view>
		<!-- 统计 -->
		<view class="u-flex u-text-center u-p-l-30 u-p-r-30 u-p-t-50 u-p-b-50 bg-white">
			<view class="u-flex-4" @click="goPage('/pages/order/houseorder?status=2',true)">
				<view class="u-text-weight u-font-28">					
					<text v-text="paid"></text>
				</view>
				<view class="u-m-t-20">待入住</view>
			</view>
			<view class="u-flex-4 u-border-left u-border-right" @click="goPage('/pages/order/houseorder?status=1',true)">
				<view class="u-text-weight u-font-28"><text v-text="created"></text></view>
				<view class="u-m-t-20">待支付</view>
			</view>
			<view class="u-flex-4" @click="goPage('/pages/order/houseorder?status=3',true)">
				<view class="u-text-weight u-font-28">					
					<text v-text="evaluate"></text>
				</view>
				<view class="u-m-t-20">待评论</view>
			</view>
		</view>
		<!-- 导航 -->
		<view class="u-m-t-30 u-m-b-15">
			<u-cell-group>				
				<u-cell-item icon="order" title="房间订单" @click="goPage('/pages/order/houseorder',true)"></u-cell-item>
				<!-- <u-cell-item icon="edit-pen" title="留言板" @click="goPage('/pages/my/feedback',true)"></u-cell-item> -->
				<u-cell-item icon="rmb-circle-fill" title="获取代币" @click="goPage('/pages/my/gettoken',true)"></u-cell-item>

				<u-cell-item icon="account-fill" title="个人资料" @click="goPage('/pages/my/profile',true)"></u-cell-item>
				<!-- <u-cell-item icon="coupon" title="我的优惠券" @click="goPage('/pages/coupon/user',true)"></u-cell-item> -->
				<u-cell-item icon="backspace" v-if="vuex_token" title="退出登录" @click="goPage('out')"></u-cell-item>
			</u-cell-group>
		</view>
		<u-top-tips ref="uTips" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
import { avatar } from '@/common/fa.mixin.js';
export default {
	mixins: [avatar],
	computed: {
		wavetop() {
			return this.$u.http.config.baseUrl + '/assets/addons/booking/img/wave-top.png';
		},
		wavemiddle() {
			return this.$u.http.config.baseUrl + '/assets/addons/booking/img/wave-mid.png';
		},
		wavebottom() {
			return this.$u.http.config.baseUrl + '/assets/addons/booking/img/wave-bot.png';
		},
		isBind() {
			return false;
		}
	},
	onShow() {
		if (this.vuex_token) {
			this.getUserIndex();
		} else {
			this.$u.vuex('vuex_user', {});
		}
		//移除事件监听
		uni.$off('uAvatarCropper', this.upload);
	},
	data() {
		return {
			// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
			statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
			// 导航栏内容区域高度，不包括状态栏高度在内
			navbarHeight: 44,
			url: '',
			form: {
				avatar: ''
			},
			created: '',
			evaluate: '',
			paid: '',
		};
	},
	methods: {		
		getUserIndex: async function() {
			let res = await this.$api.getUserIndex();
			uni.stopPullDownRefresh();

			let r = await this.$api.orderList()
			this.created =  r.created
			this.evaluate =  r.evaluate
			this.paid =  r.paid



			
			if (res.code==1) {
				this.$u.vuex('vuex_user', res.data.user);				
			}else{
				this.$u.toast(res.msg);
				return;
			}
		},

		editAvatar: async function() {
			let res = await this.$api.goUserAvatar({
				avatar: this.form.avatar
			});
		}
	},
	//下拉刷新
	onPullDownRefresh() {
		if (this.vuex_token) {
			this.getUserIndex();
		} else {
			uni.stopPullDownRefresh();
			this.$u.toast('请先登录')
			this.$u.vuex('vuex_user', {});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f4f6f8;
}
.home {
	position: relative;
	.userinfo {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 0;
		z-index: 100;
		height: 310rpx;
		.u-skeleton-fillet {
			color: #ffffff;
		}
	}
	.corrugated {
		bottom: -2rpx;
		left: 0;
		position: absolute;
		width: 100%;
		height: 50%;
		overflow: hidden;
		z-index: 0;
		.wave-item {
			position: absolute;
			width: 200%;
			left: 0;
			height: 200rpx;
			background-repeat: repeat no-repeat;
			background-position: 0 bottom;
			transform-origin: center bottom;
		}
		.wave-top {
			opacity: 0.5;
			animation: wave-animation 3s;
			animation-delay: 1s;
			background-size: 50% 60rpx;
			z-index: 15;
		}
		.wave-middle {
			opacity: 0.75;
			animation: wavemove 10s linear infinite;
			background-size: 50% 80rpx;
			z-index: 10;
		}
		.wave-bottom {
			animation: wavemove 15s linear infinite;
			background-size: 50% 45rpx;
			z-index: 5;
		}
	}
}

@keyframes wavemove {
	0% {
		transform: translateX(0) translateZ(0) scaleY(1);
	}
	50% {
		transform: translateX(-25%) translateZ(0) scaleY(0.55);
	}
	100% {
		transform: translateX(-50%) translateZ(0) scaleY(1);
	}
}
</style>
