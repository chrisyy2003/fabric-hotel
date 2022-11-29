<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="积分兑换"></fa-navbar>
		<!-- 搜索 -->
		<view class="u-p-20 u-bg-white"><fa-search :mode="2" @search="search"></fa-search></view>
		<view class="">
			<u-dropdown :active-color="theme.bgColor">
				<u-dropdown-item v-model="type" title="筛选" :options="options1" @change="change1"></u-dropdown-item>
				<u-dropdown-item v-model="value2" title="排序" :options="options2" @change="change2"></u-dropdown-item>
			</u-dropdown>
		</view>

		<view class="fa-list-item u-border-top" v-for="(item, index) in list" :key="index">
			<view class="fa-item-image"><image :src="item.image" mode="aspectFill"></image></view>
			<view class="">
				<view class="u-font-30 text-weight">
					<text class="u-line-2">{{ item.title }}</text>
				</view>
				<view class="u-line-3 u-m-t-10 u-tips-color">{{ item.description }}</view>
				<view class="u-flex u-col-center u-row-between u-m-t-20">
					<view>
						积分:
						<text class="text-weight price u-font-30">{{ item.score }}</text>
					</view>
					<view class="">
						<u-button
							size="mini"
							:custom-style="{ backgroundColor: theme.bgColor, color: theme.color, width: '20vw' }"
							shape="circle"
							@click="toExchange(item)"
						>
							立即兑换
						</u-button>
					</view>
				</view>
			</view>
		</view>
		<!-- 填写信息 -->
		<u-popup v-model="show" mode="center" :height="form.type != 'reality' ? '450' : '770'" width="80%" border-radius="10">
			<view class="u-p-30 u-flex u-flex-column u-row-between">
				<view class="" style="width: 90%;">
					<u-form :model="form" ref="uForm">
						<block v-if="form.type != 'virtual'">
							<u-form-item label="姓名:" :required="true"><u-input v-model="form.receiver" placeholder="请填写姓名" /></u-form-item>
							<u-form-item label="电话:" :required="true"><u-input v-model="form.mobile" placeholder="请填写联系电话" /></u-form-item>
							<u-form-item label="地址:" :required="true"><u-input v-model="form.address" placeholder="请填写地址" /></u-form-item>
						</block>
						<u-form-item label="备注:"><u-input type="textarea" v-model="form.memo" placeholder="请填写备注" /></u-form-item>
						<u-form-item label="数量:">
							<view class=""><u-number-box v-model="form.nums"></u-number-box></view>
						</u-form-item>
					</u-form>
				</view>
				<view class="u-flex u-p-t-40 u-p-b-10 u-row-center">
					<u-button :custom-style="{ backgroundColor: theme.bgColor, color: theme.color, width: '60vw' }" shape="circle" size="medium" @click="submit">
						立即提交
					</u-button>
				</view>
			</view>
		</u-popup>
		<fa-add-my :custom-style="{ backgroundColor: theme.lightColor }">
			<view class="u-text-center u-font-22" :style="[{ color: theme.bgColor }]">
				<view class="">我的</view>
				<view class="">兑换</view>
			</view>
		</fa-add-my>
		<!-- 加载更多 -->
		<view class="u-p-t-30 u-p-b-30 u-border-top" v-if="list.length"><u-loadmore bg-color="#ffffff" :status="has_more ? status : 'nomore'" /></view>
		<!-- 空数据 -->
		<view class="fa-empty" v-if="is_empty"><u-empty></u-empty></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.getExchangeList();
	},
	data() {
		return {
			orderby: 'weigh',
			orderway: 'desc',
			value2: 'weigh_desc',
			type: '',
			keyword: '',
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
					label: '默认排序',
					value: 'weigh_desc'
				},
				{
					label: '积分升序',
					value: 'score_asc'
				},
				{
					label: '积分降序',
					value: 'score_desc'
				},
				{
					label: '销量升序',
					value: 'sales_asc'
				},
				{
					label: '销量降序',
					value: 'sales_desc'
				}
			],
			show: false,
			form: {
				type: 'reality',
				receiver: '',
				mobile: '',
				address: '',
				nums: 1,
				exchange_id: '',
				memo: ''
			},
			scrollTop: 0,
			list: [],
			status: 'loadmore',
			has_more: false,
			is_empty: false,
			is_update: false,
			page: 1
		};
	},
	methods: {
		change1(value) {
			this.is_update = true;
			this.getExchangeList();
		},
		change2(e) {		
			let [orderby,orderway] = e.split('_');
			this.orderby = orderby || 'weigh';
			this.orderway = orderway || 'desc';
			this.is_update = true;
			this.getExchangeList();
		},
		search(e) {
			this.keyword = e;
			this.is_update = true;
			this.getExchangeList();
		},
		toExchange(item) {
			this.show = true;
			this.form.exchange_id = item.id;
			this.form.type = item.type;
			this.form.memo = '';
		},
		getExchangeList() {
			this.$api
				.exchangeList({
					page: this.pgae,
					orderby: this.orderby,
					orderway: this.orderway,
					type: this.type,
					keyword: this.keyword
				})
				.then(res => {
					if (this.is_update) {
						this.is_update = false;
						this.list = [];
					}
					this.list = [...this.list, ...res.data.data];
					this.has_more = res.data.current_page < res.data.last_page;
					this.is_empty = !this.list.length;
				});
		},
		submit() {
			if (this.form.type == 'reality') {
				if (!this.form.receiver) {
					this.$u.toast('请填写姓名！');
					return;
				}
				if (!this.$u.test.mobile(this.form.mobile)) {
					this.$u.toast('手机号码格式不正确！');
					return;
				}
				if (!this.form.address) {
					this.$u.toast('请填写地址！');
					return;
				}
			}
			this.$api.exchange(this.form).then(res => {
				this.$u.toast(res.msg);
				this.show = false;
				if (res.code == 1) {
					setTimeout(() => {
						this.goPage('/pages/score/order');
					}, 1500);
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
			this.getExchangeList();
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
}
.u-flex-column {
	flex-direction: column;
	height: 100%;
}
</style>
