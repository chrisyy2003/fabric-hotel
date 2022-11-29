<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar :title="id ? '编辑住客信息' : '添加住客信息'"></fa-navbar>
		<view class="bg-white u-p-30 u-skeleton-rect">
			<u-form :model="form" ref="uForm">
				<u-form-item label="姓名" label-width="130" prop="name" label-position="top"><u-input v-model="form.name" type="text" placeholder="请填写姓名" /></u-form-item>
				<u-form-item label="身份证号" label-width="130" prop="name" label-position="top"><u-input v-model="form.uid" type="text" placeholder="请输入年龄" /></u-form-item>

			</u-form>
		</view>
		<view class="bg-white u-p-30 footer">
			<u-button type="primary" hover-class="none" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" shape="circle" @click="confirm">
				确定
			</u-button>
		</view>
		<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
export default {
	onLoad(e) {
		this.id = e.id || '';
		e.id && this.getLodger();
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	data() {
		return {
			id: '',
			selectShow: false,
			form: {
				name: '',
				type: '0',
				typeName: '身份证',
				idnumber: '',
				mobile: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '请填写姓名',
						trigger: ['change', 'blur']
					}
				],
				idnumber: [
					{
						required: true,
						message: '请填写证件号码',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							if (this.form.type == 0) {
								return this.$u.test.idCard(value);
							}
							return true;
						},
						message: '身份证号码不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					},{
						validator: (rule, value, callback) => {
							if (this.form.type == 1) {
								return (/^[a-zA-Z]{5,17}$/.test(value)) || (/^[a-zA-Z0-9]{5,17}$/.test(value));
							}
							return true;
						},
						message: '护照格式不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					},{
						validator: (rule, value, callback) => {
							if (this.form.type == 2) {
								return /^([A-Z]\d{6,10}(\(\w{1}\))?)$/.test(value);
							}
							return true;
						},
						message: '港澳通行证格式不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					},{
						validator: (rule, value, callback) => {
							if (this.form.type == 3) {
								return (/^[0-9]{8}$/.test(value)) || (/^[0-9]{10}$/.test(value));
							}
							return true;
						},
						message: '台湾通行证格式不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					}
				],
				mobile:[{
					validator: (rule, value, callback) => {
						if (value) {
							return this.$u.test.mobile(value);
						}
						return true;
					},
					message: '手机号码格式不正确',
					// 触发器可以同时用blur和change
					trigger: ['change', 'blur']
				}]
			},
			selectList: [
				{
					value: '0',
					label: '身份证'
				},
				{
					value: '1',
					label: '护照'
				},
				{
					value: '2',
					label: '港澳通行证'
				},
				{
					value: '3',
					label: '台胞证'
				}
			]
		};
	},
	methods: {
		getLodger() {
			this.$api.getLodger({id:this.id}).then(res=>{
				if(res.code==1){
					this.form.name = res.data.name;
					this.form.idnumber = res.data.idnumber;
					this.form.mobile = res.data.mobile;
					let row = this.selectList.find(item=>{
						return item.value==res.data.type;
					});					
					if(row){
						this.form.type = row.value;
						this.form.typeName = row.label;
					}
				}else{
					this.$u.toast(res.msg);
				}
			})
		},
		// 选择商品类型回调
		selectConfirm(e) {
			e.map((val, index) => {
				this.form.type = val.value;
				this.form.typeName = val.label;
			});
		},
		confirm() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.form.id = this.id;
					this.$api.addOrEditLodger(this.form).then(res => {
						this.$u.toast(res.msg);
						if (res.code == 1) {
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1500);
						}
					});
				} else {
					console.log('验证失败');
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f4f6f8;
}
</style>
<style lang="scss" scoped>
.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}
</style>
