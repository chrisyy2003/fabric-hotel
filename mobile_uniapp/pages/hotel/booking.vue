<template>
	<view class="">
		<!-- 顶部导航 -->
		<fa-navbar title="提交订单" :border-bottom="false"></fa-navbar>
		<view class="u-skeleton">
			<view class="u-flex bg-white u-m-30 u-p-30 detail">
				<image class="u-skeleton-rect thumb" :src="info.image" mode="aspectFill"></image>
				<view class="u-skeleton-rect info u-p-l-30">
					<view class="text-weight u-flex-1 u-line-2" v-text="info.name"></view>
					<view class="u-tips-color u-flex">
						<text>{{ info.area }}㎡</text>
						<text class="u-m-l-10 u-m-r-10 u-font-40">·</text>
						<text>宜住{{ info.livenums }}人</text>
					</view>
				</view>
			</view>
			<view class="bg-white u-m-30 u-p-l-15 u-p-r-15 u-skeleton-rect">
				<u-form ref="uForm">
					<u-form-item :label-position="labelPosition" label="入住日期" prop="start_end_time" label-width="130">
						<u-input type="select" v-model="start_end_time" @click="value = true" />
					</u-form-item>
					<u-form-item :label-position="labelPosition" label="住客信息" prop="code" label-width="130">
						<u-checkbox-group @change="checkboxGroupChange">
							<u-checkbox :active-color="theme.bgColor" @change="checkboxChange" v-model="item.checked" v-for="(item, index) in lodgerList" :key="index" :name="item.id">
								{{ item.name }}
							</u-checkbox>
						</u-checkbox-group>

						<u-button
							slot="right"
							type="success"
							:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
							size="mini"
							@click="
								is_update = true;
								goPage('/pages/lodger/lodger?livenums='+info.livenums);
							"
						>
							添加/选择
						</u-button>
					</u-form-item>
				</u-form>
			</view>
			<view class="bg-white u-m-30 u-p-30 u-skeleton-rect">
				<view class="u-flex u-col-center u-row-between" :class="{'u-p-b-20':info.coupon && info.coupon.length>0}">
					<view class="u-font-30 u-tips-color">房间费用</view>
					<view class="prices u-text-right">
						<text class="price text-weight u-font-35">￥{{ houseTotalPrice }}</text>
						<text class="u-tips-color u-font-24">共 {{ calendar.day || 0 }} 晚</text>
					</view>
				</view>
				<view class="u-tips-color u-border-top u-p-t-20 u-flex u-row-between" v-if="info.coupon && info.coupon.length>0">
					<view class="">
						优惠券
					</view>
					<view class="" @click="show_coupon=true">
						<text class="">{{coupon.id?coupon.name:'请选择'}}</text>
						<text class="u-tips-color u-m-l-5 u-m-r-10 price" v-if="coupon_price>0">(优惠:￥{{coupon_price}})</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="foot-bar" v-if="!loading">
				<view class="u-flex u-row-between">
					<view class="u-flex u-col-center">
						<text class="u-tips-color">总价:</text>
						<text class="price u-font-35">￥{{ totalPrice }}</text>						
					</view>
					<view class="u-flex">
						<u-button :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" hover-class="none" size="medium" @click="submit">提交订单</u-button>
					</view>
				</view>
			</view>
			<!--引用组件-->
			<view class="" v-if="!loading">
				<fa-calendar
					v-model="value"
					:price="info.price"
					:calendar="info.calendar"
					:orderCalendar="info.order_calendar"
					:startTime="start_time"
					:endTime="end_time"
					@confirm="calendarConfirm"
				></fa-calendar>
			</view>
			<fa-coupon v-model="show_coupon" :couponList="info.coupon" :mode="1" :totalPrice="totalPrice" @success="success"></fa-coupon>
			<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
			<u-top-tips ref="uTips" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
		</view>
	</view>
</template>

