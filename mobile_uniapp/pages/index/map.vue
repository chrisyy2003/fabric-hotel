<template>
	<view class="">
		<view class="map-view">
			<fa-navbar :title="title" :border-bottom="false"></fa-navbar>
			<map
				id="hotelMap"
				:scale="18"
				@markertap="markers"
				class="map"				
				:show-location="true"
				:enable-rotate="true"
				:latitude="vuex_store.latitude"
				:longitude="vuex_store.longitude"
				:markers="covers"
				@regionchange="regionchange"
			></map>
		</view>		
		<cover-view class="foot-select">
			<cover-view class="item" :class="{ active: word == '交通' }" @click="word = '交通'">交通</cover-view>
			<!-- <cover-view class="item" :class="{ active: word == '医疗' }" @click="word = '医疗'">医疗</cover-view> -->
			<cover-view class="item" :class="{ active: word == '商场' }" @click="word = '商场'">商场</cover-view>
			<cover-view class="item" :class="{ active: word == '便利店' }" @click="word = '便利店'">便利店</cover-view>
			<cover-view class="item" :class="{ active: word == '餐饮' }" @click="word = '餐饮'">餐饮</cover-view>
			<cover-view class="item" :class="{ active: word == '景点' }" @click="word = '景点'">景点</cover-view>
		</cover-view>
		<textarea class="footer-text" v-model="keyword" placeholder="请输入关键词" />
		<cover-view class="footer-option" @click="search">搜索</cover-view>
	</view>
</template>

<script>
export default {
	onLoad(e) {
		this.word = e.word || '交通';
		this.title = e.word || '交通';
	},
	async onReady() {
		this.map = uni.createMapContext('hotelMap');		
		if(!this.vuex_store.id){
			await this.getDefaultStore();
		}
	},
	data() {
		return {
			map: null,
			covers: [],
			lsCovers: [],
			circles: [],
			store:[],
			keyword: '',
			title: '交通',
			word: '',
			allpage: 1,
			page: 1,
			markerId:0
		};
	},
	watch: {
		word(newValue, oldValue) {
			if (newValue) {
				this.render(newValue);
			}
		}
	},
	methods: {
		search() {
			if (!this.keyword) {
				this.$u.toast('请输入关键词');
				return;
			}			
			this.render(this.keyword,1);
		},
		goSearch(keyword,type) {
			this.$api
				.mapSearch({
					page: this.page,
					keyword: keyword,
					latitude: this.vuex_store.latitude,
					longitude: this.vuex_store.longitude
				})
				.then(res => {
					if(res.code==1){
						this.allpage = Math.ceil(res.data.count / 20);
						res.data.data.map((item, index) => {						
							this.lsCovers.push({
								id: this.markerId,
								latitude: item.location.lat,
								longitude: item.location.lng,
								address: item.address,
								callout: {
									content: item.title,
									padding: 10,
									borderRadius: 5,
									bgColor:this.theme.bgColor,
									color:this.theme.color,
									display: 'ALWAYS'
								}
							});
							//是搜索，且第一个则移动
							if(type==1 && this.markerId==1){
								this.map.moveToLocation({
									latitude: item.location.lat,
									longitude: item.location.lng
								})
							}
							this.markerId++;
						});
						if (this.allpage > this.page && this.page < 2) {
							this.page++;
							this.goSearch(keyword,type);
						} else {
							this.covers = this.lsCovers;
						}
					}else{
						this.$u.toast(res.msg)
					}
				});
		},
		//先渲染门店标记
		render(word,type){
			this.page = 1;
			this.markerId = 0;
			this.lsCovers = [];			
			this.lsCovers.push({
				id: this.markerId,
				latitude: this.vuex_store.latitude,
				longitude: this.vuex_store.longitude,				
				iconPath: '../../static/map.png',
				address:this.vuex_store.address,
				callout: {
					content: this.vuex_store.name,
					padding: 10,
					borderRadius: 5	,
					bgColor:'#F24E4E',
					color:this.theme.color,
					display: 'ALWAYS'
				}
			});
			this.markerId++;						
			this.goSearch(word,type)
		},
		//标记点 点击
		markers(e) {			
			let markerId = e.detail.markerId;	
			if(!this.covers[markerId] || !this.covers[markerId].latitude){
				return;
			}
			uni.openLocation({
				latitude: this.covers[markerId].latitude,
				longitude: this.covers[markerId].longitude,
				name: this.covers[markerId].callout.content,
				address: this.covers[markerId].address,
				success: function() {
					console.log('success');
				}
			});
		},
		regionchange(e){
			
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
.map-view {
	height: 100vh;
	display: flex;
	flex-direction: column;
	.map {
		flex: 1;
		width: 100%;
	}
}
.footer-text,
.footer-option,
.foot-select {
	position: fixed;
	height: 80rpx;
	border: 1px solid #2b85e4;
	box-sizing: border-box;
}
.footer-text,
.footer-option {
	background-color: #ffffff;
	bottom: 80rpx;
}
.foot-select {
	bottom: 180rpx;
	width: 80vw;
	left: 10vw;
	display: flex;
	justify-content: space-between;
	background-color: #ffffff;
	padding: 10rpx 20rpx;
	.item {		
		color: #999;
		text-align: center;
		line-height: 60rpx;
		&.active {
			color: #dd6161;
			font-weight: bold;
		}
	}
}
.footer-text {
	width: 60vw;
	left: 10vw;
	padding: 20rpx 10rpx;
}
.footer-option {	
	padding: 10rpx;
	width: 17vw;
	right: 10vw;
	text-align: center;
	line-height: 60rpx;
}
</style>
