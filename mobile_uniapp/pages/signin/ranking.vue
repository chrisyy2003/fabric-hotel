<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="签到排行榜"></fa-navbar>		
		<view class="u-p-30">
			<block v-for="(item, index) in ranklist" :key="index">
				<view class="u-flex u-col-center u-row-around u-p-30 u-m-b-20 bg-white">
					<view class="u-flex-1 u-text-weight u-flex u-col-center u-row-around">						
						<image v-if="index<3" class="medal" :src="'../../static/image/'+index+'.png'" mode="aspectFill"></image>
						<text v-else>{{ index + 1 }}</text>
					</view>
					<view class="u-flex-2 u-flex u-col-center u-row-around">
						<u-avatar :src="item.user.avatar"></u-avatar>
					</view>
					<view class="u-flex-4 u-m-l-15 u-line-1">{{ item.user.nickname }}</view>
					<view class="u-flex-5 u-text-right">连续签到<text class="u-text-weight u-p-l-10 u-p-r-10">{{ item.days }}</text>天</view>
				</view>
			</block>
		</view>
		<view class="" v-if="self_rank>10">
			<u-gap height="120" bg-color="#f4f6f8" ></u-gap>
			<view class="u-bg-white u-p-l-30 u-p-r-30 self-rank">
				<view class="u-flex u-col-center u-row-around u-p-30 ">
					<view class="u-text-weight">{{ self_rank }}</view>
					<view class="">{{ vuex_user.nickname }}</view>
					<u-avatar :src="vuex_user.avatar"></u-avatar>
					<view class="">连续签到<text class="u-text-weight u-p-l-10 u-p-r-10">{{ successions }}</text>天</view>
				</view>
			</view>
		</view>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.getSignRank();
	},
	data() {
		return {
			ranklist: [],
			self_rank: 0,
			successions: 0
		};
	},
	methods: {
		getSignRank() {
			this.$api.signRank().then(res => {
				if (res.code) {
					this.ranklist = res.data.ranklist;
					this.self_rank = res.data.self_rank;
					this.successions = res.data.successions;
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
.u-flexs {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.self-rank{
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
}
.medal{
	width: 50rpx;
	height: 50rpx;
}
</style>
