<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="评价" :border-bottom="false"></fa-navbar>
		<view class="u-p-30">
			<u-form :model="form" ref="uForm">
				<u-form-item label="评分" label-position="top" prop="grade"><u-rate :count="count" v-model="form.grade"></u-rate></u-form-item>
				<u-form-item label="内容" label-position="top" prop="comment">
					<u-input type="textarea" height="100" maxlength="150" v-model="form.comment" />
				</u-form-item>
			</u-form>
		</view>
		<view class="u-p-60">
			<u-button type="primary" hover-class="none" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" shape="circle" @click="submit">
				立即提交
			</u-button>
		</view>
	</view>
</template>

<script>
export default {
	onLoad(e) {
		this.orderid = e.orderid || '';
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	data() {
		return {
			form: {
				comment: '',
				grade: 0
			},
			rules: {
				comment: [
					{
						required: true,
						message: '请输入评论内容',					
						trigger: ['change', 'blur']
					},
					{
						min: 3,
						message: '评论不能少于3个字',
						trigger: 'change'
					}
				]
			},
			count: 5,
			orderid: ''
		};
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					if(!this.orderid){
						this.$u.toast('参数缺失！');
						return;
					}

					this.form.orderid = this.orderid;
					this.$api.addComment(this.form).then(res=>{

						this.$u.toast(res.msg)
						
						// this.$u.toast(res.msg);
						// if(res.code==1){
						// 	setTimeout(()=>{
						// 		uni.navigateBack({
						// 			delta:1
						// 		})
						// 	},1000)
						// }
					})
				} else {
					console.log('验证失败');
				}
			});
		}
	}
};
</script>

<style></style>
