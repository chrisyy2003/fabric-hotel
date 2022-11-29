<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="一键退房" :border-bottom="false"></fa-navbar>
		<view class="wrap">
			<view
				class="order bg-white u-p-30 "
				:class="{ 'u-m-t-20': index != 0 }"
				v-for="(item, index) in orderList"
				:key="index"
				@click="goPage('/pages/order/housedetail?id=' + item.id)"
			>
				<view class="top u-p-b-30 u-flex u-row-between">
					<view class="u-font-30 text-weight u-line-1 title" v-text="item.house.name"></view>
					<view class="status u-text-right"><u-tag text="已入住" type="success" shape="circle" /></view>
				</view>
				<view class="house">
					<fa-swiper :autoplay="false" :list="item.house.images" height="350" :params="{ id: item.id }" @click="clickSwiper"></fa-swiper>
					<view class="times u-flex u-row-between u-p-20">
						<view class="">
							<view class="">{{ item.checkin_time | formatMdTime }}</view>
							<view class="">{{ item.checkin_time | formatWeek }} {{ item.house.checkin_time | formatTimes }}</view>
						</view>
						<view class="">
							<view class="u-p-b-5 u-p-l-20 u-p-r-20 right-arrow">共{{ formatDayNum(item.leave_time, item.checkin_time) }}晚</view>
							<view class=""></view>
						</view>
						<view class="">
							<view class="">{{ item.leave_time | formatMdTime }}</view>
							<view class="">{{ item.leave_time | formatWeek }} {{ item.house.checkout_time | formatTimes }}</view>
						</view>
						<view class=""></view>
						<view class=""></view>
						<view class="">
							<view class="u-font-24">订单总价</view>
							<view class="text-weight">￥{{ item.amount }}</view>
						</view>
					</view>
				</view>
				<view class="bar u-p-t-30 u-flex u-row-right">
					<view class="u-m-l-15"><u-button type="warning" size="mim" @click="checkout(item.id)">我要退房</u-button></view>
					<view class="u-m-l-15">
						<u-button
							type="primary"
							:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
							size="mim"
							@click="goPage('/pages/hotel/detail?id=' + item.house.id)"
						>
							再次预订
						</u-button>
					</view>
				</view>
			</view>
		</view>
		<!-- 空数据 -->
		<view class="u-p-t-80 u-p-b-80" v-if="is_empty"><u-empty></u-empty></view>
		<!-- 加载更多 -->
		<view class="u-p-b-30 u-p-t-30" v-if="orderList.length"><u-loadmore bg-color="#f4f6f8" :status="has_more ? status : 'nomore'" /></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
		<u-modal v-model="show" :show-cancel-button="true" @confirm="confirm" content="确认需要退房吗？"></u-modal>
	</view>
</template>

<script>
export default {
	onLoad() {
		//未登录时，未渲染完，从登录后返回，返回按钮未渲染
		let that = this;
		this.$nextTick(function(){
			that.getOrderList();
		})
	},
	onShow() {		
		//未登录时，返回再返回
		if(!this.vuex_user.token && this.is_one){
			uni.navigateBack({
				delta:1
			})
		}else if(this.vuex_user.token && this.is_one){
			this.getOrderList();
		}
		this.is_one = true;
	},
	data() {
		return {
			is_one:false,
			orderList: [],
			page: 1,
			scrollTop: 0,
			has_more: false,
			status: 'loadmore',
			is_empty: false,
			show: false,
			order_id: ''
		};
	},
	methods: {
		// 页面数据
		getOrderList() {
			this.$api.orderList({ page: this.page, status: 'checkined' }).then(res => {
				this.status = 'loadmore';
				if (res.code) {
					if (this.is_update) {
						this.orderList = [];
						this.is_update = false;
					}
					this.orderList = [...this.orderList, ...res.data.data];
					this.has_more = res.data.current_page < res.data.last_page;
					this.is_empty = !this.orderList.length;
				}
			});
		},
		clickSwiper(index, item) {		
			this.goPage('/pages/order/housedetail?id=' + item.id);
		},
		//退房
		checkout(id) {
			this.order_id = id;
			this.show = true;
		},
		confirm(){
			this.$api.orderCheckout({ id: this.order_id }).then(res => {
				this.$u.toast(res.msg);
				if (res.code == 1) {
					setTimeout(() => {
						this.is_update = true;
						this.page = 1;
						this.getOrderList();
					}, 1000);
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
			this.getOrderList();
		}
	}
};
</script>

<style>
page {
	height: 100%;
	background-color: #f4f6f8;
}
</style>

<style lang="scss" scoped>
.order {
	.top {
		.title{
			width: 100%;
		}
		.status {
			width: 200rpx;
		}
	}
	.house {
		position: relative;
		.times {
			position: absolute;
			width: 100%;
			background: rgba($color: #000000, $alpha: 0.5);
			left: 0;
			bottom: 0;
			color: #ffffff;
			.right-arrow {
				position: relative;
				border-bottom: 2rpx solid #ffffff;
				&::after {
					content: '';
					width: 0;
					height: 0;
					display: block;
					position: absolute;
					right: -10rpx;
					bottom: -10rpx;
					border-top: 10rpx transparent dashed;
					border-right: 10rpx transparent dashed;
					border-bottom: 10rpx transparent dashed;
					overflow: hidden;
					border-left: 10rpx #ffffff solid;
				}
			}
		}
	}
	.u-size-mim {
		display: inline-flex;
		width: auto;
		font-size: 26rpx;
		height: 55rpx;
		line-height: 55rpx;
		padding: 0 45rpx;
	}
}
</style>
