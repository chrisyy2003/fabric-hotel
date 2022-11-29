<template>
	<view>
		 <web-view :src="vuex_webs.path"></web-view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			uni.setNavigationBarColor({
			    frontColor: this.theme.color,
			    backgroundColor: this.theme.bgColor,
			    animation: {
			        duration: 400,
			        timingFunc: 'easeIn'
			    }
			})
			uni.setNavigationBarTitle({
			    title: this.vuex_webs.title
			});
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
