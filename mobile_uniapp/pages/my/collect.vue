<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="收藏列表" :border-bottom="false"></fa-navbar>
		<view class="hoter-list u-p-t-30 u-p-l-30 u-p-r-30">
			<view class="item bg-white u-m-b-30" v-for="(item, index) in list" :key="index" @click="goPage('/pages/hotel/detail?id=' + item.source_id)">
				<view class="collect u-flex u-row-center u-col-bottom" @click.stop="collect(item.source_id, index, item.isCollect)">
					<u-icon name="heart-fill" color="#ff393c" size="40"></u-icon>
				</view>
				<view class="images">
					<fa-swiper
						:list="item.house.images"
						:autoplay="false"
						:params="{ id: item.source_id }"
						:height="400"
						mode="none"
						@click="clickSwiper"
					></fa-swiper>
					<view class="title u-line-1 u-font-35" v-text="item.house.name"></view>
				</view>
				<view class="">
					<view class="u-flex u-row-between u-p-20 u-text-right">
						<view class="u-font-35 u-m-b-15">
							<text class="price">￥{{ item.house.price }}/晚</text>
							<text class="market_price u-font-24 u-tips-color">￥{{ item.house.market_price }}/晚</text>
						</view>
						<view class="u-tips-color">{{ item.createtime | date('yyyy-mm-dd') }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 空数据 -->
		<view class="u-u-p-t-80 u-p-b-80" v-if="is_empty"><u-empty text="没有更多的收藏数据了"></u-empty></view>
		<!-- 加载更多 -->
		<view class="u-p-b-30" v-if="list.length"><u-loadmore bg-color="#f4f6f8" :status="has_more ? status : 'nomore'" /></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.collectList();
	},
	data() {
		return {
			type: 0,
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
		clickSwiper(index, item) {
			console.log(index, item);
			this.goPage('/pages/hotel/detail?id=' + item.id);
		},
		collectList() {
			this.$api.collectList({ page: this.page, type: this.type }).then(res => {
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
		},
		collect(id) {
			this.$api.optionCollect({ source_id: id, type: 0 }).then(res => {
				if (res.code) {
					this.$u.toast('取消收藏成功');
					this.is_update = true;
					this.page = 1;
					this.collectList();
				} else {
					this.$u.toast(res.msg);
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
			this.collectList();
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
			z-index: 9999;
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
</style>
