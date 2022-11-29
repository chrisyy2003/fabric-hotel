<template>
	<view class="">
		<!-- 顶部导航 -->
		<fa-navbar title="忘记密码"></fa-navbar>
		<view class="login">
			<view class="u-text-center"><u-avatar :size="150"></u-avatar></view>
			<view class="u-m-t-50">
				<u-form :model="form" ref="uForm">
					<u-form-item :label-position="labelPosition" label="类 型:" label-width="120">
						<u-radio-group v-model="form.type" @change="radioGroupChange" :width="radioCheckWidth" :wrap="radioCheckWrap">
							<u-radio shape="circle" :active-color="theme.bgColor" name="email">邮箱</u-radio>
							<u-radio shape="circle" :active-color="theme.bgColor" name="mobile">手机</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item :label-position="labelPosition" :label="form.type == 'email' ? '邮 箱:' : '手机号:'" prop="account" label-width="120">
						<u-input :border="border" :placeholder="form.type == 'email' ? '请填写邮箱' : '请填写手机号码'" v-model="form.account" />
					</u-form-item>
					<u-form-item :label-position="labelPosition" label="验证码:" prop="captcha" label-width="120">
						<u-input :border="border" placeholder="请输入验证码" v-model="form.captcha" type="text"></u-input>
						<u-button type="primary" hover-class="none" slot="right" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" size="mini" @click="getCode">
							{{ codeTips }}
						</u-button>
					</u-form-item>
					<u-form-item :label-position="labelPosition" label="新密码:" prop="newpassword" label-width="120">
						<u-input :password-icon="true" :border="border" type="password" v-model="form.newpassword" placeholder="请输入密码"></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view class="u-m-t-80">
				<u-button type="primary" hover-class="none" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" shape="circle" @click="submit">提交</u-button>
			</view>
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		</view>
	</view>
</template>

<script>
export default {	
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	data() {
		return {
			labelPosition: 'left',
			border: false,
			radioCheckWidth: 'auto',
			radioCheckWrap: false,
			form: {
				account: '',
				newpassword: '',
				type: 'email',
				captcha: ''
			},
			rules: {
				account: [
					{
						validator: (rule, value, callback) => {
							rule.message = `请填写${this.form.type == 'email' ? '邮箱' : '手机号码'}`;
							return !!value;
						},
						message: '',
						trigger: 'blur'
					}
				],
				newpassword: [
					{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					}
				],
				captcha: [
					{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}
				]
			},
			codeTips: '',
			errorType: ['message']
		};
	},
	methods: {
		codeChange(text) {
			this.codeTips = text;
		},
		radioGroupChange(e) {
			this.form.type = e;
		},
		// 获取验证码
		getCode: async function(type) {
			if (this.$refs.uCode.canGetCode) {
				let res = {};
				if (this.form.type == 'email') {
					if (!this.$u.test.email(this.form.account)) {
						this.$u.toast('邮箱格式不正确！');
						return;
					}
					res = await this.$api.getEmsSend({
						email: this.form.account,
						event: 'resetpwd'
					});
				} else {					
					if (!this.$u.test.mobile(this.form.account)) {
						this.$u.toast('手机号码格式不正确！');
						return;
					}
					res = await this.$api.getSmsSend({
						mobile: this.form.account,
						event: 'resetpwd'
					});
				}				
				this.$u.toast(res.msg || '发送失败');
				if(res.code==1){
					this.$refs.uCode.start();
				}
			} else {
				this.$u.toast('倒计时结束后再发送');
			}
		},
		submit() {
			this.$refs.uForm.validate(async valid => {
				if (valid) {
					let res = await this.$api.goResetpwd({
						type: this.form.type,
						mobile: this.form.account,
						email: this.form.account,
						newpassword: this.form.newpassword,
						captcha: this.form.captcha
					});
					if (!res.code) {
						this.$u.toast(res.msg);
						return;
					}
					setTimeout(() => {
						this.$u.route({
							url:'/pages/login/login',
							type:'redirect'
						})
					}, 800);
				} else {
					this.$u.toast('验证失败');
				}
			});
		}
	}
};
</script>

<style>
page {
	background-color: #ffffff;
}
.login {
	padding: 20% 15%;
}
</style>
