<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="住客信息" :border-bottom="false"></fa-navbar>
		<u-gap height="2" bg-color="#f4f6f8"></u-gap>

		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" :key="item.id" @click="click" @open="open" :options="options">
			<view class="item u-border-bottom">
				<u-checkbox v-model="item.checked" :active-color="theme.bgColor" :name="item.id" @change="checkboxChange" >
					<view class="u-p-l-30">
						<view class="">姓名：{{ item.name }}</view>
						<!-- <view class="u-tips-color">证件号码：{{ item.idnumber }}</view> -->
						<view class="u-tips-color">年龄：{{ item.age }}</view>

					</view>
				</u-checkbox>
			</view>
		</u-swipe-action>
		<!-- 空数据 -->
		<view class="u-p-t-80 u-p-b-80" v-if="!list.length"><u-empty text="暂无住客信息"></u-empty></view>
		<!-- 加载更多 -->
		<view class="u-p-t-30" v-if="list.length"><u-loadmore bg-color="#ffffff" :status="has_more ? status : 'nomore'" /></view>
		<u-gap height="180" bg-color="#ffffff"></u-gap>		
		<view class="u-p-30 u-border-top footer u-flex">
			<view class="confirm u-m-r-15 u-flex-1">
				<u-button type="primary" hover-class="none" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" shape="circle" @click="confirm">
					确定
				</u-button>
			</view>
			<view class="u-flex-1"><u-button type="warning" shape="circle" @click="goPage('/pages/lodger/addoredit')">添加住客</u-button></view>
		</view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
	</view>
</template>

<script>
export default {
	onLoad(e) {
		this.livenums = e.livenums || 0;
		this.selectLodger = JSON.parse(JSON.stringify(this.vuex_lodgerids));
	},
	onShow() {
		if(this.vuex_user.token){
			this.is_update = true;
			this.lodgerList();
		}
	},
	data() {
		return {
			scrollTop: 0,
			list: [],
			page: 1,
			is_update: false,
			livenums:0,
			selectLodger:[],
			status: 'loadmore',
			has_more: false,
		};
	},
	computed: {
		options() {
			return [
				{
					text: '编辑',
					style: {
						backgroundColor: this.theme.bgColor
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			];
		}
	},
	methods: {
		click(index, index1) {
			if (index1 == 1) {
				this.$api.delLodger({ id: this.list[index].id }).then(res => {
					this.$u.toast(res.msg);
					if (res.code == 1) {
						this.list.splice(index, 1);
					}
				});
			} else {
				this.list[index].show = false;
				this.goPage('/pages/lodger/addoredit?id=' + this.list[index].id);
			}
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.list[index].show = true;
			this.list.map((val, idx) => {
				if (index != idx) this.list[idx].show = false;
			});
		},
		lodgerList() {
			this.$api.lodgerList({ page: this.page }).then(res => {
				if (this.is_update) {
					this.list = [];
					this.is_update = false;
				}
				if (res.code == 1) {
					res.data.data.map(item => {
						item.show = false;
						if (this.vuex_lodgerids.indexOf(item.id) != -1) {
							item.checked = true;
						} else {
							item.checked = false;
						}
					});
					this.list = [...this.list, ...res.data.data];
					this.has_more = res.data.current_page < res.data.last_page;
				}
			});
		},
		checkboxChange(e){
			if(e.value){
				if(this.selectLodger.length>=this.livenums && this.selectLodger.length>0){				
					this.list.forEach((item,index)=>{
						if(item.id==this.selectLodger[0]){					
							setTimeout(()=>{
								this.$set(this.list[index],'checked',false);
								this.selectLodger.splice(0,1)
							},100)
						}
					})					
				}
				this.selectLodger.push(e.name);
			}else{
				let index = this.selectLodger.indexOf(e.name);
				index != -1 && this.selectLodger.splice(index,1)
			}			
		},
		confirm() {
			let ids = [];
			this.list.map(item => {				
				if (this.vuex_livenums > 0 && ids.length >= this.vuex_livenums) {					
					return;
				}
				if (item.checked) {
					ids.push(item.id);
				}
			});
			this.$u.vuex('vuex_lodgerids', ids);
			uni.navigateBack({
				delta: 1
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
			this.lodgerList();
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	padding: 20rpx;
}
.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #FFFFFF;
	z-index: 999;
	.confirm {
		// width: 60vw;
	}
}
</style>
