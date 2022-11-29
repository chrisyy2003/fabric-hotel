<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="首页" :border-bottom="false"></fa-navbar>
		<u-swiper :list="vuex_config.swiper" border-radius="0" :title="true" :height="400" @click="openPage"></u-swiper>
		<view class="index-content u-p-30 u-skeleton" :style="[indexStyle]">
			<view class="notice" v-if="notice.length">

				<!-- 通知组件 -->
				<u-notice-bar
					mode="horizontal"
					border-radius="10"
					:duration="3000"
					:is-circular="false"
					:color="theme.bgColor"
					:bg-color="theme.lightColor"
					:list="notice"
					@click="click"
				></u-notice-bar>
			</view>
			<view class="u-m-t-30 bg-white u-p-15 u-flex grid">
				<u-image
					class="u-skeleton-fillet"
					width="200rpx"
					height="200rpx"
					:src="vuex_store.images && vuex_store.images.length > 0 && vuex_store.images[0]"
					@click="goPage('/pages/store/detail?id=' + vuex_store.id)"
				></u-image>


				<view class="u-m-l-20 content" @click="goPage('/pages/store/detail?id=' + vuex_store.id)">
					<view class="text-weight u-skeleton-fillet" v-text="vuex_store.name"></view>
					<view class="u-content-color u-skeleton-fillet">
						<u-icon name="phone"></u-icon>
						<text class="u-m-l-10">{{ vuex_store.phone ? vuex_store.phone : '' }}</text>
					</view>
					<view class="u-content-color u-skeleton-fillet" v-if="vuex_store.distance">
						距离:{{ vuex_store.distance ? vuex_store.distance.toFixed(2) : 0 }}km
					</view>
					<view class="u-tips-color u-font-24 u-skeleton-fillet">
						<u-icon name="map"></u-icon>
						{{ vuex_store.address ? vuex_store.address : '' }}
					</view>
				</view>
				<!-- <view class="u-m-l-15" v-if="vuex_store.is_more == true" @click="goPage('/pages/store/cutlist')">
					<u-icon color="#838383" name="qiehuan" size="60" custom-prefix="custom-icon"></u-icon>
				</view> -->
			</view>
			<view class="u-m-t-30 grid">
				<u-button type="primary" @click="goPage('/pages/hotel/hotel')">立即预定</u-button>
				<!-- <u-grid :col="3">
					<u-grid-item v-for="(item, index) in vuex_config.navigate" :key="index" @click="grids(item)">
						<u-icon :name="item.image" :size="item.size"></u-icon>
						<view class="u-m-t-20">{{ item.name }}</view>
					</u-grid-item>
				</u-grid> -->
			</view>			
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
import uButton from '../../uview-ui/components/u-button/u-button.vue';
export default {
  components: { uButton },
	data() {
		return {
			loading: true
		};
	},
	async onShow() {
		if (!this.vuex_store.id) {
			await this.getDefaultStore();
			this.loading = false;
		} else {
			this.loading = false;
		}
	},
	computed: {
		notice() {
			let arr = [];
			if (this.vuex_config.notice) {
				this.vuex_config.notice.map(item => {
					arr.push(item.title);
				});
			}
			return arr;
		},
		indexStyle() {
			let style = {};
			if (this.notice.length > 0) {
				style.top = '-60rpx';
			} else {
				style.top = '-30rpx';
			}
			return style;
		}
	},
	methods: {
		grids(e) {
			let path = e.path;
			if (path == '/' || !path) {
				return;
			}
			if (path.substr(0, 1) == 'p') {
				path = '/' + path;
			}
			if (path.indexOf('http') != -1) {
				this.$u.vuex('vuex_webs', {
					path: e.path,
					title: e.name
				});
				this.$u.route('/pages/webview/webview');
				return;
			}
			// #ifdef APP-PLUS
			path = path.replace(/map/, 'nmap');
			// #endif
			this.$u.route(path);
		},
		openPage(index) {
			this.grids({
				path: this.vuex_config.swiper[index].path,
				name: this.vuex_config.swiper[index].name
			});
		},
		click(index) {
			if (this.vuex_config.notice) {
				let url = this.vuex_config.notice[index].path;
				if (url) {
					this.grids({
						path: url,
						name: this.vuex_config.notice[index].title
					});
				}
			}
		}
	},
	onPageScroll(e) {},
	//下拉刷新
	onPullDownRefresh() {},
	onReachBottom() {}
};
</script>

<style lang="scss">
page {
	background-color: #f4f6f8;
}
</style>
<style lang="scss" scoped>
.index-content {
	position: relative;
	.notice,
	.grid {
		box-shadow: 0px 1px 2px 0px rgba(55, 68, 134, 0.15);
		.content {
			flex: 1;
			height: 200rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
}
</style>
