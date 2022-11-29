<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="签到日志"></fa-navbar>
		<view class="u-p-30 ">
			<view class="u-flex u-col-center u-row-around u-p-30 u-m-b-20 bg-white" v-for="(item,index) in list" :key="index">
				<view class="">{{item.type}}</view>
				<view class="">连续签到{{item.successions}}天</view>				
				<view class="">{{item.createtime}}</view>
			</view>
		</view>
		<!-- 加载更多 -->
		<view class="u-p-b-30" v-if="list.length"><u-loadmore bg-color="#f4f6f8" :status="has_more ? status : 'nomore'" /></view>
		<!-- 空数据 -->
		<view class="fa-empty" v-if="!list.length"><u-empty></u-empty></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{color:theme.bgColor}" :custom-style="{backgroundColor:theme.lightColor}"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.signLog();
	},
	data() {
		return {
			scrollTop: 0,
			list: [],
			status: 'loadmore',
			has_more: false,
			page: 1
		};
	},
	methods: {
		signLog(){
			this.$api.signLog({page:this.page}).then(res=>{
				this.status = 'loadmore';
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				}			
				this.list = this.list.concat(res.data.data);
				this.has_more = res.data.last_page > res.data.current_page;
			})
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onReachBottom() {
		if (this.has_more) {
			this.status = 'loading';
			this.page++;
			this.signLog();
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f4f6f8;
}
</style>
