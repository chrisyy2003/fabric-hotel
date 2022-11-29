<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="详情" :border-bottom="false"></fa-navbar>
		<view class="coupon-detail" v-if="info.id">
			<view class="bg-white u-flex u-row-between u-col-center">
				<view class="left">
					<view class="u-p-30">
						<view class="u-flex">
							<view class="">
								{{ info.result == 1 ? '￥' : '打' }}
								<text :style="[{fontSize:'70rpx',fontWeight:'bold',color:theme.bgColor}]">
									{{ info.result_data && info.result_data.number }}
								</text>
								{{ info.result == 1 ? '元' : '折' }}
							</view>
							<view class="u-m-l-30">
								<view class="u-font-40">优惠券</view>
								<view class="u-font-26">COUPON</view>
							</view>
						</view>
						<view class="u-m-t-30">
							<view class="u-border u-p-10 u-font-24" v-if="info.result == 0">
								订单满 <text class="text-weight u-m-l-5 u-m-r-5">{{ info.result_data.money }}</text> 打 
								<text class="text-weight u-m-l-5 u-m-r-5">{{info.result_data.number}}</text> 折
							</view>
							<view class="u-border u-p-10 u-font-24" v-else>
								订单满 <text class="text-weight u-m-l-5 u-m-r-5">{{ info.result_data.money }}</text> 减 
								<text class="text-weight u-m-l-5 u-m-r-5">{{info.result_data.number}}</text> 元
							</view>
						</view>
					</view>
				</view>
				<view class="receive">
					<block v-if="info.is_received"><u-button size="mini" :disabled="true" hover-class="none">已领取</u-button></block>
					<block v-else-if="info.received_num >= info.give_num"><u-button size="mini" :disabled="true" hover-class="none">已被领完</u-button></block>
					<block v-else-if="info.expired && !info.is_received"><u-button size="mini" :disabled="true" hover-class="none">已过期</u-button></block>
					<block v-else-if="!info.online"><u-button size="mini" hover-class="none">待上架</u-button></block>
					<block v-else>
						<u-button size="mini" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" hover-class="none" @click="give">
							立即领取
						</u-button>
					</block>
				</view>
			</view>
			<view class="bg-white u-p-30 u-m-t-30">
				<view class="text-weight">温馨提示：</view>
				<view class="u-m-t-10">
					<text class="u-m-r-10">•</text>
					每人限领{{ info.alone_num }}张
				</view>
				<view class="u-m-t-10">										
					<text class="u-m-r-10">•</text>						
					仅限量{{ info.give_num }}张，赶快领取！									
				</view>
				<view class="u-m-t-10" v-if="info.mode == 'fixation'">
					<text class="u-m-r-10">•</text>
					领取后{{ info.use_times }}天内有效
				</view>
				<view class="u-m-t-10" v-else>
					<text class="u-m-r-10">•</text>
					领取后{{ info.use_times | formatreceive }}
				</view>
			</view>
			<view class="u-m-t-30">
				<view class="u-flex u-row-between u-p-30 bg-white">
					<view>可使用房间</view>
					<view class="" v-if="info.has_all" @click="goPage('/pages/hotel/hotel')">
						更多
						<u-icon name="arrow-right-double"></u-icon>
					</view>
				</view>
				<view class="hoter-list u-p-t-30">
					<view class="item bg-white u-m-b-30" v-for="(item, index) in info.house" :key="index" @click="goPage('/pages/hotel/detail?id=' + item.id)">
						<view class="collect u-flex u-row-center u-col-bottom" @click.stop="collect(item.id, index, item.isCollect)">
							<u-icon :name="!item.isCollect ? 'heart' : 'heart-fill'" :color="!item.isCollect ? '#ffffff' : '#ff393c'" size="40"></u-icon>
						</view>
						<!-- :style="[{background:theme.bgColor}]" -->
						<view class="type_name">{{ item.type_name }}</view>
						<view class="images">
							<fa-swiper :list="item.images" :autoplay="false" :params="{ id: item.id }" :height="400" mode="none" @click="clickSwiper"></fa-swiper>
							<view class="title u-line-1 u-font-35" v-text="item.name"></view>
						</view>
						<view class="">
							<view class="u-p-t-20 u-p-l-20 u-p-r-20 u-flex u-flex-wrap">
								<view class="u-m-r-10 u-m-b-10" v-for="(res, ids) in item.tag_names" :key="ids">
									<u-tag
										:text="res"
										:bg-color="theme.lightColor"
										:border-color="theme.faBorderColor"
										:color="theme.bgColor"
										size="mini"
										mode="light"
									/>
								</view>
							</view>
							<view class="u-flex u-row-between u-p-20 u-text-right">
								<view class="u-font-35 u-m-b-15">
									<text class="price">￥{{ item.house_price }}/晚</text>
									<text class="market_price u-font-24 u-tips-color">￥{{ item.market_price }}/晚</text>
								</view>
								<view class="">
									<u-button
										:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
										hover-class="none"
										throttle-time="0"
										size="mini"
										@click="toBooking(item.id)"
									>
										立即预定
									</u-button>
								</view>
							</view>
						</view>
					</view>
					<!-- 空数据 -->
					<view class="u-p-t-80 u-p-b-80" v-if="!info.house || !info.house.length"><u-empty text="优惠券没有可使用的房间"></u-empty></view>
				</view>
			</view>
		</view>
		<!-- 预订日历 -->
		<view class="" v-if="is_show">
			<fa-calendar
				v-model="value"
				:price="house_info.price"
				:calendar="house_info.calendar"
				:orderCalendar="house_info.order_calendar"
				@confirm="calendarConfirm"
			></fa-calendar>
		</view>
	</view>