<script>
export default {
	onLoad(e) {
		this.id = e.id || '';
		this.start_time = e.start_time || '';
		this.end_time = e.end_time || '';
		this.getHouseBooking();
	},
	onShow() {
		if (this.is_update) {
			this.getHouseBooking();
		}
	},
	computed:{		
		houseTotalPrice(){
			return this.calendar.amount ? this.calendar.amount : this.info.price;
		},
		totalPrice(){
			if(!this.houseTotalPrice){
				return 0;
			}
			let price = parseFloat(this.houseTotalPrice)
			if(this.coupon.id){
				if(this.coupon.result==1){//减金额
					price = price-this.coupon.result_data.number;
				}else{//折扣
					price = price*this.coupon.result_data.number/10;
				}
			}
			return price.toFixed(2);
		},
		coupon_price(){
			return (this.houseTotalPrice - this.totalPrice)
		},
	},
	data() {
		return {
			// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
			statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
			// 导航栏内容区域高度，不包括状态栏高度在内
			navbarHeight: 44,
			id: '',
			start_time: '',
			end_time: '',
			start_end_time: '',
			info: {},
			loading: true,
			value: false,
			is_update: false,
			labelPosition: 'left',
			lodger_ids: [],
			lodgerList: [],
			calendar: {},
			show_coupon: false,
			coupon:{}
		};
	},
	watch: {
		end_time(newValue, oldValue) {
			this.start_end_time = this.formatTime(this.start_time) + '入住 - ' + this.formatTime(newValue) + '离店';
		}
	},
	methods: {
		formatTime(val) {
			let arr = val.split('-');
			return arr[1] + '月' + arr[2] + '日';
		},
		getHouseBooking() {
			this.$api
				.houseBooking({
					id: this.id,
					start_time: this.start_time,
					end_time: this.end_time
				})
				.then(res => {
					if (res.code == 1) {						
						this.info = res.data.detail;
						this.$u.vuex('vuex_livenums', this.info.livenums);
						console.log(res.data)
						res.data.lodger.map(item => {
							if (this.vuex_lodgerids.indexOf(item.id) != -1) {
								item.checked = true;
							} else {
								item.checked = false;
							}
						});
						this.lodgerList = res.data.lodger;
						console.log('@@@',this.lodgerList)
						this.loading = false;
						this.lodger_ids = this.vuex_lodgerids;
					} else {
						this.$u.toast(res.msg);
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1000);
					}
				});
		},		
		//选择优惠券
		success(item){
			this.coupon = item;
		},
		//入住日期选择
		calendarConfirm(e) {
			console.log(e);
			this.start_time = e.start;
			this.end_time = e.end;
			this.calendar = e;
		},
		//住客信息选择
		checkboxGroupChange(e) {			
			this.$u.vuex('vuex_lodgerids', this.lodger_ids);
		},
		checkboxChange(e){
			if(e.value){
				if(this.lodger_ids.length>=this.info.livenums && this.lodger_ids.length>0){
					this.lodgerList.forEach((item,index)=>{
						if(item.id==this.lodger_ids[0]){					
							setTimeout(()=>{
								this.$set(this.lodgerList[index],'checked',false);
								this.lodger_ids.splice(0,1)
							},100)
						}
					})					
				}
				this.lodger_ids.push(e.name)
			}else{
				let index = this.lodger_ids.indexOf(e.name);
				index != -1 && this.lodger_ids.splice(index,1)
			}
		},
		submit() {
			if (this.lodger_ids.length > this.info.livenums) {
				this.$u.toast('不能超过' + this.info.livenums + '人居住');
				return;
			}

		
			this.$api
				.addOrder({
					id: this.id,
					start_time: this.start_time,
					end_time: this.end_time,
					user_coupon_id:this.coupon.user_coupon_id || '',
					lodger_ids: this.lodger_ids,
					price: this.houseTotalPrice,
					
				})
				.then(res => {
					if (res.code) {
						this.$u.toast(res.msg);
						if (res.data){
							console.log(res.data)
							setTimeout(() => {
								this.goPage('/pages/order/payment?id=' + res.data);
							}, 1000);
						}
						
					} else {
						this.$u.toast(res.msg)
						// this.$refs.uTips.show({
						// 	title: res.msg,
						// 	type: 'error',
						// 	duration: '5000'
						// });
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
.detail {
	border-radius: 10rpx;
	.thumb {
		width: 150rpx;
		height: 140rpx;
		border-radius: 10rpx;
	}
	.info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 130rpx;
		width: 65vw;
	}
}
.prices {
	display: flex;
	flex-direction: column;
}
.foot-bar {
	background-color: #ffffff;
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	padding: 20rpx 15rpx;
	border-top: 1rpx solid #f4f6f8;
	.select-calendar {
		background-color: #f4f6f8;
		padding: 15rpx;
	}
}
</style>
