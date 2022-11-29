<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="订单详情" :border-bottom="false"></fa-navbar>
		<view class="">
			<view class="bg-white u-p-30 u-text-center">
				<view class="u-font-40 text-weight" v-text="info.status_text"></view>
				<view class="u-p-t-30 u-p-b-30">
					<text v-if="info.status == 'expired'">订单已超时自动取消，欢迎再次订购</text>
					<text v-if="info.status == 'canceled'">订单已取消，欢迎再次订购</text>
					<text v-if="info.status == 'refunding'">订单已取消，等待后台处理，欢迎下次订购</text>
					<text v-if="info.status == 'paid'">订单已成功支付，欢迎再次订购</text>
					<text v-if="info.status == 'evaluate'">感谢您的光临，请给我们打个分吧</text>
					<text v-if="info.status == 'toshopay'">请及时到店里支付</text>
					<text v-if="info.status == 'finished'">欢迎再次订购</text>
					<text v-if="info.status == 'checkined'">欢迎再次订购</text>
					<text v-if="info.status == 'checkouting'">正则退房中，欢迎再次订购</text>
					<view class="" v-if="info.status == 'created'">
						订单于
						<u-count-down :timestamp="downTime" separator="zh"></u-count-down>
						自动取消，请立即支付。
					</view>
				</view>
				<view class="u-flex u-row-center">
					<view class="" v-if="['created', 'paid', 'toshopay'].indexOf(info.status) != -1">
						<u-button size="medium" @click="show = true">取消</u-button>
					</view>
					<view class="u-m-l-30" v-if="info.status == 'created'">
						<u-button
							size="medium"
							:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
							@click="goPage('/pages/order/payment?id=' + id)"
						>
							立即支付
						</u-button>
					</view>
					<view class="u-m-l-30" v-if="info.status == 'evaluate'">
						<u-button size="medium" type="warning" @click="goPage('/pages/remark/remark?orderid=' + info.orderid)">立即评价</u-button>
					</view>
					<view class="u-m-l-30" v-if="['expired', 'paid', 'canceled', 'refunding', 'finished', 'toshopay','checkined','checkouting'].indexOf(info.status) != -1">
						<u-button
							size="medium"
							:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
							@click="goPage('/pages/hotel/detail?id=' + info.source_id)"
						>
							再次预订
						</u-button>
					</view>
				</view>
			</view>
			<view class="bg-white u-m-t-30 u-p-30">
				<view class="text-weight u-font-30">订单信息：</view>
				<view class="u-m-t-30 u-flex u-row-between">
					<text class="u-tips-color">订单单号</text>
					<text v-text="info.orderid"></text>
				</view>
				<view class="u-m-t-15 u-flex u-row-between">
					<text class="u-tips-color">订单金额</text>
					<text class="price text-weight">￥{{ info.amount }}</text>
				</view>
				<view class="u-m-t-15 u-flex u-row-between">
					<text class="u-tips-color">下单时间</text>
					<text>{{ info.createtime | date('yyyy-mm-dd') }}</text>
				</view>
				<view class="u-m-t-15 u-flex u-row-between">
					<text class="u-tips-color">入住人</text>
					
					<text v-for="(item,index) in info.lodgers" :key="index">{{item.name}}</text>
					
				</view>
				<view class="u-m-t-15 u-flex u-row-between">
					<text class="u-tips-color">联系电话</text>
					
					<text v-for="(item,index) in info.lodgers" :key="index">{{item.mobile}}</text>
					
				</view>
				<view class="u-m-t-15 u-flex u-row-between">
					<text class="u-tips-color">入住时间</text>
					<text class="">
						{{ info.checkin_time | formatMdTime }} - {{ info.leave_time | formatMdTime }} 共 {{ formatDayNum(info.leave_time, info.checkin_time) }} 晚
					</text>
				</view>
			</view>
			<view class="bg-white u-m-t-30 u-p-30">
				<view class="text-weight u-font-30">房屋信息：</view>
				<view class="u-flex bg-white u-m-t-30" @click="goPage('/pages/hotel/detail?id=' + info.source_id)">
					<image class="thumb" :src="info.source_data && info.source_data.images[0]"></image>
					<view class="u-m-l-20 u-flex-1 info">
						<view class="u-line-1 text-weight">{{ info.source_data && info.source_data.name }}</view>
						<view class="u-tips-color">
							<text>{{ info.source_data && info.source_data.type && info.source_data.type.name }}</text>
							<text class="u-m-l-10 u-m-r-10 u-font-40">·</text>
							<text>{{ info.source_data && info.source_data.area }}㎡</text>
							<text class="u-m-l-10 u-m-r-10 u-font-40">·</text>
							<text>宜住{{info.source_data && info.source_data.livenums }}人</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="show" :show-cancel-button="true" content="确定取消订单吗？" @confirm="cancel"></u-modal>
	</view>
</template>

<script>
export default {
	onLoad(e) {
		this.id = e.id || '';
		this.getOrderDetail();
	},
	computed: {
		downTime() {
			let t = new Date().getTime() / 1000 - parseInt(this.info.createtime);
			let tt = parseInt(this.vuex_config.order_timeout) - t;
			return tt < 0 ? 0 : tt;
		}
	},
	data() {
		return {
			id: '',
			info: {},
			show: false
		};
	},
	methods: {
		getOrderDetail() {
			this.$api.orderDetail({ id: this.id }).then(res => {
				if (res.code == 1) {
					this.info = res.data;
				}
			});
		},
		cancel() {
			this.$api.orderCancel({ id: this.id }).then(res => {
				this.$u.toast(res.msg);
				if (res.code == 1) {
					this.$set(this.info, 'status', res.data);
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
.thumb {
	width: 150rpx;
	height: 100rpx;
	border-radius: 10rpx;
}
.info {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100rpx;
	width: 50vw;
}
</style>
