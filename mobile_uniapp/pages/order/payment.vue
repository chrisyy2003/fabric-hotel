<template>
	<view class="u-skeleton">
		<!-- 顶部导航 -->
		<fa-navbar title="订单支付" :border-bottom="false" :backIndex="2"></fa-navbar>
		<view class="u-p-30 u-flex bg-white">
			<image class="thumb u-skeleton-rect" :src="order.image"></image>
			<view class="u-m-l-20 order">
				<view class="u-skeleton-rect u-line-1" v-text="order.source_data && order.source_data.name"></view>
				<view class="u-skeleton-rect u-line-1 u-flex u-tips-color">
					<text>房型:{{order.name}}</text>
					<text class="u-m-l-10 u-m-r-10 u-font-40">·</text>
					<text>面积:{{order.area}}㎡</text>
					<text class="u-m-l-10 u-m-r-10 u-font-40">·</text>
					<text>宜住{{order.livenums}}人</text>
				</view>
				<view class="price u-skeleton-rect">￥{{ this.total }}</view>
			</view>
		</view>

		<!-- 选择支付 -->
		<view class="bg-white u-m-t-30">
			<u-cell-group title="支付方式">
				<u-radio-group v-model="paytype" @change="radioGroupChange">
					<view class="paytype">
						<u-cell-item
							:icon-style="{ color: '#7B68EE' }"
							@click="setPaytype('erc20')"
							:arrow="false"
							hover-class="cell-hover-class"
							icon="lock-opened-fill"
							title="ERC20代币支付"
							:label="'我的余额: ' + balance + ' HotelToken (HTN)'"
						>
							<u-radio slot="right-icon" name="erc20" :active-color="theme.bgColor"></u-radio>
						</u-cell-item>

						<u-cell-item
							:icon-style="{ color: '#20D029' }"
							@click="setPaytype('privacy')"
							:arrow="false"
							icon="lock-fill"
							title="隐私代币支付"
							hover-class="cell-hover-class"
							:label="'我的余额: ' + ptn + ' PrivacyToken (PTN)'"
						>
							<u-radio slot="right-icon" name="privacy" :active-color="theme.bgColor"></u-radio>
						</u-cell-item>

						<!-- #endif -->
					</view>
				</u-radio-group>
			</u-cell-group>
		</view>
		<view class="payment bg-white">
			<u-button type="primary" hover-class="none" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" shape="circle" @click="submit">
				立即支付
			</u-button>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
export default {
	onLoad(e) {
		this.id = e.id || '';
		this.getOrder(),
		this.getbalance()
	},
	data() {
		return {
			paytype: 'erc20',
			id: '',
			order: {},
			balance: 0,
			loading: true, // 是否显示骨架屏组件
			ptn: 0,
			total: 0
		};
	},
	methods: {
		radioGroupChange(e) {
			console.log(e)
			console.log(this.paytype)
			this.paytype = e;
		},

		setPaytype(t){
			console.log(t)
			this.paytype = t
		},
		getpb(){
			this.$api.getpbalance().then(res => {
				this.ptn = res.balance
				return this.ptn
			})
		},
		async getbalance(){
			await this.getpb()
			this.$api.getBalance().then(res => {
				this.balance = res.balance
				return this.balance
			})
			
			// this.$$api.getBalance().then(res => {
			// 	if (res.code) {
			// 		console.log(res.data);	
			// 	}
			// })
		},
		getOrder() {
			this.$api.orderDetail({
				id: this.id,
			}).then(res => {
				if (res.code) {
					this.loading = false;

					this.total = res.data.price
					
					this.order = res.data.house
					console.log(this.order)
				} else {
					this.$u.toast(res.msg)
					setTimeout(() => {
						if (res.data.project_id) {
							this.$u.route('/pages/order/order');
						} else {
							uni.navigateBack({
								delta: 1
							})
						}
					}, 1000)
				}
			})
		},
		// #ifdef MP-WEIXIN
		// submit: async function() {
		// 	let res = await this.$api.orderPay({
		// 		id: this.id,
		// 		paytype: this.paytype,
		// 		method: 'miniapp'
		// 	});
		// 	if (res.data == 'bind') {
		// 		this.$u.route('/pages/login/wxlogin');
		// 		return;
		// 	}
		// 	if (!res.code) {
		// 		this.$u.toast(res.msg);
		// 		return;
		// 	}			
		// 	uni.requestPayment({
		// 		provider: 'wxpay',
		// 		timeStamp: res.data.timeStamp,
		// 		nonceStr: res.data.nonceStr,
		// 		package: res.data.package,
		// 		signType: res.data.signType,
		// 		paySign: res.data.paySign,
		// 		success: rest => {
		// 			this.$u.toast('支付成功！');
		// 			wx.requestSubscribeMessage({
		// 			  tmplIds: this.vuex_config.tpl_ids,
		// 			  complete:(res)=>{
		// 				console.log(res)
		// 				if(res.errMsg == 'requestSubscribeMessage:ok'){
		// 					this.$api.subscribe({tpl_ids:res,orderid:this.order.orderid}).then(res=>{
		// 						console.log(res)
		// 					})
		// 				}
		// 				this.$u.route('/pages/order/houseorder')
		// 			  }
		// 			})					
		// 		},
		// 		fail: err => {
		// 			this.$u.toast('fail:' + JSON.stringify(err));
		// 		}
		// 	});
		// },
		// #endif

		// #ifdef H5
		submit: async function() {

			let data = {
				id: this.id,
				type: this.paytype,
			};

			console.log(this.total);
			console.log(this.balance);
			
			if (parseInt(this.total) > parseInt(this.balance)){
				this.$u.toast('余额不足!!!')
			}else{
				let res = await this.$api.orderPay(data);
				console.log(res)
				this.$u.toast('支付成功！');
				this.$u.route('/pages/order/houseorder')
			}

	
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
	height: 120rpx;
	border-radius: 10rpx;
}

.order {
	height: 120rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 68vw;
}

.paytype {
	width: 100vw;
}

.payment {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 30rpx 80rpx;
}
</style>
