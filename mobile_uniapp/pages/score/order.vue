<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="兑换记录" :border-bottom="false"></fa-navbar>
		<view class="">
			<u-dropdown :active-color="theme.bgColor">
				<u-dropdown-item v-model="type" title="订单类型" @change="change1" :options="options1"></u-dropdown-item>
				<u-dropdown-item v-model="status" title="订单状态" @change="change2" :options="options2"></u-dropdown-item>
			</u-dropdown>
		</view>
		<view class="list u-border-top">
			<view class="fa-list-item u-border-bottom" v-for="(item, index) in list" :key="index">
				<view class="fa-item-image"><image :src="item.exchange && item.exchange.image" mode="aspectFill"></image></view>
				<view class="u-line-3 u-font-30 u-m-b-15 u-m-t-15 text-weight">{{ item.exchange && item.exchange.title }}</view>
				<view class="u-flex u-row-between u-col-center">
					<view class="u-flex">
						<view class="u-m-r-10">
							<u-tag
								:text="item.status_text"
								:type="item.status == 'rejected' ? 'error' : item.status == 'created' || item.status == 'inprogress' ? 'warning ' : 'success'"
							/>
						</view>
						<view class="" v-if="item.status == 'rejected'">
							<u-button size="mini" @click="looks(item)">
								<u-icon name="info-circle"></u-icon>
								<text class="u-m-l-5">拒绝原因</text>
							</u-button>
						</view>
						<view class="" v-if="item.type == 'reality' && (item.status == 'delivered' || item.status == 'completed')">
							<u-button size="mini" @click="looks(item)">
								<u-icon name="info-circle"></u-icon>
								<text class="u-m-l-5">快递信息</text>
							</u-button>
						</view>
					</view>
					<view class="u-tips-color">兑换时间：{{ item.createtime | date('yyyy-mm-dd hh:MM') }}</view>
				</view>			
			</view>
		</view>
		<u-modal v-model="show" :title="title">
			<view class="slot-content u-p-30 u-tips-color"><rich-text :nodes="content"></rich-text></view>
		</u-modal>
		<!-- 加载更多 -->
		<view class="u-p-t-30 u-p-b-30 u-border-top" v-if="list.length"><u-loadmore bg-color="#ffffff" :status="has_more ? status : 'nomore'" /></view>
		<!-- 空数据 -->
		<view class="fa-empty" v-if="is_empty"><u-empty text="您没有兑换记录哦..."></u-empty></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.getOrderList();
	},
	data() {
		return {
			scrollTop: 0,
			list: [],
			status: 'loadmore',
			has_more: false,
			is_empty: false,
			is_update: false,
			page: 1,
			list: [],
			type: '',
			status: '',
			options1: [
				{
					label: '全部',
					value: ''
				},
				{
					label: '实物',
					value: 'reality'
				},
				{
					label: '虚拟',
					value: 'virtual'
				}
			],
			options2: [
				{
					label: '全部',
					value: ''
				},
				{
					label: '待兑换',
					value: 'created'
				},
				{
					label: '处理中',
					value: 'inprogress'
				},
				{
					label: '已拒绝',
					value: 'rejected'
				},
				{
					label: '已发货',
					value: 'delivered'
				},
				{
					label: '已完成',
					value: 'completed'
				}
			],
			show:false,
			title:'',
			content:''
		};
	},
	methods: {
		change1(value) {
			this.type = value;
			this.is_update = true;
			this.getOrderList();
		},
		change2(value) {
			this.status = value;
			this.is_update = true;
			this.getOrderList();
		},
		looks(item){
			this.show = true;
			if(item.status=='rejected'){
				this.title = '拒绝原因';
				this.content = `<div style="text-align:center;">${item.reason || '未填写'}</div>`;
			}else{
				this.title = '快递信息';
				this.content = `
				<div>
					<div>快递名称：${item.expressname}</div>
					<div>快递单号：${item.expressno}</div>
				</div>`;
			}
		},
		getOrderList() {
			this.$api.myExchange({ page: this.page, type: this.type, status: this.status }).then(res => {
				if (res.code == 1) {
					if (this.is_update) {
						this.is_update = false;
						this.list = [];
					}
					this.list = [...this.list, ...res.data.data];
					this.is_empty = !this.list.length;
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
			this.getOrderList();
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}
</style>
<style lang="scss" scoped>
.list {
	background: #ffffff;
	.fa-list-item {
		color: #333;
		padding: 30rpx;
		.fa-item-image {
			image {
				width: 100%;
				flex: 0 0 120rpx;
				height: 350rpx;
				border-radius: 10rpx;
			}
		}
		.fa-content {
		}
	}
}
.fa-empty {
	padding: 15vh 0;
}
</style>