</template>

<script>
export default {
	onLoad(e) {
		this.id = e.id || '';
		this.getCouponDetail();
	},
	data() {
		return {
			id: '',
			info: {},
			house_info: {},
			is_show: false,
			value: false
		};
	},
	methods: {
		getCouponDetail() {
			this.$api.couponDetail({ id: this.id }).then(res => {
				if (res.code == 1) {
					this.info = res.data;
				} else {
					this.$u.toast(res.msg);
				}
			});
		},
		clickSwiper(index, item) {
			console.log(index, item);
			this.goPage('/pages/hotel/detail?id=' + item.id);
		},
		collect(id, index, status) {
			this.$api.optionCollect({ source_id: id, type: 0 }).then(res => {
				if (res.code) {
					if (status) {
						this.$u.toast('取消收藏成功');
						this.$set(this.info.house[index], 'isCollect', 0);
					} else {
						this.$u.toast('添加收藏成功');
						this.$set(this.info.house[index], 'isCollect', 1);
					}
				} else {
					this.$u.toast(res.msg);
				}
			});
		},
		toBooking(id) {
			this.$api.houseDetail({ id: id }).then(res => {
				if (res.code == 1) {
					this.house_info = res.data;
					this.is_show = true;
					setTimeout(() => {
						this.value = true;
					}, 100);
				} else {
					this.$u.toast(res.msg);
				}
			});
		},
		calendarConfirm(e, dom) {
			if (JSON.stringify(e) == '{}') {
				this.$u.toast('请选择入住和离店日期');
				return;
			}
			if (!dom) {
				return;
			}
			this.goPage('/pages/hotel/booking?id=' + this.house_info.id + '&start_time=' + e.start + '&end_time=' + e.end);
		},
		give() {
			this.$api.drawCoupon({ id: this.info.id }).then(res => {
				this.$u.toast(res.msg);
				if (res.code == 1) {
					this.is_update = true;
					this.getCouponDetail();
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
</style>

<style lang="scss" scoped>
.coupon-detail {
	padding: 30rpx;
	.left {
		flex: 1;
		margin-right: 30rpx;
		border-right: 1px dashed #ddd;
		position: relative;
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
	.receive {
		width: 170rpx;
	}
	.number {
		font-size: 50rpx;
		font-weight: bold;
	}
	.hoter-list {
		border-radius: 10rpx;
		.item {
			position: relative;
			.collect {
				background: rgba($color: #000000, $alpha: 0.2);
				border-radius: 200rpx;
				position: absolute;
				right: 30rpx;
				top: 20rpx;
				padding: 10rpx;
				z-index: 99;
			}
			.type_name {
				position: absolute;
				left: 30rpx;
				top: 0rpx;
				padding: 10rpx 10rpx 20rpx;
				z-index: 99;
				color: #ffffff;
				background-image: url(../../static/image/label.png);
				background-size: 100% 100%;
				font-size: 20rpx;
				// border-bottom-left-radius: 12rpx;
				// border-bottom-right-radius: 12rpx;
			}
			.images {
				position: relative;
				.title {
					color: #ffffff;
					width: 100%;
					position: absolute;
					left: 0rpx;
					bottom: 0rpx;
					padding: 20rpx 10rpx;
					background: rgba($color: #000000, $alpha: 0.4);
				}
			}

			.price {
				font-weight: bold;
			}
			.market_price {
				text-decoration: line-through;
				margin-left: 10rpx;
			}
		}
	}
}
</style>
