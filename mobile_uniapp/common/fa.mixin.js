export const tools = {
	filters: {
		formatMdTime(value) {
			let obj = new Date(value * 1000);
			let m = obj.getMonth();
			let d = obj.getDate();
			m = m + 1;
			if (m < 10) {
				m = '0' + m;
			}
			if (d < 10) {
				d = '0' + d;
			}
			return m + '月' + d + '日';
		},
		formatWeek(value) {
			let week = new Date(value * 1000).getDay();
			var weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			return weekDay[week];
		},
		formatTimes(value) {
			value = value + '';
			if (value.length < 3) {
				return value;
			}
			return value.substring(0, value.length - 3);
		}
	},
	computed: {
		formatDayNum() {
			return (leave_time, checkin_time) => {
				return parseInt((leave_time - checkin_time) / (60 * 60 * 24));
			};
		}
	},
	methods: {
		//富文本的回调
		navigate(e) {
			if (e.href && e.href.indexOf('http') == -1) { //不完整的链接					
				// #ifdef MP
				this.$util.uniCopy({
					content: this.vuex_config.upload.cdnurl + e.href,
					success: () => {
						this.$u.toast('链接已复制,请在浏览器中打开')
					}
				})
				// #endif
				// #ifndef MP				
				window.open(this.vuex_config.upload.cdnurl + e.href);
				// #endif
			}
		},
		//复制url
		copyUrl(url='') {
			this.$util.uniCopy({
				content: url || window.location.href,
				success: () => {
					this.$u.toast('复制成功，请去粘贴发送给好友吧');
				},
				error: () => {
					console.log('复制失败！')
				}
			})
		},
		//cdnurl
		cdnurl(url) {
			if (!/^((?:[a-z]+:)?\/\/|data:image\/)(.*)/.test(url)) {
				return this.vuex_config.upload.cdnurl + url;
			};
			return url;
		},
		//页面跳转
		goPage(path, auth) {
			if(path=='out'){
				this.$u.vuex('vuex_token', '');
				this.$u.vuex('vuex_user', {});
				return;
			}
			if (auth && !this.vuex_token) {
				this.$u.route('/pages/login/mobilelogin');
				return;
			}
			uni.navigateTo({
				url: path
			})
		},
		getDefaultStore() {
			return new Promise((resolve,reject)=>{
				this.$api.getDefaultStore({
					latitude:this.vuex_location.latitude,
					longitude:this.vuex_location.longitude
				}).then(res => {
					if (res.code == 1) {
						this.$u.vuex('vuex_store', res.data);
						resolve()
					} else {
						this.$u.toast(res.msg);
					}
				});	
			})		
		}
	}
}
//修改头像的事件
export const avatar = {
	methods: {
		chooseAvatar() {
			uni.$on('uAvatarCropper', this.upload);
			this.$u.route({
				// 关于此路径，请见下方"注意事项"
				url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
				// 内部已设置以下默认参数值，可不传这些参数
				params: {
					// 输出图片宽度，高等于宽，单位px
					destWidth: 300,
					// 裁剪框宽度，高等于宽，单位px
					rectWidth: 300,
					// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
					fileType: 'jpg'
				}
			});
		},
		upload: async function(path) {
			uni.$off('uAvatarCropper', this.upload);
			// 可以在此上传到服务端
			try {
				let res = await this.$api.goUpload({
					filePath: path
				});
				if (!res.code) {
					this.$u.toast(res.msg);
				};
				this.form.avatar = res.data.url;
				this.url = res.data.fullurl;
				if (typeof this.editAvatar == 'function') {
					this.editAvatar();
				}
			} catch (e) {
				console.error(e);
				this.$u.toast('图片上传失败！');
			}
		}
	}
}
//form
export const formRule = {
	methods: {
		//表单验证
		getRules(rule, title) {
			let arr = rule.split(';');
			let rule_arr = [];
			arr.forEach(item => {
				item = this.$u.trim(item);
				switch (item) {
					case 'required':
						rule_arr.push({
							required: true,
							message: title + '不能为空',
							// 可以单个或者同时写两个触发验证方式
							trigger: ['change', 'blur']
						});
						break;
					case 'digits': //数字校验
						rule_arr.push({
							validator: (rule, value, callback) => {
								return this.$u.test.digits(value);
							},
							message: '请填写数字',
							trigger: ['change', 'blur']
						});
						break;
					case 'letters': //字母校验
						rule_arr.push({
							validator: (rule, value, callback) => {
								return this.$u.test.letter(value);
							},
							message: '请填写字母',
							trigger: ['change', 'blur']
						});
						break;
					case 'date': //日期校验
						rule_arr.push({
							validator: (rule, value, callback) => {
								return this.$u.test.date(value);
							},
							message: '请填写正确日期格式',
							trigger: ['change', 'blur']
						});
						break;
					case 'time': //时间校验
						rule_arr.push({
							validator: (rule, value, callback) => {
								return /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value);
							},
							message: '请填写正确时间格式',
							trigger: ['change', 'blur']
						});
						break;
					case 'email': //邮箱校验
						rule_arr.push({
							validator: (rule, value, callback) => {
								return this.$u.test.email(value);
							},
							message: '请填写正确邮箱',
							trigger: ['change', 'blur']
						});
						break;
					case 'url': //网址
						rule_arr.push({
							validator: (rule, value, callback) => {
								return this.$u.test.url(value);
							},
							message: '请填写正确网址',
							trigger: ['change', 'blur']
						});
						break;
					case 'qq': //qq
						rule_arr.push({
							validator: (rule, value, callback) => {
								return /^[1-9][0-9]{4,10}$/.test(value);
							},
							message: '请填写正确QQ号码',
							trigger: ['change', 'blur']
						});
						break;
					case 'IDcard': //身份证
						rule_arr.push({
							validator: (rule, value, callback) => {
								return this.$u.test.idCard(value);
							},
							message: '请填写正确身份证件号',
							trigger: ['change', 'blur']
						});
						break;
					case 'tel': //电话
						rule_arr.push({
							validator: (rule, value, callback) => {
								return /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/.test(value);
							},
							message: '请填写正确电话号码',
							trigger: ['change', 'blur']
						});
						break;
					case 'mobile': //手机
						rule_arr.push({
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '请填写正确手机号码',
							trigger: ['change', 'blur']
						});
						break;
					case 'zipcode': //邮编
						rule_arr.push({
							validator: (rule, value, callback) => {
								return /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/.test(value);
							},
							message: '请填写正确邮编',
							trigger: ['change', 'blur']
						});
						break;
					case 'chinese': //中文
						rule_arr.push({
							validator: (rule, value, callback) => {
								return /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/
									.test(
										value
									);
							},
							message: '请填写中文',
							trigger: ['change', 'blur']
						});
						break;
					case 'username': //用户名
						rule_arr.push({
							validator: (rule, value, callback) => {
								return /^[a-zA-Z0-9_]{3,12}$/.test(value);
							},
							message: '请填写3-12位数字、字母、下划线',
							trigger: ['change', 'blur']
						});

						break;
					case 'password': //密码
						rule_arr.push({
							validator: (rule, value, callback) => {
								let val = this.$u.trim(value, 'all');
								if (val != value) {
									return false;
								}
								return /^[0-9a-zA-Z!@#$%^&*?]{6,16}$/.test(value);
							},
							message: '请填写6-16位字符，不能包含空格',
							trigger: ['change', 'blur']
						});
						break;
				}
			});
			return rule_arr;
		}
	}
}

