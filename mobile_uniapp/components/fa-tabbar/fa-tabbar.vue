<template>
	<view v-if="tabbar.isshow && showTabbar" class="u-tabbar" @touchmove.stop.prevent>
		<view
			class="u-tabbar__content safe-area-inset-bottom"
			:style="{
				height: $u.addUnit(tabbar.height),
				backgroundColor: tabbar.bgColor
			}"
			:class="{
				'u-border-top': tabbar.borderTop
			}"
		>
			<view
				class="u-tabbar__content__item"
				v-for="(item, index) in tabbar.list"
				:key="index"
				:class="{
					'u-tabbar__content__circle': tabbar.midButton && item.midButton
				}"
				@tap.stop="clickHandler(index)"
				:style="{
					backgroundColor: tabbar.bgColor
				}"
			>
				<view :class="[tabbar.midButton && item.midButton ? 'u-tabbar__content__circle__button' : 'u-tabbar__content__item__button']">
					<u-image
						:lazy-load="false"
						:duration="0"
						:show-loading="false"
						:fade="false"
						:width="tabbar.midButton && item.midButton ? tabbar.midButtonSize : tabbar.iconSize"
						:height="tabbar.midButton && item.midButton ? tabbar.midButtonSize : tabbar.iconSize"
						:src="elIconPath(index)"
					></u-image>
					<u-badge :count="item.count" :is-dot="item.isDot" :color="item.badgeColor" :bgColor="item.badgeBgColor" :offset="offsetWz(item.count, item.isDot)"></u-badge>
				</view>
				<view
					class="u-tabbar__content__item__text"
					:style="{
						color: elColor(index)
					}"
				>
					<text class="u-line-1">{{ item.text }}</text>
				</view>
			</view>
			<view
				v-if="tabbar.midButton"
				class="u-tabbar__content__circle__border"
				:class="{
					'u-border': tabbar.borderTop
				}"
				:style="{
					backgroundColor: tabbar.bgColor,
					left: tabbar.midButtonLeft
				}"
			></view>
		</view>
		<!-- 这里加上一个48rpx的高度,是为了增高有凸起按钮时的防塌陷高度(也即按钮凸出来部分的高度) -->
		<view
			class="u-fixed-placeholder safe-area-inset-bottom"
			:style="{
				height: `calc(${$u.addUnit(tabbar.height)} + ${tabbar.midButton ? 48 : 0}rpx)`
			}"
		></view>
	</view>
</template>

