<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="门店列表" :border-bottom="false"></fa-navbar>
		<view class="store-list">
			<view class="u-flex item u-border-bottom" v-for="(item, index) in list" :key="index" @click="goPage('/pages/store/detail?id=' + item.id)">
				<u-image :src="item.image" width="230" height="200"></u-image>
				<view class="u-flex-1 u-m-l-20 content">
					<view class="text-weight u-font-30" v-text="item.name"></view>
					<view class="u-flex address">
						<u-icon name="map"></u-icon>
						<view class="u-m-l-10 u-line-2">{{ item.address }}</view>
					</view>
					<view class="u-flex u-row-between">
						<view class="u-tips-color">
							<u-icon name="phone"></u-icon>
							<text class="u-m-l-10">{{ item.phone }}</text>
						</view>
						<text v-if="item.distance" :style="[{ color: theme.bgColor }]">{{item.distance?(item.distance).toFixed(2):0}}km</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 空数据 -->
		<view class="u-u-p-t-80 u-p-b-80" v-if="is_empty"><u-empty></u-empty></view>
		<!-- 加载更多 -->
		<view class="u-p-b-30 u-p-t-30" v-if="list.length"><u-loadmore bg-color="#ffffff" :status="has_more ? status : 'nomore'" /></view>
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
			is_empty:false
		};
	},
	methods: {
		getStoreList() {
			this.$api.storeList({ 
				page: this.page, 
				latitude: this.vuex_location.latitude, 
				longitude: this.vuex_location.longitude ,
			}).then(res => {
				this.status = 'loadmore';
				if (res.code == 1) {
					if (this.is_update) {
						this.list = [];
						this.is_update = false;
					}
					this.list = [...this.list, ...res.data.data];
					this.has_more = res.data.current_page < res.data.last_page;
					this.is_empty = !this.list.length;
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

<style lang="scss" scoped>
.store-list {
	.item {
		padding: 30rpx;
		.address {
			margin-top: -30rpx;
		}
	}
	.content {
		width: 50vw;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
}
</style>
