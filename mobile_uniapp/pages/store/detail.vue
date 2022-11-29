<template>
	<view class="u-skeleton">
		<!-- 顶部导航 -->
		<fa-navbar title="门店详情" :border-bottom="false"></fa-navbar>
		<view class="u-skeleton-rect"><u-swiper border-radius="0" :list="info.images" :height="400"></u-swiper></view>
		<view class="u-p-30 bg-white">
			<view class="u-p-b-30 u-font-30 text-weight u-skeleton-rect">{{ info.name }}</view>
			<view class="u-p-t-30 u-p-b-30 u-border-top u-tips-color u-font-24 u-skeleton-rect" @click="openMap">
				<u-icon name="map"></u-icon>
				<text class="u-m-l-10">{{ info.address }}</text>
			</view>
			<view class="u-p-t-30 u-border-top u-font-30 text-weight">简介</view>
			<view class="u-p-t-15 u-p-b-30 u-skeleton-rect">{{ info.intro }}</view>
			<view class="u-p-t-30 u-border-top u-font-30 text-weight">详情</view>
			<view class="u-p-t-15 u-skeleton-rect"><u-parse :html="info.content"></u-parse></view>
		</view>

		<view class="u-flex u-row-center u-border-top footer bg-white">
			<u-button
				:custom-style="{ backgroundColor: theme.bgColor, color: theme.color,width:'80vw' }"
				hover-class="none"
				size="medium"
				shape="circle"
				type="primary"
				@click="goPage('/pages/hotel/hotel?store_id=' + id+'&store_name='+info.name)"
			>
				立即预定
			</u-button>
		</view>

		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
// #ifdef H5
import { weixinShare } from '@/common/fa.weixin.mixin.js';
// #endif
export default {
	mixins: [
		// #ifdef H5
		weixinShare
		// #endif
	],
	onLoad(e) {
		this.id = e.id || '';
		this.getStoreDetail();
	},
	data() {
		return {
			id: '',
			info: {},
			loading: true // 是否显示骨架屏组件
		};
	},
	methods: {
		getStoreDetail() {
			this.$api.storeDetail({ id: this.id }).then(res => {
				if (res.code == 1) {
					this.info = res.data;
					this.loading = false;
					
					// #ifdef MP-WEIXIN
					this.$u.mpShare = {
						title: this.info.name, // 默认为小程序名称，可自定义
						path: '/pages/store/detail?id='+this.id, // 默认为当前页面路径，一般无需修改，QQ小程序不支持
						imageUrl: this.info && this.info.images.length>0?this.info.images[0]:''
					};					
					// #endif
					// #ifdef H5
					if (this.$util.isWeiXinBrowser()) {
						this.wxShare({
							title: this.info.name,
							desc: this.info.intro,
							link: window.location.href,
							img: this.info && this.info.images.length>0?this.info.images[0]:''
						});
					}
					// #endif
				}
			});
		},
		openMap(){
			uni.openLocation({
				latitude: parseFloat(this.info.latitude),
				longitude: parseFloat(this.info.longitude),
				name: this.info.name,
				address: this.info.address,
				success: function() {
					console.log('success');
				},
				complete(res) {
					console.log(res);
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
.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	padding: 30rpx;
	width: 100%;
	box-shadow: 0px -1px 3px 0px rgba(0, 10, 63, 0.05);
}
</style>
