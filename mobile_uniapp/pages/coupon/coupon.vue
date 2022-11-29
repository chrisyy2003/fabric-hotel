<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="优惠券列表" :border-bottom="false"></fa-navbar>
		<view class="">
			<u-tabs :list="list" :activeColor="theme.bgColor" :bar-width="barwidth" :is-scroll="false" :current="current" @change="change"></u-tabs>
			<view class="coupon-list">
				<view class="item u-flex" v-for="(item, index) in couponList" :key="index" @click="goPage('/pages/coupon/detail?id='+item.id)">
					<view class="content u-flex-1 u-flex">
						<view class="left">
							<view>
								{{ item.result_data && item.result_data.number }}
								<text class="small">{{item.result==1?'元':'折'}}</text>
							</view>							
						</view>
						<view class="right">
							<view class="u-font-30 u-m-b-5 u-line-1">{{ item.name }}</view>
							<view class="u-m-b-5 u-tips-color">
								<view class="u-flex">
									订单满
									<text class="priorityn" :style="{ color: theme.bgColor }">{{ item.result_data && item.result_data.money }}元</text>
									{{item.result==1?'减':'打'}}
									<text class="priorityn" :style="{ color: theme.bgColor }">
										{{ item.result_data && item.result_data.number }}{{item.result==1?'元':'折'}}
									</text>
								</view>								
							</view>
							<view class="u-m-b-5 u-font-24 u-tips-color">每人限领{{ item.alone_num }}张</view>
							<view class="u-m-b-10 u-tips-color u-font-24" v-if="item.mode == 'fixation'">领取后{{ item.receive_times }}天内有效</view>
							<view class="u-line-1 u-tips-color u-font-24" v-else>{{ item.receive_times | formatreceive }}</view>
						</view>
					</view>
					<view class="right-btn u-p-l-30 u-p-r-30">
						<block v-if="item.is_received"><u-button size="mini" :disabled="true" hover-class="none">已领取</u-button></block>
						<block v-else-if="item.has_more"><u-button size="mini" :disabled="true" hover-class="none">已被领完</u-button></block>
						<block v-else-if="item.expired && !item.is_received"><u-button size="mini" :disabled="true" hover-class="none">已过期</u-button></block>
						<block v-else-if="!item.online"><u-button size="mini" hover-class="none">待上架</u-button></block>
						<block v-else>
							<u-button size="mini" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" hover-class="none" @click="give(item.id)">
								立即领取
							</u-button>
						</block>
					</view>
				</view>
			</view>
		</view>
		<!-- 空数据 -->
		<view class="u-p-t-80 u-p-b-80" v-if="!couponList.length"><u-empty text="暂无可领取的优惠券"></u-empty></view>
		<!-- 加载更多 -->
		<view class="u-p-b-30" v-if="couponList.length"><u-loadmore bg-color="#f4f6f8" :status="has_more ? status : 'nomore'" /></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.getCouponList();
	},
	data() {
		return {
			barwidth: 85,
			list: [
				{
					name: '满减券',
					value: 1
				},
				{
					name: '折扣券',
					value: 0
				}
			],
			current: 0,
			is_update: false,
			status: 'loadmore',
			has_more: false,
			scrollTop: 0,
			page:1,
			couponList: []
		};
	},
	methods: {
		change(index) {
			this.barwidth = this.$util.strlen(this.list[index].name) * 30;
			this.current = index;
			this.is_update = true;
			this.getCouponList();
		},
		getCouponList() {
			this.$api.couponList({ page: this.page, result: this.list[this.current].value }).then(res => {
				if (res.code == 1) {
					if (this.is_update) {
						this.is_update = false;
						this.couponList = [];
					}
					this.couponList = [...this.couponList, ...res.data.data];
					this.has_more = res.data.has_more;
				}
			});
		},
		give(id) {
			this.$api.drawCoupon({ id: id }).then(res => {
				this.$u.toast(res.msg);
				if (res.code == 1) {
					this.is_update = true;
					this.getCouponList();
				}
			});
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onReachBottom() {
		if (this.has_more) {
			this.status = 'loading';
			this.page++;
			this.getCouponList();
		}
	}
};
</script>

<style>
page {
	background: #f4f6f8;
}
</style>
<style lang="scss" scoped>
.coupon-list {
	padding: 30rpx;
	.item {
		background-color: #ffffff;
		margin-bottom: 30rpx;
		border-radius: 10rpx;
		.content {
			padding: 30rpx;
			border-right: 1px dashed #ddd;
			position: relative;
			.left {
				width: 120rpx;
				font-size: 40rpx;
				font-weight: bold;
				color: #e74c3c;
				.small {
					font-size: 15rpx;
				}
			}
			.right {
				max-width: 330rpx;
				width: 330rpx;
				.priorityn {
					margin: 0 5rpx;
				}
			}
			&::before {
				content: '';
				display: block;
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				right: -15rpx;
				top: -15rpx;
				background-color: #f4f6f8;
				border-radius: 100rpx;
			}
			&::after {
				content: '';
				display: block;
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				right: -15rpx;
				bottom: -15rpx;
				background-color: #f4f6f8;
				border-radius: 100rpx;
			}
		}
	}
}
</style>
