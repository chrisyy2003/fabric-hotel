<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="获取代币" :border-bottom="false"></fa-navbar>
		<!-- <view class="u-p-30"><u-input v-model="content" type="textarea" height="300" :border="true" /></view> -->
		<view class="u-p-30">
			<u-cell-group>				
				<!-- <u-cell-item icon="order" title="房间订单" @click="goPage('/pages/order/houseorder',true)"></u-cell-item> -->
				<u-cell-item icon="lock-opened-fill" title="ERC20代币" :arrow="false" :label="'余额: ' + erc20"></u-cell-item>
				<u-cell-item icon="lock-fill" title="隐私代币" :arrow="false" :label="'余额: ' + ptn">
					
				</u-cell-item>

			</u-cell-group>

			<!-- <u--text type="primary" text="主色"></u--text> -->
			<u-button class="bu" shape="square" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color}" @click="submit">获取1000个 erc20</u-button>
			<u-button class="bu" shape="square" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color}" @click="submitP">获取1000个 隐私币</u-button>

		</view>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.getBalance()
		this.getpb()
	},
	data() {
		return {
			erc20: 0,
			ptn: 0
		};
	},
	methods: {
		getBalance(){
			this.$api.getBalance().then(res => {
				this.erc20 = res.balance
				console.log(res)
			})
		},

		getpb(){
			console.log('@@@@')
			this.$api.getpbalance().then(res => {
				this.ptn = res.balance

			})
		},



		submitp(){

		},
		submit(){
			this.$api.getErc20({
				user: this.vuex_user.nickname,
				value: 1000
			}).then(res=>{
				if (res.code){
					this.$u.toast("获取成功")
					
					this.$u.route('/pages/my/gettoken')
				}
			})
		},
		submitP(){
			this.$api.getp().then(res=>{
				if (res.code){
					this.$u.toast('成功'+ res.msg)
					// this.$u.toast("获取成功")
					
					this.$u.route('/pages/my/gettoken')
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

.bu{
	margin-top: 20px;
}

</style>