<script>
export default {
	props: {
		// 通过v-model绑定current值
		value: {
			type: [String, Number],
			default: 0
		},
		// 切换前的回调
		beforeSwitch: {
			type: Function,
			default: null
		}
	},
	data() {
		return {
			pageUrl: '' // 当前
		};
	},
	created() {
		//隐藏系统菜单栏
		uni.hideTabBar();
		// 获取引入了u-tabbar页面的路由地址，该地址没有路径前面的"/"
		let pages = getCurrentPages();
		// 页面栈中的最后一个即为项为当前页面，route属性为页面路径
		this.pageUrl = pages[pages.length - 1].route;
	},
	computed: {
		elIconPath() {
			return index => {
				// 历遍u-tabbar的每一项item时，判断是否传入了pagePath参数，如果传入了
				// 和data中的pageUrl参数对比，如果相等，即可判断当前的item对应当前的tabbar页面，设置高亮图标
				// 采用这个方法，可以无需使用v-model绑定的value值
				let path = this.$util.getPath(this.tabbar.list[index].path);
				// 如果定义了pagePath属性，意味着使用系统自带tabbar方案，否则使用一个页面用几个组件模拟tabbar页面的方案
				// 这两个方案对处理tabbar item的激活与否方式不一样
				if (path) {
					if (path == this.pageUrl || path == '/' + this.pageUrl) {
						return this.tabbar.list[index].selectedImage;
					} else {
						return this.tabbar.list[index].image;
					}
				} else {
					// 普通方案中，索引等于v-model值时，即为激活项
					return index == this.value ? this.tabbar.list[index].selectedImage : this.tabbar.list[index].image;
				}
			};
		},
		elColor() {
			return index => {
				// 判断方法同理于elIconPath
				let path = this.$util.getPath(this.tabbar.list[index].path);
				if (path) {
					if (path == this.pageUrl || path == '/' + this.pageUrl) return this.tabbar.selectColor;
					else return this.tabbar.color;
				} else {
					return index == this.value ? this.tabbar.selectColor : this.tabbar.color;
				}
			};
		},
		// 计算角标的right值
		offsetWz() {
			return (count, isDot) => {
				// 点类型，count大于9(两位数)，分别设置不同的right值，避免位置太挤
				if (isDot) {
					return [-2, -20];
				} else if (count > 9) {
					return [-2, -40];
				} else {
					return [-2, -30];
				}
			};
		},
		tabbar() {
			if (this.vuex_config.tabbar) {
				return this.vuex_config.tabbar;
			} else {
				return {
					isshow: false
				};
			}
		},
		showTabbar() {
			if (this.tabbar.list) {
				let status = false;
				this.tabbar.list.forEach(item => {
					let path = this.$util.getPath(item.path);
					if (path == this.pageUrl || path == '/' + this.pageUrl) {
						status = true;
					}
				});
				return status;
			}
		}
	},
	mounted() {
		this.tabbar.midButton && this.getMidButtonLeft();
	},
	methods: {
		// #ifdef MP-BAIDU
		setTabBarStyle(e) {
			console.log(e);
		},
		// #endif
		async clickHandler(index) {
			if (this.beforeSwitch && typeof this.beforeSwitch === 'function') {
				// 执行回调，同时传入索引当作参数
				// 在微信，支付宝等环境(H5正常)，会导致父组件定义的customBack()函数体中的this变成子组件的this
				// 通过bind()方法，绑定父组件的this，让this.customBack()的this为父组件的上下文
				let beforeSwitch = this.beforeSwitch.bind(this.$u.$parent.call(this))(index);
				// 判断是否返回了promise
				if (!!beforeSwitch && typeof beforeSwitch.then === 'function') {
					await beforeSwitch
						.then(res => {
							// promise返回成功，
							this.switchTab(index);
						})
						.catch(err => {});
				} else if (beforeSwitch === true) {
					// 如果返回true
					this.switchTab(index);
				}
			} else {
				this.switchTab(index);
			}
		},
		// 切换tab
		switchTab(index) {
			//同一个页面不做处理
			let path = this.$util.getPath(this.tabbar.list[index].path);
			if (path == this.pageUrl || path == '/' + this.pageUrl) {
				return;
			}
			if (this.tabbar.list[index].path.indexOf('http') != -1) {
				//外部链接
				this.$u.vuex('vuex_webs', {
					path: this.tabbar.list[index].path,
					title: this.tabbar.list[index].text
				});
				this.$u.route('/pages/webview/webview');
				return;
			}
			// 发出事件和修改v-model绑定的值
			this.$emit('change', index);
			if (this.tabbar.list[index].path) {
				this.$u.route({
					type: 'redirectTo',
					url: this.tabbar.list[index].path
				});
			} else {
				// 如果配置了papgePath属性，将不会双向绑定v-model传入的value值
				// 因为这个模式下，不再需要v-model绑定的value值了，而是通过getCurrentPages()适配
				this.$emit('input', index);
			}
		},
		// 获取凸起按钮外层元素的left值，让其水平居中
		getMidButtonLeft() {
			let windowWidth = this.$u.sys().windowWidth;
			// 由于安卓中css计算left: 50%的结果不准确，故用js计算
			this.tabbar.midButtonLeft = windowWidth / 2 + 'px';
		}
	}
};
</script>

<style scoped lang="scss">
.u-fixed-placeholder {
	box-sizing: content-box;
}

.u-tabbar {
	&__content {
		display: flex;
		align-items: center;
		position: relative;
		position: fixed;
		// #ifdef MP-ALIPAY
		bottom: -70rpx;
		// #endif
		// #ifndef MP-ALIPAY
		bottom: 0;
		// #endif
		left: 0;
		width: 100%;
		z-index: 998;
		box-sizing: content-box;

		&__circle__border {
			border-radius: 100%;
			width: 110rpx;
			height: 110rpx;
			top: -48rpx;
			position: absolute;
			z-index: 4;
			background-color: #ffffff;
			// 由于安卓的无能，导致只有3个tabbar item时，此css计算方式有误差
			// 故使用js计算的形式来定位，此处不注释，是因为js计算有延后，避免出现位置闪动
			left: 50%;
			transform: translateX(-50%);

			&:after {
				border-radius: 100px;
			}
		}

		&__item {
			flex: 1;
			justify-content: center;
			height: 100%;
			padding: 12rpx 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;

			&__button {
				position: absolute;
				top: 10rpx;
			}

			&__text {
				color: $u-content-color;
				font-size: 26rpx;
				line-height: 28rpx;
				position: absolute;
				bottom: 12rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}

		&__circle {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			z-index: 10;
			height: calc(100% - 1px);

			&__button {
				width: 90rpx;
				height: 90rpx;
				border-radius: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				background-color: #ffffff;
				top: -40rpx;
				left: 50%;
				z-index: 6;
				transform: translateX(-50%);
			}
		}
	}
}
</style>
