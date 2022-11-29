<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="留言反馈" :border-bottom="false"></fa-navbar>
		<view class="u-p-30"><u-input v-model="content" type="textarea" height="300" :border="true" /></view>
		<view class="u-p-30">
			<u-button shape="square" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" @click="submit">提交留言</u-button>
		</view>
	</view>
</template>

<script>
export default {
	onLoad() {},
	data() {
		return {
			content: ''
		};
	},
	methods: {
		submit(){
			if(!this.content){
				this.$u.toast('请输入留言内容');
				return;
			}
			this.$api.feedback({content:this.content}).then(res=>{
				this.$u.toast(res.msg);
				if(res.code==1){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1000)
				}
			})
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #FFFFFF;
}
</style>
