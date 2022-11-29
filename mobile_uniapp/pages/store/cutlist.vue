<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="选择门店" :border-bottom="false"></fa-navbar>
		<view class="store-list">
			<u-radio-group v-model="value" @change="radioGroupChange">
				<u-radio :active-color="theme.bgColor" v-for="(item, index) in list" :key="index" :name="item.id">
					<view class="u-flex u-border-bottom u-p-b-30 u-p-t-30">
						<u-image width="150rpx" height="150rpx" :src="item.image"></u-image>
						<view class="item u-flex-1 u-m-l-15">
							<view class="text-weight">{{ item.name }}</view>
							<view class="u-p-t-10 " v-if="item.distance" :style="[{ color: theme.bgColor }]">距离：{{ item.distance ? item.distance.toFixed(2) : 0 }}km</view>
							<view class="u-font-24 u-p-t-10">
								<u-icon name="map"></u-icon>
								{{ item.address }}
							</view>
						</view>
					</view>
				</u-radio>
			</u-radio-group>
		</view>

		<!-- 空数据 -->
		<view class="u-u-p-t-80 u-p-b-80" v-if="!list.length"><u-empty></u-empty></view>
		<!-- 加载更多 -->
		<view class="u-p-b-30 u-p-t-30" v-if="list.length"><u-loadmore bg-color="#ffffff" :status="has_more ? status : 'nomore'" /></view>
		<u-gap height="120" bg-color="#fff"></u-gap>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.getStoreList();
	},
	data() {
		return {
			list: [],
			page: 1,
			status: 'loadmore',
			has_more: false,
			scrollTop: 0,
			is_update: false,
			value: ''
		};
	},
	methods: {
		radioGroupChange(e) {
			this.$api.cutStore({
					store_id: e
				}).then(res => {
					this.$u.toast(res.msg);
					if (res.code == 1) {
						setTimeout(() => {
							this.$u.route({
								type: 'back'
							});
						}, 1000);
					}
				});
		},
		getStoreList() {
			this.$api.storeList({
					page: this.page,
					latitude: this.vuex_location.latitude,
					longitude: this.vuex_location.longitude
				}).then(res => {
					this.status = 'loadmore';
					if (res.code == 1) {
						if (this.is_update) {
							this.list = [];
							this.is_update = false;
						}
						this.list = [...this.list, ...res.data.data];
						this.has_more = res.data.current_page < res.data.last_page;
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
			this.getStoreList();
		}
	}
};
</script>

<style>
page {
	background-color: #ffffff;
}
</style>
<style lang="scss" scoped>
.store-list {
	padding: 0 30rpx;
	.item {
		height: 150rpx;
		width: 65vw;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		line-height: 35rpx;
	}
}
.footer {
	position: fixed;
	padding: 20rpx 40rpx;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 999;
}
</style>
