<template>
	<view v-if="navbar.isshow">
		<u-navbar
			:is-back="isBack"
			:back-icon-color="navbar.backIconColor"
			back-text="返回"
			:back-text-style="navbar.backTextStyle"
			:title="isShow ? title : ''"
			:title-color="navbar.titleColor"
			:title-size="navbar.titleSize"
			:background="navbar.bgColor"
			:border-bottom="borderBottom"
			:custom-back="goBack"
			:title-width="400"
			z-index="10907"
		></u-navbar>
	</view>
</template>

<script>
export default {
	name: 'fa-navbar',
	props: {
		title: {
			type: String,
			default: '标题'
		},
		borderBottom: {
			type: Boolean,
			default: true
		},
		backIndex:{
			type:Number,
			default:1
		}
	},
	computed: {
		navbar() {
			if (this.vuex_config.navbar) {
				return this.vuex_config.navbar;
			} else {
				return {};
			}
		},
		tabbar() {
			if (this.vuex_config.tabbar) {
				return this.vuex_config.tabbar;
			} else {
				return {
					isshow: false,
					list: []
				};
			}
		},
		isBack() {
			// #ifdef MP-ALIPAY || MP-BAIDU
			return false;
			// #endif

			// #ifdef MP-WEIXIN || H5 || APP-PLUS		
			let status = true;
			this.tabbar.list.some(item => {
				let path = this.$util.getPath(item.path);
				if (path == this.pageUrl || path == '/' + this.pageUrl) {
					status = false;
					return true;
				}
			});
			console.log(status)
			return status;
			// #endif
		},
		isShow() {
			// #ifdef MP-ALIPAY
			return false;
			// #endif
			// #ifndef MP-ALIPAY
			return true;
			// #endif
		}
	},
	created() {
		// 获取引入了u-tabbar页面的路由地址，该地址没有路径前面的"/"
		let pages = getCurrentPages();
		// 页面栈中的最后一个即为项为当前页面，route属性为页面路径
		this.pageUrl = pages[pages.length - 1].route;
		this.pageNum = pages.length;
	},
	data() {
		return {
			pageUrl: '',
			pageNum: 0
		};
	},
	methods: {
		goBack() {			
			let status = false;
			let tabbar = this.vuex_config.tabbar;
			tabbar.list.forEach(item => {
				let path = this.$util.getPath(item.path);
				if (path == this.pageUrl || path == '/' + this.pageUrl) {
					status = true;
				}
			});
			if (status) return;
			if (this.pageNum == 1) {
				//只有当前页面了
				this.$u.route({
					url: '/pages/index/index'
				});
			} else {
				uni.navigateBack({
					delta: this.backIndex
				});
			}
		}
	}
};
</script>

<style></style>