//登录
export const loginfunc = {
	methods: {
		//登录成功
		success(index=1) {
			//不在H5
			// #ifndef H5
			uni.navigateBack({
				delta: index
			})
			// #endif
			// 在H5 刷新导致路由丢失
			// #ifdef H5
			var pages = getCurrentPages();
			//有上次页面，关闭所有页面，到此页面
			if (pages.length <= 1) {
				//默认到首页
				uni.reLaunch({
					url:(this.vuex_lasturl || '/pages/index/index'),
					complete(res) {
						console.log(res)
					}
				})
				return;
			}
			uni.navigateBack({
				delta: index
			})
			// #endif
		},
		// #ifdef H5
		async goAuth(){
			if (this.$util.isWeiXinBrowser()) {
				let url = '';
				if(window.location.hash != ''){
					url = window.location.origin + window.location.pathname+'?hashpath=/pages/login/auth'
				}else{
					url = window.location.origin + '/pages/login/auth';
				};		
				let res = await this.$api.getAuthUrl({
					platform: 'wechat',
					url: url
				});
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				}
				var pages = getCurrentPages();
				let len = pages.length;
				if(len>1){
					let url = pages[len-1].route;
					if(url.indexOf('login') != -1){
						//找到上一个不是登录页面
						for(let i=len-1;i>=0;i--){
							if(pages[i].route.indexOf('login') == -1){
								this.$u.vuex('vuex_lasturl','/'+pages[i].route+this.$u.queryParams(pages[i].options));
								break;
							}
						}
					}else{
						this.$u.vuex('vuex_lasturl','/'+url+this.$u.queryParams(pages[pages.length-1].options))
					}	
				}
				window.location.href = res.data;
			}
		},
		// #endif
		// #ifdef APP-PLUS
		goAppLogin(index=1){
			let that = this;
			var all, Service;
			// 1.发送请求获取code
			plus.oauth.getServices(
				function(Services) {
					all = Services;
					Object.keys(all).some(key => {
						if (all[key].id == 'weixin') {
							Service = all[key];
						}
					});
					Service.authorize(
						async function(e) {
							console.log(e);
							let res = await that.$api.goAppLogin({ code: e.code, scope: e.scope });
							if (!res.code) {
								that.$u.toast(res.msg);
								return;
							}
							if (res.data.user) {
								that.$u.vuex('vuex_token', res.data.user.token);
								that.$u.vuex('vuex_user', res.data.user || {});
								that.success(index);
								return;
							}
							that.$u.vuex('vuex_third', res.data.third);
							that.$u.route('/pages/login/register?bind=bind');
						},
						function(e) {
							that.$u.toast('授权失败！');
						}
					);
				},
				function(err) {
					console.log(err);
					that.$u.toast('授权失败！');
				}
			);			
		}
		// #endif
	}
}
