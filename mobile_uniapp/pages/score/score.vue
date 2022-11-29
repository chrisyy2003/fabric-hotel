<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="我的积分" :border-bottom="false"></fa-navbar>
		<view class="u-p-30 u-m-t-40">
			<view class="center u-p-30" :style="[{ background: theme.bgColor }]">
				<view class="header u-row-center">
					<view class="u-m-r-15"><u-avatar size="100" :src="vuex_user.avatar"></u-avatar></view>
					<view class="u-flex u-flex-column u-row-center u-col-center u-flex-1">
						<view class="u-flex u-m-t-10">
							<view class="nickname">{{ vuex_user.nickname }}</view>
						</view>
						<view class="u-font-30 u-m-t-10">
							{{ vuex_user.score }}
							<text class="u-font-20 u-m-l-5">积分</text>
						</view>
					</view>
				</view>
				<view class="u-flex u-row-between u-m-t-15">
					<view class="">
						<u-button
							size="mini"
							hover-class="none"
							:custom-style="{ background: theme.bgColor, color: '#ffffff' }"
							@click="goPage('/pages/score/logs')"
						>
							积分日志
						</u-button>
					</view>
					<view class="">
						<u-button
							size="mini"
							hover-class="none"
							:custom-style="{ background: theme.bgColor, color: '#ffffff' }"
							@click="goPage('/pages/score/exchange')"
						>
							积分兑换
						</u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="u-flex u-row-between u-p-30 bg-title">
			<view class="">获得积分渠道说明</view>
			<view class="">
				<u-icon name="info-circle"></u-icon>
				<text class="u-m-l-10 u-tips-color">积分</text>
			</view>
		</view>
		<view class="">
			<u-cell-group>
				<u-cell-item
					v-if="vuex_config.money_score > 0"
					icon="order"
					title="完成订单赠送积分"
					value="去预订"
					:label="`完成订单,1元可兑换${vuex_config.money_score}积分`"
					@click="goPage('/pages/hotel/hotel')"
				></u-cell-item>
				<u-cell-item
					v-if="vuex_config.comment_score > 0"
					icon="edit-pen"
					title="评价订单赠送积分"
					value="去评价"
					:label="`好评最多可得${vuex_config.comment_score}积分`"
					@click="goPage('/pages/order/houseorder?status=3')"
				></u-cell-item>
				<u-cell-item
					icon="pushpin-fill"
					title="每日一签赠送积分"
					value="去签到"
					label="每天签到最高可得7积分"
					@click="goPage('/pages/signin/signin')"
				></u-cell-item>
				<!-- <u-cell-item icon="share-fill" title="邀请好友赠送积分" value="去邀请" label="每邀请一位好友赠送500积分" @click="invite"></u-cell-item> -->
			</u-cell-group>
		</view>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		invite(){
			if(!this.vuex_token){
				this.$u.toast('请先登录');
				return;
			}
			// #ifdef H5
			let href = window.location.href.replace(/pages.*$/g,'pages/login/register?invite_id='+this.vuex_user.id);
			this.copyUrl(href);
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
.center {
	border-radius: 20rpx;
	color: #ffffff;
	box-shadow: 0 0 16rpx 4rpx rgba(55, 68, 134, 0.3);
	.nickname {
		font-weight: bold;
	}
	.header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: -80rpx;
	}
}
.u-flex-column {
	flex-direction: column;
	height: 100%;
}
.bg-title {
	background-color: #f3f4f6;
}
</style>
