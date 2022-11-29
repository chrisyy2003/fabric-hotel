<template>
	<view>
		<u-popup v-model="value" :popup="false" @close="close" mode="bottom" :closeable="true" border-radius="30">
			<view class="u-text-center u-p-30" style="background: #f4f6f8;">优惠券</view>
			<scroll-view scroll-y="true" :style="[{ height: scrollHeight, background: '#f4f6f8' }]">
				<view class="coupon-list">
					<view class="item u-flex" v-for="(item, index) in list" :key="index">
						<u-badge type="error" v-if="item.num > 1 && mode" :count="item.num"></u-badge>
						<view class="content u-flex-1 u-flex" @click="goPage('/pages/coupon/detail?id=' + item.id)">
							<view class="left">
								<view>
									{{ item.result_data && item.result_data.number }}
									<text class="small">{{ item.result == 1 ? '元' : '折' }}</text>
								</view>
							</view>
							<view class="right">
								<view class="u-font-30 u-m-b-5 u-line-1">{{ item.name }}</view>
								<view class="u-m-b-5 u-tips-color">
									<view class="u-flex">
										订单满
										<text class="priorityn" :style="{ color: theme.bgColor }">{{ item.result_data && item.result_data.money }}元</text>
										{{ item.result == 1 ? '减' : '打' }}
										<text class="priorityn" :style="{ color: theme.bgColor }">
											{{ item.result_data && item.result_data.number }}{{ item.result == 1 ? '元' : '折' }}
										</text>
									</view>
								</view>
								<view class="u-m-b-5 u-font-24 u-tips-color">每人限领{{ item.alone_num }}张</view>
								<view class="u-m-b-10 u-tips-color u-font-24" v-if="item.mode == 'fixation'">领取后{{ item.use_times }}天内有效</view>
								<view class="u-line-1 u-tips-color u-font-24" v-else>{{ item.use_times | formatreceive }}</view>
							</view>
						</view>
						<view class="right-btn u-p-l-30 u-p-r-30" v-if="!mode">
							<block v-if="item.received_num <= 0"><u-button size="mini" :disabled="true" hover-class="none">已领取</u-button></block>
							<block v-else-if="item.expired"><u-button size="mini" :disabled="true" hover-class="none">已过期</u-button></block>
							<block v-else-if="!item.online"><u-button size="mini" hover-class="none">待上架</u-button></block>
							<block v-else>
								<u-button
									size="mini"
									:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
									hover-class="none"
									@click="give(item.id, index)"
								>
									立即领取
								</u-button>
							</block>
						</view>
						<view class="right-btn u-p-l-30 u-p-r-30" v-else>
							<block v-if="item.expired"><u-button size="mini" :disabled="true" hover-class="none">已过期</u-button></block>
							<block v-else-if="!item.allow_use"><u-button size="mini" hover-class="none">未可使用</u-button></block>
							<block v-else-if="coupon.id == item.id">
								<u-button size="mini" :custom-style="{ backgroundColor: '#999', color: '#fff' }" hover-class="none" @click="selectCoupon({})">
									取消优惠
								</u-button>
							</block>
							<block v-else>
								<u-button
									size="mini"
									:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
									hover-class="none"
									@click="selectCoupon(item)"
								>
									立即选择
								</u-button>
							</block>
						</view>
					</view>
				</view>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
export default {
	props: {
		value: {
			type: Boolean,
			default: false
		},
		//模式，0=详情查看领取，1=下单选择
		mode: {
			type: Number,
			default: 0
		},
		//总价格【判断是否达到条件】
		totalPrice: {
			type: [Number, String],
			default: 0
		},
		couponList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	watch: {
		couponList: {
			immediate: true,
			handler(val) {
				if (val) {
					this.list = JSON.parse(JSON.stringify(val));
				}
			}
		}
	},
	computed: {
		scrollHeight() {
			return (this.list.length >= 2 ? 650 : 350) + 'rpx';
		}
	},
	data() {
		return {
			list: [],
			coupon: {}
		};
	},
	methods: {
		close() {
			this.$emit('input', false);
		},
		give(id, index) {
			this.$api.drawCoupon({ id: id }).then(res => {
				this.$u.toast(res.msg);
				if (res.code == 1) {
					this.is_update = true;
					this.$set(this.list[index], 'received_num', this.list[index].received_num - 1);
				}
			});
		},
		selectCoupon(item) {
			if (item && item.result_data && parseInt(item.result_data.money) > 0 && parseInt(item.result_data.money) > parseInt(this.totalPrice)) {
				this.$u.toast('订单未满' + item.result_data.money + '元,无法使用优惠券！');
				return;
			}
			this.coupon = item;
			this.$emit('success', item);
			this.close();
		}
	}
};
</script>

<style lang="scss" scoped>
.coupon-list {
	padding: 30rpx;
	.item {
		background-color: #ffffff;
		border-radius: 10rpx;
		position: relative;
		&:not(:last-child) {
			margin-bottom: 30rpx;
		}
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
