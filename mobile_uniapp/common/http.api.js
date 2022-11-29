const upload = async function(vm, {
		// #ifdef APP-PLUS || H5
		files,
		// #endif
		// #ifdef H5
		file,
		// #endif
		// #ifdef MP-ALIPAY
		fileType,
		// #endif
		filePath,
		name,
		formData
	}) {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			mask: true,
			title: '上传中'
		});
		let data = {
			url: vm.vuex_config.upload.uploadurl,			
			header: {
				token: vm.vuex_token || '',
				uid: vm.vuex_user.id || 0
			},
			name: 'file',
			complete: function() {
				uni.hideLoading();
			},
			success: uploadFileRes => {
				try {
					var res = uploadFileRes.data;
					if (vm.$u.test.jsonString(res)) {						
						resolve(JSON.parse(res))						
					}
					if (vm.$u.test.object(res)) {
						resolve(res)
					}
				} catch (e) {
					reject(uploadFileRes.data);
				}
			},
			fail: (e) => {
				reject(e);
			}
		};
		// #ifdef H5
		//有文件对象，一般是H5
		if(file){
			data.file = file;
		}
		// #endif
		//文件路径
		if(filePath){
			data.filePath = filePath;
		}		
		let isObj = vm.$u.test.object(vm.vuex_config.upload.multipart);
		if (isObj && formData) {					
			data.formData = Object.assign(formData,vm.vuex_config.upload.multipart);			
		}else if(isObj){
			data.formData = vm.vuex_config.upload.multipart;
		}else if(formData){
			data.formData = formData;
		}
		uni.uploadFile(data);
	})

}

const install = (Vue, vm) => {

	// 免登录接口
	vm.$api.config 				= async (params = {}) => await vm.$u.get('http://chrisyy.top:8000/addons/booking/common/init', params);
	vm.$api.mapSearch 			= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/common/mapSearch', params);

	vm.$api.getDefaultStore	    = async (params = {}) => await vm.$u.get('http://chrisyy.top:8000/addons/booking/store/defaultStore', params);


	// #ifdef APP-PLUS	
	vm.$api.staticAmap 			= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/common/staticAmap', params);
	// #endif	
	vm.$api.goUpload 	  		= async (params = {}) => await upload(vm, params);


	// 需要登陆接口
	vm.$api.feedback 			= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/common/feedback', params);
	vm.$api.getCondition		= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/house/condition', params);

	// 获取用户余额
	vm.$api.getpbalance			= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/user/wallet/balance', params);
	vm.$api.getp			= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/user/wallet/mint', params);


	vm.$api.getBalance			= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/erc20/balance', params);
	vm.$api.getErc20			= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/erc20/mint', params);


	// 房间列表
	vm.$api.houseList			= async (params = {}) => await vm.$u.get('http://chrisyy.top:8000/addons/booking/house/houseList', params);
	// 房间详情
	vm.$api.houseDetail			= async (params = {}) => await vm.$u.get('http://chrisyy.top:8000/addons/booking/house/detail', params);
	// 房间预定
	vm.$api.houseBooking		= async (params = {}) => await vm.$u.get('http://chrisyy.top:8000/addons/booking/house/booking', params);
	vm.$api.lodgerList			= async (params = {}) => await vm.$u.get('http://chrisyy.top:8000/addons/booking/house/lodgerList', params);
	vm.$api.delLodger			= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/house/delLodger', params);
	vm.$api.getLodger			= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/house/getLodger', params);
	vm.$api.getMonthHouse		= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/user/add', params);
	vm.$api.addOrEditLodger		= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/user/add', params);

	
	vm.$api.addOrder			= async (params = {}) => {
		// return await vm.$u.get('http://chrisyy.top:7000/addons/booking/order/add', params)
		return await vm.$u.get('http://chrisyy.top:3000/order/add', params);
	}
	vm.$api.orderDetail			= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/order/detail', params);

	vm.$api.orderList			= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/order/orderList', params);

	// 支付
	vm.$api.orderPay			= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/order/pay', params);

	vm.$api.orderCancel			= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/order/cancel', params);
	vm.$api.orderCheckout		= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/order/orderCheckout', params);
	vm.$api.commentList			= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/comment/commentList', params);

	// 添加评论
	vm.$api.addComment			= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/order/addComment', params);

	vm.$api.optionCollect		= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/collect/optionCollect', params);
	vm.$api.collectList	    	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/collect/collectList', params);
	vm.$api.storeList	    	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/store/storeList', params);
	vm.$api.storeDetail	    	= async (params = {}) => await vm.$u.get('http://chrisyy.top:8000/addons/booking/store/detail', params);
	vm.$api.cutStore	    	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/store/cutStore', params);
	vm.$api.teasingTag 			= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/teasing/teasingTag', params);
	vm.$api.teasingList 		= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/teasing/teasingList', params);
	vm.$api.addTeasing 			= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/teasing/add', params);
	
	vm.$api.wifiList 			= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/wifi/wifiList', params);
	vm.$api.couponList 			= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/coupon/couponList', params);
	vm.$api.couponDetail 		= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/coupon/couponDetail', params);
	vm.$api.drawCoupon 			= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/coupon/drawCoupon', params);
	vm.$api.myCouponList 		= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/coupon/myCouponList', params);
		
	
	vm.$api.getUserProfile 	  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/user/profile', params);	
	vm.$api.goUserLogout 	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/user/logout', params);
	vm.$api.goUserAvatar 	  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/user/avatar', params);
	vm.$api.getSigned 	  	  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/user/getSigned',params);
	
	vm.$api.subscribe 		  = async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/ajax/subscribe',params);
	// 登录	
	vm.$api.getEmsSend 		  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/ems/send', params);
	vm.$api.getSmsSend 		  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/sms/send', params);


	vm.$api.goLogin 		  	= async (params = {}) => {
		return await vm.$u.get('http://chrisyy.top:3000/user/login', params)
	}


	vm.$api.mobilelogin 	  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/login/mobilelogin', params);

	// 登陆
	vm.$api.getUserIndex 	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/user/index', params);
	// 注册
	vm.$api.goRegister 		  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:3000/user/register', params);



	vm.$api.goResetpwd 		  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/login/resetpwd', params);
	vm.$api.gowxLogin 		  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/login/wxLogin', params);
	vm.$api.goAppLogin 		  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/login/appLogin', params);
	vm.$api.getWechatMobile  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/login/getWechatMobile', params);
	
	vm.$api.getAuthUrl 	  	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/third/api/getAuthUrl', params);
	vm.$api.goAuthCallback 	  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/third/api/callback', params);
	vm.$api.goThirdAccount 	  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/third/api/account', params);
	// 签到	
	vm.$api.signinConfig 	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/signin/api.index/index',params);
	vm.$api.monthSign 	  	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/signin/api.index/monthSign',params);
	vm.$api.dosign 	 	      	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/signin/api.index/dosign',params);
	vm.$api.fillup 	  		  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/signin/api.index/fillup',params);
	vm.$api.signRank 	 	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/signin/api.index/rank',params);
	vm.$api.signLog 	  	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/signin/api.index/signLog',params);
	
	vm.$api.scoreLogs 	  	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/score/logs',params);
	vm.$api.exchangeList 	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/score/exchangeList',params);
	vm.$api.exchange 	  	  	= async (params = {}) => await vm.$u.post('http://chrisyy.top:5000/addons/booking/score/exchange',params);
	vm.$api.myExchange 	  	  	= async (params = {}) => await vm.$u.get('http://chrisyy.top:5000/addons/booking/score/myExchange',params);
		
}

export default {
	install
}
