<template>
	<view class="">
		<view class="orderby-select" @click="show = true"><image src="../../static/image/select.png" mode="aspectFit"></image></view>
		<u-popup v-model="show" mode="right" width="88%" :customStyle="customStyle">
			<view class="fa-popup">
				<scroll-view class="fa-scroll-view" scroll-y="true">
					<view class="fa-select-list u-m-b-15">
						<view class="u-border-bottom u-p-20 text-weight">排序</view>
						<view class="u-flex u-flex-wrap list u-p-20">
							<view class="item u-m-b-15" :style="[orderStyle(index)]" @click="orderBy(index)" v-for="(item, index) in orderList" :key="index">
								<text class="u-m-r-5">{{ item }}</text>
							</view>
						</view>
					</view>
					<view class="">
						<view class="u-flex bg-white u-row-between u-m-b-15">
							<view class="u-p-20 text-weight">筛选</view>
							<view class="" v-if="multiple">
								<u-checkbox v-model="checked" name="1" :active-color="theme.bgColor"><text>多选模式</text></u-checkbox>
							</view>
						</view>						
						<view class="fa-select-list u-m-b-15 u-border-top" v-for="(item, index) in filterList" :key="index">
							<view class="u-p-20 u-border-bottom text-weight">{{ item.label }}</view>
							<view class="u-flex list u-flex-wrap u-p-20">
								<view class="item u-m-b-15" :style="[itemStyle(index, key)]" v-for="(res, key) in item.value" :key="key" @click="select(index, key)">
									{{ res.name }}
								</view>
							</view>
						</view>
						<view class="fa-select-list u-m-b-15 u-border-top">
							<view class="u-p-20 u-border-bottom text-weight">时间</view>
							<view class="u-p-20" @click="show_calendar = true">
								<view class="u-tips-color u-p-t-5 u-p-b-5">{{ calendar | ftmCalendar }}</view>
							</view>
						</view>
						<view class="fa-select-list u-m-b-15 u-border-top">
							<view class="u-p-20 u-border-bottom text-weight">价格区间</view>
							<view class="u-flex u-row-between u-p-20">
								<u-input type="number" input-align="center" v-model="low_price" placeholder="最低价格"></u-input>
								<view class="u-p-l-15 u-m-p-r-15">
									<u-icon name="minus"></u-icon>
								</view>
								<u-input type="number" input-align="center" v-model="high_price" placeholder="最高价格"></u-input>
							</view>
						</view>
						<view class="fa-select-list u-m-b-15 u-border-top">
							<view class="u-p-20 u-border-bottom text-weight">可住人数</view>
							<view class="u-flex u-row-between u-p-20">
								<u-input type="text" input-align="center" v-model="low_nums" placeholder="最低人数"></u-input>
								<view class="u-p-l-15 u-m-p-r-15">
									<u-icon name="minus"></u-icon>
								</view>
								<u-input type="text" input-align="center" v-model="high_nums" placeholder="最高人数"></u-input>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="footer u-flex u-border-top">
					<view class="u-flex-6" @click="close">取消</view>
					<view class="u-flex-6" :style="{ backgroundColor: theme.bgColor, color: theme.color }" @click="toGo">确定</view>
				</view>
			</view>
		</u-popup>
		<!-- 时间选择器 -->
		<fa-u-calendar
			start-text="入住"
			end-text="离店"
			v-model="show_calendar"
			:isActiveCurrent="false"
			mode="range"
			max-date="2050-12-30"
			@change="calendarChange"
			:active-bg-color="theme.bgColor"
			:range-bg-color="theme.lightColor"
			:range-color="theme.bgColor"
			:store_id="store_id"
		>
			<view slot="tooltip"><view class="u-text-center u-p-t-30">请选择住店/离店时间</view></view>
		</fa-u-calendar>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
	name: 'fa-orderby-select',
	props: {
		multiple: {
			type: Boolean,
			default: true
		},
		separator: {
			type: String,
			default: ','
		}
	},
	filters: {
		ftmCalendar(value) {
			if (!value) {
				return value;
			}
			let array = value.split('/');
			if (array.length < 2) {
				return array[0];
			}
			if (array[0] == array[1]) {
				return array[0];
			}
			return value.replace('/',' 至 ');
		}
	},
	computed: {
		// 转换字符数值为真正的数值
		navbarHeight() {
			// #ifdef H5
			return 44;
			// #endif
			// #ifdef APP-PLUS
			return 44 + systemInfo.statusBarHeight;
			// #endif
			// #ifdef MP
			// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
			let height = systemInfo.platform == 'ios' ? 44 : 48;
			return height + systemInfo.statusBarHeight;
			// #endif
		},
		customStyle() {
			return {
				height: 'calc(100% - ' + this.navbarHeight + 'px)',
				top: this.navbarHeight + 'px'
			};
		},
		orderStyle() {
			return index => {
				let style = {
					backgroundColor: this.theme.bgColor,
					color: this.theme.color
				};
				if (index == this.orderby) {
					return style;
				}
				return {};
			};
		},
		itemStyle() {
			return (index, key) => {
				let style = {
					backgroundColor: this.theme.bgColor,
					color: this.theme.color
				};
				if (!this.checked) {
					if (this.singleList[index] == key) {
						return style;
					}
				} else {
					let arr = this.manyList[index];
					if (arr && arr.indexOf(key) != -1) {
						return style;
					}
				}
				return {};
			};
		}
	},
	mounted() {
		let obj = new Date();
		let year = obj.getFullYear();
		let month = obj.getMonth();
		let day = obj.getDate();
		this.calendar = year + '-' + (month + 1).toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
		this.init();
	},
	data() {
		return {
			show: false,
			show_calendar: false,
			store_id: '',
			checked: false,
			orderList: [],
			filterList: [],
			low_price:'',
			high_price:'',
			low_nums:'',
			high_nums:'',
			singleList: [],
			manyList: [],
			calendar: '',
			orderby: 'weigh'
		};
	},
	methods: {
		init() {
			this.$api.getCondition().then(res => {
				console.log(res);
				let { filterList, orderList } = res.data;
				this.filterList = filterList;
				this.orderList = orderList;
				// 默认选中
				let len = (this.filterList && this.filterList.length) || 0;
				this.singleList = [];
				this.manyList = [];
				for (let i = 0; i < len; i++) {
					this.singleList.push(0);
					this.manyList.push([0]);
				}
			});
		},
		close() {
			this.show = false;
			this.init();
		},
		calendarChange(e) {
			this.calendar = e.startDate + '/' + e.endDate;			
		},
		orderBy(index) {
			this.orderby = index;
		},
		select(index, key) {
			if (!this.checked) {
				this.$set(this.singleList, index, key);
			} else {
				//全部，就只有全部了
				if (key == 0) {
					this.$set(this.manyList, index, [key]);
					return;
				}
				let arr = this.manyList[index];
				if (!arr) {
					this.$set(this.manyList, index, [key]);
				} else {
					//全部存在，要移除
					let all = arr.indexOf(0);
					if (all != -1) {
						arr.splice(all, 1);
					}
					let index = arr.indexOf(key);
					if (index != -1) {
						//存在，移除
						arr.splice(index, 1);
					} else {
						arr.push(key);
					}
				}
			}
		},
		//取筛选条件
		toGo() {
			let query = {};
			//单选			
			if (!this.checked) {
				this.singleList.forEach((item, index) => {
					if (item && this.filterList[index]) {
						let row = this.filterList[index].value[item];
						query[row.type] = row.id;
					}
				});
			} else {
				//多选
				query.multiple = 1;
				this.manyList.forEach((item, index) => {
					let arr = [];
					item.forEach(res => {
						if (res && this.filterList[index]) {
							let row = this.filterList[index].value[res];
							arr.push(row.id);
						}
					});
					if (arr.length) {
						query[this.filterList[index].type] = !this.separator ? arr : arr.join(this.separator);
					}
				});
			}
			//赋值排序
			query.orderby = this.orderby;
			query.calendar = this.calendar;
			//价格
			if(!this.$u.test.empty(this.low_price) && this.low_price>=0 && this.high_price>=this.low_price){
				query.price = this.low_price+'-'+this.high_price;
			}
			//人数
			if(this.low_nums>0 && this.high_nums>=this.low_nums){
				query.nums = this.low_nums+'-'+this.high_nums;
			}
			//取定位
			if(this.orderby=='distance'){
				if(!this.vuex_location.latitude || !this.vuex_location.longitude){
					this.$u.toast('未获取到定位坐标');
					return;
				}
				query.latitude = this.vuex_location.latitude;
				query.longitude = this.vuex_location.longitude;
			}
			this.show = false;
			this.$emit('change', query);
		}
	}
};
</script>

<style lang="scss" scoped>
.orderby-select {
	image {
		width: 40rpx;
		height: 40rpx;
	}
}
.fa-select-list {
	background-color: #ffffff;
	.title {
	}
	.list {
		.item {
			background-color: #eeeeee;
			padding: 10rpx 30rpx;
			border-radius: 100rpx;
			margin-right: 15rpx;
			color: $u-tips-color;
		}
	}
}
.fa-popup {
	height: 100%;
	background-color: #f7f7f7;
	.fa-scroll-view {
		height: calc(100% - 100rpx);
	}
	.footer {
		background-color: #ffffff;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		width: 100%;
		text-align: center;
	}
}
</style>
