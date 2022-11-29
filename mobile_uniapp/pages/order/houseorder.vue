<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="房间订单" :border-bottom="false"></fa-navbar>
		<view class="wrap">
			<view class="u-m-b-20">
				<!-- #ifndef MP-BAIDU -->
				<u-tabs :activeColor="theme.bgColor" :list="list" :current="current" @change="change" :is-scroll="true"></u-tabs>
				<!-- #endif -->
				<!-- #ifdef MP-BAIDU -->
				<fa-u-tabs :activeColor="theme.bgColor" :list="list" :current="current" @change="change" :is-scroll="true"></fa-u-tabs>
				<!-- #endif -->
			</view>
			<view
				class="order bg-white u-p-30 "
				:class="{ 'u-m-t-20': index != 0 }"
				v-for="(item, index) in orderList"
				:key="index"
				
			>
				<view class="top u-p-b-30 u-flex u-row-between">
					<view class="u-font-30 text-weight u-line-1 title" v-text="item.house.name"></view>
					<view class="status u-text-right">
						<u-tag v-if="item.status == 'created'" text="待支付" type="error" shape="circle" />
						<u-tag v-if="item.status == 'paid'" text="待入住" type="success" shape="circle" />
						<u-tag v-if="item.status == 'expired'" text="已失效" type="info" shape="circle" />
						<u-tag v-if="item.status == 'canceled'" text="已取消" type="info" shape="circle" />
						<u-tag v-if="item.status == 'refunding'" text="退款中" type="error" shape="circle" />
						<u-tag v-if="item.status == 'evaluate'" text="待评价" type="warning" shape="circle" />
						<u-tag v-if="item.status == 'finished'" text="已完成" type="success" shape="circle" />
						<u-tag v-if="item.status == 'toshopay'" text="到店付" type="success" shape="circle" />
						<u-tag v-if="item.status == 'checkined'" text="已入住" type="success" shape="circle" />
						<u-tag v-if="item.status == 'checkouting'" text="退房中" type="error" shape="circle" />
					</view>
				</view>
				<view class="house">
					<fa-swiper :autoplay="false" :list="[item.house.image]" height="350" :params="{ id: item.id }" @click="clickSwiper"></fa-swiper>
					<view class="times u-flex u-row-between u-p-20">
						<!-- <view class="">
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
						</view> -->
						<view class=""></view>
						<view class=""></view>
						<view class="">
							<view class="u-font-24">订单总价</view>
							<view class="text-weight">￥{{ item.price }}</view>
						</view>
					</view>
				</view>
				
				<view class="bar u-p-t-30 u-flex u-row-between">
					<!-- <view class="">
						<view class="u-m-l-15" v-if="!item.subscribe">
							<u-button type="primary" size="mim" @click="subscribeMessage(item.orderid,index)">订阅消息</u-button>
						</view>
					</view> -->
					<view class="u-flex u-row-right u-flex-1">
						<view class="u-m-l-15" v-if="['待付款', '待入住'].indexOf(item.status) != -1">
							<u-button type="default" size="mim" @click="cancel(item.id, index)">取消订单</u-button>
						</view>
						<view class="u-m-l-15" v-if="item.status == '待付款'">
							<u-button
								type="primary"
								:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
								size="mim"
								@click="goPage('/pages/order/payment?id=' + item.orderno)"
							>
								立即支付
							</u-button>
						</view>
						<view class="u-m-l-15" v-if="item.status == '已支付'">
							<u-button type="warning" size="mim" @click="goPage('/pages/remark/remark?orderid=' + item.orderno)">立即评论</u-button>
						</view>
						<view class="u-m-l-15" v-if="['expired', 'canceled', 'refunding', 'evaluate', '已评论', 'toshopay','checkouting','checkined'].indexOf(item.status) != -1">
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
		</view>
		<u-modal v-model="show" :show-cancel-button="true" content="确定取消订单吗？" @confirm="confirm"></u-modal>
		<!-- 空数据 -->
		<view class="u-p-t-80 u-p-b-80" v-if="is_empty"><u-empty text="没有更多的订单数据了"></u-empty></view>
		<!-- 加载更多 -->
		<view class="u-p-b-30 u-p-t-30" v-if="orderList.length"><u-loadmore bg-color="#f4f6f8" :status="has_more ? status : 'nomore'" /></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderList: [],
			list: [
				{
					name: '全部订单',
					status: ''
				},
				{
					name: '待付款',
					status: 'created'
				},
				{
					name: '已付款',
					status: 'paid'
				},
				{
					name: '待评价',
					status: 'evaluate'
				},
				{
					name: '已失效',
					status: 'expired'
				},
				{
					name: '已取消',
					status: 'canceled'
				}
			],
			current: 0,
			status: 'loadmore',
			page: 1,
			show: false,
			cancel_id: '',
			cancel_index: '',
			is_update: false,
			scrollTop: 0,
			has_more: false,
			is_empty:false
		};
	},
	onLoad(e) {
		this.current = e.status || 0;
		this.getOrderList();
	},
	onShow() {
		if (this.orderList.length) {
			this.is_update = true;
			this.getOrderList();
		}
	},
	methods: {
		// #endif
		// 页面数据
		getOrderList() {
			this.$api.orderList({ page: this.page, status: this.list[this.current].status }).then(res => {
				if (res.code) {
					// if (this.is_update) {
					// 	this.orderList = [];
					// 	this.is_update = false;
					// }
					// this.orderList = [...this.orderList, ...res.data.data];
					this.orderList = res.data
					
					console.log(res.data)


					// this.has_more = res.data.current_page < res.data.last_page;
					// this.is_empty = !this.orderList.length;
				}
			});
		},
		// tab栏切换
		change(index) {
			this.current = index;
			this.is_update = true;
			this.getOrderList();
		},
		clickSwiper(index, item) {
			console.log(index, item);
			// this.goPage('/pages/order/housedetail?id=' + item.id);
		},
		//取消订单
		cancel(id, index) {
			this.cancel_id = id;
			this.cancel_index = index;
			this.show = true;
		},
		confirm() {
			this.$api.orderCancel({ id: this.cancel_id }).then(res => {
				this.$u.toast(res.msg);
				if (res.code == 1) {
					this.$set(this.orderList[this.cancel_index], 'status', res.data);
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
	
}
</style>
