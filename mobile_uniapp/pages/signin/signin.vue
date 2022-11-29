<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="签到" :border-bottom="false"></fa-navbar>
		<view class="u-flex u-row-center u-col-center signin" :style="[{ background: theme.bgColor }]">
			<view class="u-flexs u-m-b-50">
				<view class="u-flex u-row-center u-col-center garden1" @click="goSignin">
					<view class="garden2" :class="vuex_signin.is_signin?'is-signin':'no-signin'"></view>
					<view class="u-flex u-row-center u-col-center garden3 u-font-30" :class="vuex_signin.is_signin?'is-signin':'no-signin'" v-text="vuex_signin.is_signin ? '已签到' : '签到'"></view>
				</view>
				<view class="u-score-color u-m-t-50" v-text="vuex_signin.msg"></view>
			</view>
			<view class="rule u-tips-color" @click="show = true">签到规则</view>
		</view>
		<view class="u-p-l-30 u-p-r-30 number">
			<view class="bg-white u-flex u-col-center">
				<view class="u-flex u-row-around" style="width: 100%;">
					<view class="u-text-center">
						<view class="u-font-40" v-text="vuex_signin.score"></view>
						<view class=""><text class="u-m-l-10">积分</text></view>
					</view>
					<view class="u-text-center" @click="goPage('/pages/signin/logs')">
						<view class="u-font-40" v-text="vuex_signin.successions"></view>
						<view class=""><text class="">签到天数</text></view>
					</view>
					<view class="u-text-center" @click="goPage('/pages/signin/ranking')">
						<view class="u-font-40">{{vuex_signin.self_rank}}</view>
						<view class=""><text class="">排行</text></view>
					</view>
				</view>
			</view>
			<view class="u-m-t-30"><fa-signin ref="sign" @dosign="goSignin" @fillup="fillup"></fa-signin></view>
		</view>
		<!-- 签到规则 -->
		<u-modal v-model="show" title="签到积分规则">
			<view class="slot-content">
				<view class="u-p-30">
					<u-table>
						<u-tr class="u-tr">
							<u-th class="u-th u-flex-1">连续签到天数</u-th>
							<u-th class="u-th u-flex-1">获得积分</u-th>
						</u-tr>
						<u-tr class="u-tr" v-for="(item, index) in vuex_signin.signinscore" :key="index">
							<u-td class="u-td u-flex-1">{{ '第' + index.replace('s', '') + '天' }}</u-td>
							<u-td class="u-td u-flex-1" v-text="item"></u-td>
						</u-tr>
					</u-table>
				</view>
			</view>
		</u-modal>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onShow() {
		this.getSigninConfig();
	},
	data() {
		return {
			show: false
		};
	},
	methods: {
		getSigninConfig() {
			this.$api.signinConfig().then(res => {
				if (res.code) {
					this.$u.vuex('vuex_signin', res.data);
				}
			});
		},
		//签到
		goSignin() {
			if(this.vuex_signin.is_signin){
				this.$u.toast('今天已签到,请明天再来');
				return;
			}
			this.$api.dosign().then(res => {
				this.$u.toast(res.msg);
				if (res.code) {
					this.getSigninConfig();
					this.$refs.sign.init();
				}
			});
		},
		//补签
		fillup(e) {
			this.$api.fillup({ date: e.fill_date }).then(res => {
				this.$u.toast(res.msg);
				if (res.code) {
					this.getSigninConfig();
					this.$refs.sign.init();
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f4f6f8;
}
.signin {
	height: 450rpx;
	position: relative;
	.u-flexs {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.garden1 {
		width: 180rpx;
		height: 180rpx;
		border-radius: 200rpx;
		background-color: rgba(255, 255, 255, 0.4);
		position: relative;
		.garden2 {
			width: 150rpx;
			height: 150rpx;
			border-radius: 200rpx;
			background-color: rgba(255, 255, 255, 0.7);
			position: absolute;
			left: 15rpx;
			top: 15rpx;
			z-index: 80;
			.is-signin{
				color: #909399;
			}
			&.no-signin{
				animation: gardens2 2s infinite;
			}			
		}
		.garden3 {
			width: 120rpx;
			height: 120rpx;
			border-radius: 200rpx;
			background-color: #ffffff;
			position: relative;
			z-index: 100;
			&.no-signin{
				animation: gardens3 2s infinite;
			}
		}
	}
	.u-score-color {
		color: #e0e0e0;
	}
	.rule {
		position: absolute;
		right: 0;
		top: 50rpx;
		background-color: rgba(255, 255, 255, 0.9);
		border-top-left-radius: 30rpx;
		border-bottom-left-radius: 30rpx;
		padding: 5rpx 10rpx 5rpx 20rpx;
	}
}
.number {
	position: relative;
	top: -65rpx;
	.u-col-center {
		height: 130rpx;
		border-radius: 10rpx;
		box-shadow: 0px 0px 5px 0px rgba(0, 34, 144, 0.1);
		.u-row-around {
			width: 100%;
		}
	}
}

@keyframes gardens2{
    0% {
        opacity: 1;
        transform: scale(1);
    }

	100% {
	    opacity: 0;
	   transform: scale(1.5);
	}
}


</style>
