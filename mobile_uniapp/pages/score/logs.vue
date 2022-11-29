<template>
	<view class="">
		<!-- 顶部导航 -->
		<fa-navbar title="积分日志"></fa-navbar>
		<!-- 内容 -->
		<view class="u-p-t-30 u-p-l-30 u-p-r-30" v-for="(item, index) in list" :key="index">
			<view class="fa-cell">
				<u-cell-item
					center
					:title="(item.score < 0 ? '' : '+') + item.score"
					:title-style="item.titleColor"
					:label="item.createtime"
					:value-style="item.valueColor"
					:value="item.memo"
					:arrow="false"
				></u-cell-item>
			</view>
		</view>
		<!-- 加载更多 -->
		<view class="u-p-t-30 u-p-b-30" v-if="list.length"><u-loadmore bg-color="#f4f6f8" :status="has_more ? status : 'nomore'" /></view>
		<!-- 空数据 -->
		<view class="fa-empty" v-if="is_empty"><u-empty></u-empty></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{color:theme.bgColor}" :custom-style="{backgroundColor:theme.lightColor}"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.getScoreLogs();
	},
	data() {
		return {
			scrollTop: 0,
			list: [],
			status: 'loadmore',
			has_more: false,
			is_empty:false,
			page: 1
		};
	},
	methods: {
		getScoreLogs: async function() {
			let res = await this.$api.scoreLogs({ page: this.page });
			this.status = 'loadmore';
			if (!res.code) {
				this.$u.toast(res.msg);
				return;
			}
			let data = res.data.data;
			if(!data || !data.length){
				return;
			}
			data.forEach(item => {
				item.titleColor = { fontSize: '40rpx', color: item.score < 0 ? '#fb8080' : this.theme ? this.theme.bgColor : '#2979ff' };
				item.valueColor = { color: item.score < 0 ? '#fb8080' : '#999999' };
			});
			this.list = this.list.concat(data);
			this.has_more = res.data.last_page > res.data.current_page;
			this.is_empty = !this.list.length;
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onReachBottom() {
		if (this.has_more) {
			this.status = 'loading';
			this.page++;
			this.getScoreLogs();
		}
	}
};
</script>

<style>
page {
	background-color: #f4f6f8;
}
.fa-cell {
	background-color: #FFFFFF;
	box-shadow: 0px 0px 3px 0px rgba(0, 78, 255, 0.1);
	border-radius: 10rpx;
}
</style>
