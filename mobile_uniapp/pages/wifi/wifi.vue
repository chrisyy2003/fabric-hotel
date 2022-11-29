<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="一键WiFi" :border-bottom="false"></fa-navbar>
		<view class="wifi-list">
			<view class="item u-flex u-row-between u-col-center" v-for="(item, index) in wifiList" :key="index">
				<view class="u-flex">
					<view class="wifi u-flex u-row-center u-col-center" :style="[{ background: theme.bgColor }]"><u-icon name="wifi" color="#ffffff"></u-icon></view>
					<view class="title u-m-l-20">
						<view class="">{{ item.SSID }}</view>						
						<view class="u-flex u-col-center">
							信号:
							<view class="signal u-m-l-10">
								<view class="item-s" v-for="i in 5" :style="[{background:item.signalStrength>(i*2-2)*10?'#18bc9c':'rgba(0, 0, 0, 0.3)'}]"></view>
							</view>
						</view>						
					</view>
				</view>
				<view class="">
					<u-button
						v-if="wifi[item.SSID]"
						type="primary"
						:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
						size="mini"
						@click="concatWifi(item)"
					>
						{{ item.connect ? '已连接' : '一键连接' }}
					</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	async onLoad() {
		let that = this;
		let res = await this.$api.wifiList();
		if (res.code == 1 && res.data.wifi) {
			let wifi = res.data.wifi.split(',');
			wifi.forEach((item, index) => {
				if (index % 2 == 0) {
					this.wifi[item] = wifi[index + 1];
				}
			});
		}
		console.log(this.wifi);
		// #ifdef MP-WEIXIN
		wx.startWifi({
			success(res) {
				wx.onGetWifiList(async function(res) {
					console.log(res);
					let row = await that.getConnected();
					res.wifiList.map(item => {
						item.connect = false;
					});
					that.wifiList = res.wifiList;
				});
				wx.getWifiList({
					success: function(res) {
						console.log(res);
					}
				});
			},
			fail(res) {
				console.log(res.errMsg);
			}
		});
		// #endif
	},
	data() {
		return {
			wifiList: [{
				BSSID: "88:c3:97:e7:9d:ae",
				SSID: "Xiaomi_9DAD",
				connect: false,
				frequency: 2412,
				secure: true,
				signalStrength: 99
			}],
			wifi: {}
		};
	},
	methods: {
		getConnected() {
			return new Promise((resolve, reject) => {
				wx.getConnectedWifi({
					success(res) {
						console.log(res, 123);
						resolve(res);
					},
					fail() {
						resolve({});
					}
				});
			});
		},
		concatWifi(item) {
			// #ifdef MP-WEIXIN
			let that = this;
			wx.connectWifi({
				SSID: item.SSID,
				password: this.wifi[item.SSID],
				success(res) {
					console.log(res.errMsg);
					item.connect = true;
					that.$u.toast('连接成功！');
				},
				fail(res) {
					console.log(res);
					that.$u.toast('连接失败！');
				}
			});
			// wx.setWifiList({
			// 	wifiList: [
			// 		{
			// 			SSID: item.SSID,
			// 			BSSID: item.BSSID,
			// 			password: this.wifi[item.SSID]
			// 		}
			// 	]
			// });
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>

.wifi-list {
	.item {
		padding: 30rpx;
		border-bottom: 1px solid #f4f6f8;

		.wifi {
			border-radius: 100rpx;
			width: 50rpx;
			height: 50rpx;
		}
		.signal {
			position: relative;
			height: 30rpx;
			.item-s {
				width: 5rpx;
				position: absolute;
				bottom: 0;
				border-radius: 10rpx;	
				@for $i from 1 through 5 {
					&:nth-child(#{$i}) {
						height: $i*5+rpx;
						left: $i*8+rpx;
					}
				}		
			}
		}
	}
}

</style>
