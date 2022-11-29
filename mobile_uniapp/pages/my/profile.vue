<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="个人资料"></fa-navbar>
		<!-- 内容 -->
		<view class="u-p-30">
			<u-form :model="form" ref="uForm">
				<u-form-item :label-position="labelPosition" label="头像:" prop="avatar" label-width="150">
					<u-image width="100" height="100" :src="url || userInfo.avatar" @click="chooseAvatar"></u-image>
				</u-form-item>
				<u-form-item label="公钥:" prop="nickname" label-width="150"><u-input v-model="form.nickname" /></u-form-item>
				<u-form-item label="个人介绍:" prop="bio" label-width="150"><u-input v-model="form.bio" type="textarea" /></u-form-item>
			</u-form>
			<view class="u-p-30"><u-button type="primary" hover-class="none" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" @click="submit">提交</u-button></view>
		</view>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
import { avatar } from '@/common/fa.mixin.js';
export default {
	mixins: [avatar],
	computed: {
		userInfo() {
			if (this.vuex_user.avatar && this.vuex_user.avatar.indexOf('data:image/svg+xml;base64') == -1) {
				this.form.avatar = this.vuex_user.avatar;
			}
			this.form.username = this.vuex_user.username;
			this.form.nickname = this.vuex_user.nickname;
			this.form.bio = this.vuex_user.bio;
			return this.vuex_user;
		}
	},
	onShow() {
		//移除事件监听
		uni.$off('uAvatarCropper', this.upload);
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	data() {
		return {
			labelPosition: 'left',
			url: '',
			form: {
				username: '',
				nickname: '',
				bio: ''
			},
			rules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}
				],
				nickname: [
					{
						required: true,
						message: '请输入昵称',
						trigger: 'blur'
					}
				]
			}
		};
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(async valid => {
				if (valid) {
					let res = await this.$api.getUserProfile(this.form);	
					this.$u.toast(res.msg);					
					if(res.code){
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},800)
					}
				} else {
					console.log('验证失败');
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
