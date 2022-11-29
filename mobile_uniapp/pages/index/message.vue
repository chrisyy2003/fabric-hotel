<template>
	<view class="message">
		<!-- 顶部导航 -->
		<view class="">
			<fa-navbar title="一键吐槽" :border-bottom="false"></fa-navbar>
			<view class="u-p-t-30 u-p-l-30 u-p-r-30">
				<view class="u-p-b-20" style="overflow: hidden;">
					<u-checkbox-group @change="checkboxGroupChange">
						<view class="u-flex u-flex-wrap">
							<view class="u-flex" style="width: 50%;" v-for="(item, index) in tagList" :key="index">
								<u-checkbox :active-color="theme.bgColor" v-model="item.checked" :name="item.id">{{ item.name }}</u-checkbox>
							</view>
						</view>
					</u-checkbox-group>
				</view>
				<u-input v-model="content" type="textarea" :border="true" />
				<view class="u-p-t-15">
					<u-upload
						width="150"
						height="150"
						ref="upload"
						max-count="9"
						:header="header"
						:form-data="formData"
						:action="vuex_config.upload && vuex_config.upload.uploadurl"
						@on-uploaded="onuploaded"
						@on-remove="onremove"
					></u-upload>
				</view>
			</view>
			<view class="u-p-30">
				<u-button shape="square" hover-class="none" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" @click="submit">吐槽</u-button>
			</view>
		</view>
		<view class="u-flex-1 scroll-page">
			<scroll-view scroll-y="true" class="">
				<view class="comment" v-for="(res, index) in list" :key="index">
					<view class="left"><image :src="vuex_user.avatar" mode="aspectFill"></image></view>
					<view class="right">
						<view class="top">
							<view class="name" :style="[{ color: theme.bgColor }]">{{ vuex_user.nickname }}</view>
						</view>
						<view class="u-flex u-flex-wrap">
							<view class="u-m-r-10 u-m-b-10" v-for="(it, ids) in res.tag_names" :key="it">
								<u-tag :text="it" :color="theme.bgColor" :border-color="theme.faBorderColor" :bg-color="theme.lightColor" size="mini" mode="light" />
							</view>
						</view>
						<view class="content u-p-b-10">{{ res.content }}</view>
						<view class="u-flex u-flex-wrap">
							<view class="thumb" v-for="(item, idx) in res.images"><image @click="previewImage(idx,res.images)" :src="item" mode="aspectFill"></image></view>
						</view>
						<view class="reply-box">
							<view class="item" v-for="(item, index) in res.replay" :key="index">
								<view class="username">{{ (item.manage && item.manage.nickname) || '匿名' }}</view>
								<view class="text">{{ item.content }}</view>
							</view>
						</view>
						<view class="bottom">{{ res.createtime | timeFrom }}</view>
					</view>
				</view>
				<!-- 空数据 -->
				<view class="u-p-t-80" v-if="!list.length"><u-empty></u-empty></view>
				<!-- 加载更多 -->
				<view class="u-p-t-30" v-if="list.length"><u-loadmore bg-color="#fff" :status="has_more ? status : 'nomore'" /></view>
			</scroll-view>
		</view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
	</view>
</template>

<script>
export default {
	onLoad() {
		//未登录时，未渲染完，从登录后返回，返回按钮未渲染
		let that = this;
		this.$nextTick(function(){
			that.getTeasingTag();
			that.getTeasingList();
		})
	},
	onShow() {	
		//未登录时，返回再返回
		if(!this.vuex_user.token && this.is_one){
			uni.navigateBack({
				delta:1
			})
		}else if(this.vuex_user.token && !this.list.length && this.is_one){
			this.getTeasingList();
		}
		this.is_one = true;
	},
	computed: {
		header() {
			return {
				token: this.vuex_token || '',
				uid: this.vuex_user.id || 0
			};
		},
		formData() {
			if (this.vuex_config.upload && this.vuex_config.upload.multipart) {
				let isObj = this.$u.test.object(this.vuex_config.upload.multipart);
				if (isObj) {
					return this.vuex_config.upload.multipart;
				}
			}
			return {};
		}
	},
	data() {
		return {
			is_one:false,
			content: '',
			images: [],
			teasing_ids: '',
			tagList: [],
			value: 'orange',
			list: [],
			is_update: false,
			has_more: false,
			status: 'loadmore',
			scrollTop: 0,
			page: 1
		};
	},
	methods: {
		checkboxGroupChange(e) {
			this.teasing_ids = e;
		},
		//上传图片
		onuploaded(e) {
			this.images = [];
			e.map(item => {
				if (item.response.code == 1) {
					this.images.push(item.response.data.url);
				}
			});
		},
		//移除图片
		onremove(index, lists) {
			this.images = [];
			lists.map(item => {
				if (item.response.code == 1) {
					this.images.push(item.response.data.url);
				}
			});
		},
		previewImage(index,images) {
			console.log(index,images)
			// 预览图片
			uni.previewImage({
				current:index,
				urls: images,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		getTeasingTag() {
			this.$api.teasingTag().then(res => {
				if (res.code == 1) {
					res.data.map(item => {
						item.checked = false;
					});
					this.tagList = res.data;
				}
			});
		},
		submit() {
			if (!this.content) {
				this.$u.toast('请输入吐槽内容');
				return;
			}
			this.$api.addTeasing({ content: this.content, images: this.images, teasing_ids: this.teasing_ids }).then(res => {
				this.$u.toast(res.msg);
				if (res.code == 1) {
					this.content = '';
					this.$refs.upload.clear();
					this.teasing_ids = [];
					this.tagList.map(item => {
						item.checked = false;
					});
					this.is_update = true;
					this.getTeasingList();
				}
			});
		},
		//吐槽列表
		getTeasingList() {
			this.$api.teasingList({ page: this.page }).then(res => {
				this.status = 'loadmore';
				if (res.code == 1) {
					if (this.is_update) {
						this.page = 1;
						this.list = [];
						this.is_update = false;
					}
					this.list = [...this.list, ...res.data.data];
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
			this.getTeasingList();
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
.message {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.scroll-page {
		display: flex;
		padding: 0 30rpx 30rpx;
	}
	.scroll-view {
		display: flex;
		// flex-wrap: wrap;
	}
}
.comment {
	display: flex;
	padding: 30rpx;
	&:not(:last-child) {
		border-bottom: 1px solid #e4e7ed;
	}
	.left {
		image {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background-color: #f2f2f2;
		}
	}
	.right {
		flex: 1;
		padding-left: 20rpx;
		font-size: 30rpx;
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;
			.like {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26rpx;
			}
		}
		.content {
			margin-bottom: 10rpx;
		}
		.reply-box {
			background-color: rgb(242, 242, 242);
			border-radius: 12rpx;
			.item {
				padding: 20rpx;
				&:not(:last-child) {
					border-bottom: solid 2rpx $u-border-color;
				}
				.username {
					font-size: 24rpx;
					color: #999999;
				}
			}
		}
		.bottom {
			margin-top: 20rpx;
			display: flex;
			font-size: 24rpx;
			color: #9a9a9a;
		}
		.thumb {
			width: calc(100% / 3);
			height: 150rpx;
			margin-bottom: 10rpx;
			&:nth-child(3n-1) {
				padding: 0 10rpx;
			}
			image {
				width: 100%;
				height: 100%;
				border-radius: 5rpx;
			}
		}
	}
}
</style>
