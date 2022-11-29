<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="授权登录"></fa-navbar>
		<u-modal v-model="show" title="" :content="content" confirm-text="返回" @confirm="confirm">
			<view class="slot-content u-text-center u-m-b-30">
				<u-loading mode="flower" size="100"></u-loading>
				<view class="u-p-20">{{ content }}</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
import {loginfunc} from '@/common/fa.mixin.js'
export default {
	mixins:[loginfunc],
	onLoad() {
		this.state = this.$util.getQueryString('state');
		this.code = this.$util.getQueryString('code');
		if (this.state && this.code) {
			this.goWxAuth();
		} else {
			this.content = '授权登录失败！';
		}
	},
	data() {
		return {
			state: '',
			code: '',
			show: true,
			content: '授权登录中...'
		};
	},
	methods: {
		goWxAuth: async function() {
			let data = {
				code: this.code,
				state: this.state,
				platform: 'wechat' //暂时微信 后期判断其他
			};			
			let res = await this.$api.goAuthCallback(data);
			if (!res) {
				this.content = '授权登录失败！';
				return;
			}
			if(res.data.user){
				this.$u.vuex('vuex_token',res.data.user.token);
				this.success();
				return;
			}
			this.$u.vuex('vuex_third',res.data.third);
			this.$u.route('/pages/login/register?bind=bind');			
		},
		confirm() {
			window.history.go(-2);
		}
	}
};
</script>

<style></style>
