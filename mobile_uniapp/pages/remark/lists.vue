<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="评价列表" :border-bottom="false"></fa-navbar>
		<view class="comment u-border-bottom" v-for="(res, index) in list" :key="res.id">
			<view class="left"><image :src="res.user && res.user.avatar" mode="aspectFill"></image></view>
			<view class="right">
				<view class="top" :style="[{color:theme.bgColor}]">
					<view class="name">{{ res.user && res.user.nickname }}</view>
					<view class="like highlight">
						<view class="num">{{ res.grade }}</view>
					</view>
				</view>
				<view class="content">{{ res.comment }}</view>
				<view class="reply-box">
					<view class="item" v-for="(item, index) in res.replay" :key="index">
						<view class="username">{{ item.manage.nickname }}</view>
						<view class="text">{{ item.comment }}</view>
					</view>
					<view class="all-reply" :style="[{color:theme.bgColor}]" v-if="res.replay.length">
						共{{ res.replay.length }}条回复						
					</view>
				</view>
				<view class="bottom">{{ res.createtime | timeFrom('yyyy-mm-dd') }}</view>
			</view>
		</view>
		<!-- 空数据 -->
		<view class="u-u-p-t-80 u-p-b-80" v-if="is_empty"><u-empty></u-empty></view>
		<!-- 加载更多 -->
		<view class="u-p-30" v-if="list.length"><u-loadmore bg-color="#ffffff" :status="has_more ? status : 'nomore'" /></view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: theme.lightColor }"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			status: 'loadmore',
			has_more: false,
			scrollTop: 0,
			page: 1,
			is_update: false,
			type: 0,
			source_id: 0,
			is_empty:false
		};
	},
	onLoad(e) {
		this.type = e.type || 0;
		this.source_id = e.source_id || '';
		this.getCommentList();
	},
	methods: {
		// 跳转到全部回复
		toAllReply() {
			uni.navigateTo({
				url: '/pages/template/comment/reply'
			});
		},
		//评论列表
		getCommentList() {
			this.$api.commentList({ type: this.type, source_id: this.source_id ,page:this.page}).then(res => {
				this.status = 'loadmore';
				if (res.code == 1) {
					this.list = [...this.list,...res.data.data];
					this.has_more = res.data.current_page < res.data.last_page;
					this.is_empty = !this.list.length;
				}
			});
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	//下拉刷新
	onPullDownRefresh() {},
	onReachBottom() {
		if (this.has_more) {
			this.status = 'loading';
			this.page++;
			this.getCommentList();
		}
	}
};
</script>

<style lang="scss" scoped>
.comment {
	display: flex;
	padding: 30rpx;
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
				font-size: 26rpx;
				.num {
					margin-right: 4rpx;					
				}
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
				border-bottom: solid 2rpx $u-border-color;
				.username {
					font-size: 24rpx;
					color: #999999;
				}
			}
			.all-reply {
				padding: 20rpx;
				display: flex;				
				align-items: center;
				.more {
					margin-left: 6rpx;
				}
			}
		}
		.bottom {
			margin-top: 20rpx;
			display: flex;
			font-size: 24rpx;
			color: #9a9a9a;
		}
	}
}
</style>
