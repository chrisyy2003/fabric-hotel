<template>
	<view class="sign-wrap">
		<view class="date-wrap">
			<view class="cur-date u-flex u-row-between u-p-30">
				<view class="" @click="upDate"><u-icon name="arrow-left-double"></u-icon></view>
				<view class="">{{ year + '年' + (month + 1) + '月' }}</view>
				<view class="" @click="nextDate"><u-icon name="arrow-right-double"></u-icon></view>
			</view>
			<view class="title-item-box item-box">
				<view class="item" v-for="(item, index) in ['日', '一', '二', '三', '四', '五', '六']" :key="index">{{ item }}</view>
			</view>
			<view class="date-item-box item-box">
				<!--  -->
				<view class="item date-item" @tap="tapThis(item)" v-for="(item, index) in dateArray" :key="index">
					<text :style="[bgStyle(item)]" :class="{ isSign: item.isSign, active: item.isToday }" v-text="item.day"></text>
				</view>
			</view>
		</view>
		<u-modal v-model="show" title="确认是否补签？" :show-cancel-button="true" @confirm="confirm">
			<view class="u-p-30">
				<view class="">
					确认进行补签日期:<text class="text-danger u-m-l-10 u-m-r-10">{{fill_date}}</text>?
				</view>
				<view class="u-m-t-10">
					补签将消耗<text class="text-danger u-m-l-10 u-m-r-10">{{vuex_signin.fillupscore}}</text>积分
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
export default {
	name:'fa-signin',
	computed:{
		bgStyle(){
			return item=>{
				if(item.isToday && item.isSign){
					return {
						background:this.theme.bgColor,
						color: this.theme.color
					};
				}else{
					return {}
				}
			}
		}
	},
	data() {
		return {
			show:false,
			fill_date:'',
			itemStyle: {},
			dateArray: [],
			d_obj: null,
			year: '', //年（计算）
			month: '', //月（计算）
			today: '', //今天
			now_year: '', //年（当前）
			now_month: '', //月（当前）
			monthList: {}
		};
	},
	methods: {
		init: async function() {
			this.d_obj = new Date();
			this.year = this.now_year = this.d_obj.getFullYear();
			this.month = this.d_obj.getMonth();
			this.today = this.d_obj.getDate(); //今天
			this.now_month = this.month + 1;
			this.today = this.today < 10 ? `0${this.today}` : this.today.toString();
			this.monthList = await this.getmonthSign();
			this.getCurDate(this.year, this.month);
		},
		upDate: async function() {
			this.month--;
			if (this.month == -1) {
				this.month = 11;
				this.year--;
			}
			this.monthList = await this.getmonthSign();
			this.getCurDate(this.year, this.month);
		},
		nextDate: async function() {
			this.month++;
			if (this.month == 12) {
				this.month = 0;
				this.year++;
			}
			this.monthList = await this.getmonthSign();
			this.getCurDate(this.year, this.month);
		},
		//获取签到情况
		getmonthSign() {
			return new Promise((reject, resolve) => {
				this.$api.monthSign({ date: this.year + '-' + (this.month + 1) }).then(res => {
					if (res.code) {
						reject(res.data);
					} else {
						reject({});
					}
				});
			});
		},
		//渲染日历
		getCurDate(y, m) {			
			let week = new Date(y, m, 1).getDay(); //一号是周几
			let max = new Date(y, m + 1, 0).getDate(); //本月最大天
			this.dateArray = [];
			// 1号之前留白,对应正确的周几
			for (let i = 0; i < week; i++) {
				let obj = {
					year: '',
					month: '',
					day: '',
					isSign: false,
					isToday: false
				};
				this.dateArray.push(obj);
			}
			m = m + 1; //月份格式化
			for (let i = 0; i < max; i++) {
				let day = i + 1;
				day = day < 10 ? `0${day}` : day.toString(); //日期格式化
				let obj = {
					year: y,
					month: m,
					day: day,
					isSign: this.monthList[day] != undefined,
					isToday: y == this.now_year && m == this.now_month && day == this.today
				};
				this.dateArray.push(obj);
			}
		},
		//点击日期
		tapThis(e) {
			if (!e.day) return;
			//今天已签到
			if (e.isToday && e.isSign) {
				this.$u.toast('今天已签到,请明天再来哦');
				return;
			}
			//今天未签，签到
			if(e.isToday && !e.isSign){
				this.$emit('dosign');
				return;
			}
			//可以补签
			let chaDay = this.dateminus(e);//大于0为过去日期，小于0为未来日期			
			if (chaDay > 0 && chaDay < parseInt(this.vuex_signin.fillupdays) && !e.isSign) {
				this.fill_date = `${e.year}-${e.month}-${e.day}`;
				this.show = true;
				return;
			}
			this.$emit('dates', e);
		},
		//日期相减,
		dateminus(e) {
			return (new Date(`${this.now_year}-${this.now_month}-${this.today}`) - new Date(`${e.year}-${e.month}-${e.day}`)) / 1000 / 86400;
		},
		//确认补签
		confirm(){
			this.$emit('fillup',{fill_date:this.fill_date});
		}
	},
	mounted() {		
	
		//设置日期
		this.init();
	}
};
</script>

<style scoped lang="scss">
.date-wrap {
	width: 100%;
	padding: 2% 0;
	border-radius: 16upx;
	background: #fff;
	box-sizing: border-box;
	text-align: center;
	box-shadow: 0px 0px 5px 0px rgba(0, 34, 144, 0.1);
	.cur-date {
		font-size: 30upx;
	}
	.item-box {
		display: flex;
		color: #777;
		flex-wrap: wrap;
		font-size: 28upx;
		justify-content: flex-start;
		.item {
			width: 14.28%;
			padding: 25rpx 0;			
			text{
				padding: 5rpx 25rpx;
				border-radius: 100upx;
			}
			.isSign {
				background: #efefef;
				color: #999;
			}
		}
				
	}
}
.text-danger {
	color: #e74c3c;
}
</style>
