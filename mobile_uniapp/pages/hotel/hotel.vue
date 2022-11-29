<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar :title="store_name" :border-bottom="false"></fa-navbar>
		<view class="u-p-20 bg-white u-flex u-col-center">
			<view class="u-flex-1"><fa-search :mode="2" @search="search"></fa-search></view>
			<view class="u-p-l-15 u-p-r-5 u-flex u-col-center"><fa-orderby-select @change="change"></fa-orderby-select></view>
		</view>
		<view class="hoter-list u-p-t-30 u-p-l-30 u-p-r-30">
			<view class="item bg-white u-m-b-30" v-for="(item, index) in list" :key="index" @click="goPage('/pages/hotel/detail?id=' + item.id)">
				<!-- 收藏 -->
				<!-- <view class="collect u-flex u-row-center u-col-bottom" @click.stop="collect(item.id, index, item.isCollect)">
					<u-icon :name="!item.isCollect ? 'heart' : 'heart-fill'" :color="!item.isCollect ? '#ffffff' : '#ff393c'" size="40"></u-icon>
				</view> -->
				<!-- :style="[{background:theme.bgColor}]" -->
				<!-- <view class="type_name">{{ item.type_name }}</view> -->
				<view class="images">
					<fa-swiper :list="[item.image]" :autoplay="false" :params="{ id: item.id }" :height="400" mode="none" @click="clickSwiper"></fa-swiper>
					<view class="title u-line-1 u-font-35" v-text="item.name"></view>
				</view>
				<view class="">
					<view class="u-p-t-20 u-p-l-20 u-p-r-20 u-flex u-flex-wrap">
						<view class="u-m-r-10 u-m-b-10" v-for="(res, ids) in item.tag" :key="ids">
							<u-tag :text="res" :bg-color="theme.lightColor" :border-color="theme.faBorderColor" :color="theme.bgColor" size="mini" mode="light" />
						</view>
					</view>
					<view class="u-flex u-row-between u-p-20 u-text-right">
						<view class="u-font-35 u-m-b-15">
							<text class="price">￥{{ item.market_price }}/晚</text>
							<text class="market_price u-font-24 u-tips-color">￥{{ item.house_price }}/晚</text>
						</view>
						<view class="">
							<u-button
								:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
								hover-class="none"
								throttle-time="0"
								size="mini"
								@click="toBooking(item.id)"
							>
								立即预定
							</u-button>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 预订日历 -->
		<view class="" v-if="is_show">
			<fa-calendar v-model="value" :price="info.price" :calendar="info.calendar" :orderCalendar="info.order_calendar" @confirm="calendarConfirm"></fa-calendar>
		</view>
		<!-- 空数据 -->
		<view class="u-p-t-80 u-p-b-80" v-if="!list.length"><u-empty text="暂无房间可预订"></u-empty></view>
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
	onLoad(e) {
		this.store_id = e.store_id || '';
		this.store_name = e.store_name || '列表';
		this.getHouseList();
	},
	watch: {
		value(newValue, oldValue) {
			if (!newValue) {
				this.is_show = false;
			}
		}
	},
	data() {
		return {
			store_id: '',
			store_name: '列表',
			list: [],
			page: 1,			
			barwidth: 40,
			current: 0,			
			calendar: '',
			calendarText: '',		
			status: 'loadmore',
			has_more: false,
			scrollTop: 0,
			is_update: false,
			//筛选，排序
			keyword: '',
			query:{},
			// 预订
			value: false,
			is_show: false,
			info: {
				price: 0,
				calendar: [],
				order_calendar: []
			}
		};
	},
	methods: {		
		clickSwiper(index, item) {
			this.goPage('/pages/hotel/detail?id=' + item.id);
		},
		//搜索
		search(value) {
			this.keyword = value;
			this.reloads();
		},
		//刷新数据
		reloads() {
			this.page = 1;
			this.is_update = true;
			this.getHouseList();
		},
		//排序，筛选
		change(query){
			this.query = query;
			this.reloads();
		},
		getHouseList() {
			let data = { 
				page: this.page, 
				calendar: this.calendar, 
				store_id: this.store_id ,
				keyword:this.keyword,
				...this.query
			};
			this.$api.houseList(data).then(res => {
				this.status = 'loadmore';
				if (res.code == 1) {
					if (this.is_update) {
						this.list = [];
						this.is_update = false;
					}
					this.list = [...this.list, ...res.data.data];
					this.has_more = res.data.current_page < res.data.last_page;
				} else {
					this.$u.toast(res.msg);
				}
			});
		},
		collect(id, index, status) {
			this.$api.optionCollect({ source_id: id, type: 0 }).then(res => {
				if (res.code) {
					if (status) {
						this.$u.toast('取消收藏成功');
						this.$set(this.list[index], 'isCollect', 0);
					} else {
						this.$u.toast('添加收藏成功');
						this.$set(this.list[index], 'isCollect', 1);
					}
				} else {
					this.$u.toast(res.msg);
				}
			});
		},
		toBooking(id) {
			this.$api.houseDetail({ id: id }).then(res => {
				if (res.code == 1) {
					this.info = res.data;
					this.is_show = true;
					setTimeout(() => {
						this.value = true;
					}, 100);
				} else {
					this.$u.toast(res.msg);
				}
			});
		},
		calendarConfirm(e, dom) {
			if (JSON.stringify(e) == '{}') {
				this.$u.toast('请选择入住和离店日期');
				return;
			}
			if (!dom) {
				return;
			}
			this.goPage('/pages/hotel/booking?id=' + this.info.id + '&start_time=' + e.start + '&end_time=' + e.end);
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onReachBottom() {
		if (this.has_more) {
			this.status = 'loading';
			this.page++;
			this.getHouseList();
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
.hotel-tabs {
	width: 82vw;
}
.hotel {
	.more {
		height: 80rpx;
		line-height: 75rpx;
		border-left: 1px solid rgba(55, 68, 134, 0.1);
	}
}
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
			z-index: 99;
		}
		.type_name {
			position: absolute;
			left: 30rpx;
			top: 0rpx;
			padding: 10rpx 10rpx 20rpx;
			z-index: 99;
			color: #ffffff;
			background-image: url(../../static/image/label.png);
			background-size: 100% 100%;
			font-size: 20rpx;
			// border-bottom-left-radius: 12rpx;
			// border-bottom-right-radius: 12rpx;
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
