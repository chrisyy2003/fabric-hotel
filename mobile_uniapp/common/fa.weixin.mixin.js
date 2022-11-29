//微信网页分享
var jweixin = require('jweixin-module')  
export const weixinShare = {
	methods: {
		//初始化sdk配置  
		initJssdk: function(callback) {
			let url = '';
			if(window.location.hash != ''){
			  url = window.location.origin+window.location.pathname;
			}else{
			  url = window.location.href;
			}
			this.$api.getSigned({url:url}).then(res=>{
				if (res.code) {
					jweixin.config({
						debug: false,
						appId: res.data.appId,
						timestamp: res.data.timestamp,
						nonceStr: res.data.nonceStr,
						signature: res.data.signature,
						jsApiList: [
							'checkJsApi',
							'updateAppMessageShareData',
							'updateTimelineShareData',
							'onMenuShareWeibo'
						]
					});
					//配置完成后，再执行分享等功能  
					if (typeof callback == 'function') {
						callback();
					}
				}else{
					this.$u.toast(res.msg)
				}
			})
		},
		//在需要自定义分享的页面中调用  
		wxShare: function(data) {		
			//每次都需要重新初始化配置，才可以进行分享  
			this.initJssdk(function() {
				jweixin.ready(function() {
					var shareData = {
						title: data && data.title ? data.title : '分享标题',
						desc: data && data.desc ? data.desc : '分享内容',
						link: data && data.url?data.url:window.location.origin,
						imgUrl: data && data.img ? data.img : '',
						success: function(res) {
							
						},
						cancel: function(res) {}
					};				
					//自定义“分享给朋友”及“分享到QQ”按钮的分享内容；
					jweixin.updateAppMessageShareData(shareData)
					//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容；
					jweixin.updateTimelineShareData(shareData)
					//分享到腾讯微博
					jweixin.onMenuShareWeibo(shareData);
				
				});
			});
		}
	}
}
