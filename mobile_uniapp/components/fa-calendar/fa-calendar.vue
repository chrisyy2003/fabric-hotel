<template>
	<view>
		<u-popup v-model="value" :popup="false" mode="bottom" height="90%" width="100%" @close="close">
			<view class="content">
				<view class="header">
					<view class="bar"></view>
					<view class="set text-gray u-font-35">
						<text @click="close">关闭</text>
						<text @click="reset">清空</text>
					</view>
					<view class="in-and-out">
						<view class="item" v-if="start.length > 0">
							<view class="u-font-30 u-tips-color">入住日期</view>
							<view class="text-weight u-m-t-10 u-font-35">{{ startDay }}</view>
							<view class="u-font-24 u-m-t-10">{{ startWeek }}</view>
						</view>
						<view class="item text" v-if="start.length == 0"><view>入住日期</view></view>
						<view class="item">
							<view
								class="count-border u-p-b-10"
								:style="[
									{ color: day == 0 ? '#c0c0c0' : theme.bgColor, borderBottom: day == 0 ? '1px solid #c0c0c0' : '1px solid ' + theme.bgColor }
								]"
							>
								<view class="count">共{{ day }}晚</view>
							</view>
						</view>
						<view class="item text" v-if="end.length == 0"><view>离店日期</view></view>
						<view class="item" v-if="end.length > 0">
							<view class="u-font-30 u-tips-color">离店日期</view>
							<view class="text-weight u-m-t-10 u-font-35">{{ endDay }}</view>
							<view class="u-font-24 u-m-t-10">{{ endWeek }}</view>
						</view>
					</view>
					<view class="week">
						<view>日</view>
						<view>一</view>
						<view>二</view>
						<view>三</view>
						<view>四</view>
						<view>五</view>
						<view>六</view>
					</view>
				</view>
				<view class="section">
					<view v-for="(res, line) in date" class="item" :key="line">
						<view class="year">{{ res.year }}年{{ res.month }}月</view>
						<view class="day u-flex u-flex-wrap">
							<!-- 空白日期 -->
							<!-- #ifdef MP-WEIXIN -->
							<view v-for="(week,index) in res.oneDayWeek" :key="index" class="day-list"></view>
							<!-- #endif -->
							<!-- #ifndef MP-WEIXIN -->
							<view v-for="(week,index) in res.oneDayWeek" :key="index+999" class="day-list"></view>
							<!-- #endif -->
							<!-- 日期 -->
							<view
								v-for="(item, index) in res.days"
								:key="index"
								@tap="selectDay(line, index, item)"
								class="day-list"
								:class="{
									'time-out': (line == 0 && index + 1 < nowDay) || item.is_disabled,
									'is-festival': item.festival,
									'not-festival':
										(!item.festival && line == start[0] && index == start[1]) || (!item.festival && line == end[0] && index == end[1])
								}"
								:style="[selectStyle(line, index, item)]"
							>
								<view class="" v-if="line == start[0] && index == start[1]">入住</view>
								<view class="" v-if="line == end[0] && index == end[1]">离店</view>

								<view v-if="!item.bookedup">
									<view class="day-day text-weight">{{ item.festival ? item.festival : item.day }}</view>
									<view class="day-price">￥{{ item.price }}</view>
								</view>

								<view class="u-tips-color" v-if="item.bookedup">
									<view>{{ item.day }}</view>
									<view>无房</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="submit u-p-10">
					<u-button type="default" hover-class="none" :custom-style="calendStyle" :disabled="!isSub" @click="submit">
						<text v-if="isSub">确定</text>
						<text v-if="!isSub && !start.length">请选择入住日期</text>
						<text v-if="!isSub && start.length && !end.length">请选择离店日期</text>
					</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
var festival = {
	'0101': '元旦',
	'0214': '情人节',
	'0308': '妇女节',
	'0312': '植树节',
	'0401': '愚人节',
	'0501': '劳动节',
	'0504': '青年节',
	'0520': '母亲节',
	'0630': '父亲节',
	'0801': '建军节',
	'0910': '教师节',
	'1001': '国庆节',
	'1144': '感恩节',
	'1224': '平安夜',
	'1225': '圣诞节'
};
var lunarFestival = {
	'0101': '春节',
	'0102': '初二',
	'0115': '元宵节',
	'0505': '端午节',
	'0707': '七夕节',
	'0715': '中元节',
	'0815': '中秋节',
	'0909': '重阳节',
	'1208': '腊八节',
	'1223': '小年',
	'0100': '除夕'
};
export default {
	name: 'fa-calendar',
	props: {
		value: {
			type: Boolean,
			default: true
		},
		//日历价格
		calendar: {
			type: Array,
			default() {
				return [];
			}
		},
		//被预订日期
		orderCalendar: {
			type: Array,
			default() {
				return [];
			}
		},
		//默认价格
		price: {
			type: [Number, String],
			default: 0
		},
		//默认开始日期
		startTime: {
			type: String,
			default: ''
		},
		//默认离开日期
		endTime: {
			type: String,
			default: ''
		}
	},
	computed: {
		//选择的样式
		selectStyle() {
			return (line, index, item) => {
				let style = {};
				let a = line == this.start[0] && index == this.start[1];
				let b = line == this.end[0] && index == this.end[1];
				if (b || a) {
					style.backgroundColor = this.theme.bgColor;					
					style.color = this.theme.color;
				}
				if (
					(line >= this.start[0] && line <= this.end[0] && index > this.start[1] && index < this.end[1]) ||
					(line >= this.start[0] && index > this.start[1] && line < this.end[0]) ||
					(line <= this.end[0] && index < this.end[1] && line > this.start[0]) ||
					(line < this.end[0] && line > this.start[0])
				) {
					style.backgroundColor = this.theme.lightColor;
				}
				if (item.festival && !a && !b) {
					if (line == 0 && index + 1 > this.nowDay) {
						style.color = this.theme.bgColor;						
					} else if (line > 0) {
						style.color = this.theme.bgColor;						
					}
				}
				if ((item.week == 0 || item.week == 6) && !a && !b) {
					if (line == 0 && index + 1 > this.nowDay) {
						style.color = this.theme.bgColor;						
					} else if (line > 0) {
						style.color = this.theme.bgColor;						
					}
				}
				return style;
			};
		},
		calendStyle() {
			let style = { color: this.theme.color };
			if (this.isSub) {
				style.backgroundColor = this.theme.bgColor;
			} else {
				style.backgroundColor = '#d3d5d6';
			}
			return style;
		},
		//房间是否能预订
		isSub() {
			return this.start.length == 2 && this.end.length == 2 ? true : false;
		}
	},
	mounted() {
		this.nowDay = new Date().getDate();
		this.setDate();
	},
	data() {
		return {
			out: 0,

			festival: [], //节假日

			type: '-', //日期分隔符
			date: [], //日期数组对象
			nowDay: 0, //当前时间的日
			count: 6, //显示月的数量

			start: [], //入住时间
			startDay: '', //入住日期
			startWeek: '', //入住时间的周几

			end: [], //离开时间
			endDay: '', //离开日期
			endWeek: '', //离开时间的周几

			bookedtime: [],

			is_init: false,

			day: 0 //多少晚
		};
	},
	watch: {
		//离店日期
		end(newVal) {
			if (this.end.length != 0) {
				//计算选择离店日期
				this.endDay = this.date[newVal[0]].month + '月' + this.date[newVal[0]].days[newVal[1]].day + '日';
				this.endWeek = this.getWeek(this.date[newVal[0]].days[newVal[1]].week);

				//计算天数
				var startDay = this.date[this.start[0]].year + '/' + this.date[this.start[0]].month + '/' + this.date[this.start[0]].days[this.start[1]].day;
				var endDay = this.date[newVal[0]].year + '/' + this.date[newVal[0]].month + '/' + this.date[newVal[0]].days[newVal[1]].day;

				this.day = this.getDay(startDay, endDay);
				//放开禁用的日期
				this.bookedtime = [];
				this.setDisabled();
			} else {
				this.day = 0;
			}
		},
		//入住日期
		start(newVal) {
			if (this.start.length > 0) {
				this.startDay = this.date[newVal[0]].month + '月' + this.date[newVal[0]].days[newVal[1]].day + '日';
				let time = this.date[newVal[0]].year + '/' + this.date[newVal[0]].month + '/' + this.date[newVal[0]].days[newVal[1]].day;
				this.startWeek = this.getWeek(this.date[newVal[0]].days[newVal[1]].week);
				//先排序
				this.orderCalendar.sort(function(a, b) {
					return a.reserve_time - b.reserve_time;
				});
				//找到大于选中开始日期的被预定的日期
				let row = this.orderCalendar.find(item => {
					return item.reserve_time * 1000 > new Date(time).getTime();
				});
				this.bookedtime = [];
				if (this.is_init && row) {
					this.bookedtime = row.reserve_time_text.split('-');
				}
				if (!this.is_init) {
					this.is_init = true;
				}
				this.setDisabled();
			}
		}
	},
	methods: {
		//补零操作
		setPull(day) {			
			return day.toString().padStart(2, '0');
		},
		//设置禁用的日期
		setDisabled() {
			this.date.map((item, line) => {
				item.days.map(res => {
					res.is_disabled = false;
					if (this.bookedtime.length == 3) {
						if (item.year > this.bookedtime[0]) {
							res.is_disabled = true;
						}
						if (item.year == this.bookedtime[0] && parseInt(item.month) > parseInt(this.bookedtime[1])) {
							res.is_disabled = true;
						}
						if (
							item.year == this.bookedtime[0] &&
							parseInt(item.month) == parseInt(this.bookedtime[1]) &&
							parseInt(res.day) > parseInt(this.bookedtime[2])
						) {
							res.is_disabled = true;
						}
					}
				});
			});
		},
		//清空
		reset() {
			this.start = [];
			this.end = [];
			this.day = 0;
			//放开禁用的日期
			this.bookedtime = [];
			this.setDisabled();
		},
		//计算天数
		getDay(date1, date2) {
			//获得天数
			//date1：开始日期，date2结束日期
			var a1 = Date.parse(new Date(date1));
			var a2 = Date.parse(new Date(date2));
			var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //时间戳相减，然后除以天数
			return day;
		},
		//计算周几
		getWeek(week) {
			var weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			return weekDay[week];
		},
		//选择入住离开
		selectDay(line, index, item) {
			//本月过去的不能选
			if (line == 0 && index + 1 < this.nowDay) return;

			if (item.is_disabled) {
				this.$u.toast('不能跨已预订日期选择');
				return;
			}

			//如果没有入住时间
			if (
				this.start.length == 0 ||
				(this.end.length == 0 && line < this.start[0]) ||
				(this.end.length == 0 && line == this.start[0] && index <= this.start[1])
			) {
				//开始日期，如果被预订的不能选
				if (item.bookedup) {
					this.$u.toast('该日期已被预订');
					return;
				}
				//填充入住时间
				this.start = [line, index];
				//同一个天数
			} else if (this.start.length > 0 && this.start[0] == line && this.start[1] == index && this.end.length == 0) {
				return;
			} else {
				//如果没有离开时间，并且选择离开时间大于入住时间
				if (this.end.length == 0) {
					this.end = [line, index];
				} else {
					//清空离开时间重新填充入住时间
					if (item.bookedup) {
						this.$u.toast('该日期已被预订');
						return;
					}
					this.start = [line, index];
					this.end = [];
				}
			}
		},
		//渲染日历显示
		setDate() {
			//日历价格
			let calendar = {};
			this.calendar.map(item => {
				calendar[item.day_time_text] = item.price;
			});

			//被预订了
			let orderCalendar = {};
			this.orderCalendar.map(item => {
				orderCalendar[item.reserve_time_text] = 1;
			});

			console.log(calendar, orderCalendar);
			//年份
			let year = new Date().getFullYear();
			//月份
			let month = new Date().getMonth();
			// 日历
			let date = [];

			for (let i = 0; i < this.count; i++) {
				//循环月份
				var days = [];
				var week = 0;
				let m = this.setPull(month + 1);
				//循环天数
				for (let j = 0; j < new Date(year, m, 0).getDate(); j++) {
					let day = this.setPull(j + 1);
					let price = calendar[`${year}-${m}-${day}`] || this.price;
					let bookedup = orderCalendar[`${year}-${m}-${day}`] || 0;
					let lunar = this.$util.getLunarCalendar(year,month,j+1);//获取农历
					if(lunar.lunarMonth == '01' && lunar.lunarDay == '01' && j>0){
                        days[j-1].festival = '除夕';
                    }							
					days.push({
						day: day,
						price: parseInt(price),
						bookedup: bookedup, //被预定
						festival: festival[`${m}${day}`] || lunarFestival[`${lunar.lunarMonth}${lunar.lunarDay}`] || lunar.solarTerm,					
						week: new Date(Date.parse(`${year}/${m}/${day}`)).getDay(),
						is_disabled: false ,//选择的时候判断禁用的
						lunar:lunar
					});
					//找第一天未被预订为默认天数,后一天为默认离开日期
					if (!bookedup && this.start.length == 0 && ((i == 0 && j + 1 >= this.nowDay) || i > 0)) {
						this.start = [i, j];
						//判断下一天是否是月未
						if (j + 1 < new Date(year, m, 0).getDate()) {
							this.end = [i, j + 1];
						} else {
							this.end = [i + 1, 0];
						}
					}
					//如果默认有传入
					if (this.startTime && this.endTime) {
						let start = this.startTime.split('-');
						let end = this.endTime.split('-');
						if (start.length == 3 && year == start[0] && m == start[1] && day == start[2]) {
							this.start = [i, j];
						}
						if (end.length == 3 && year == end[0] && m == end[1] && day == end[2]) {
							this.end = [i, j];
						}
					}
				}

				date.push({
					year: year,
					month: m,
					days: days,
					oneDayWeek: new Date(Date.parse(year + '/' + m + '/' + '01')).getDay()
				});

				if (month == 11) {
					year += 1;
					month = 0;
				} else {
					month++;
				}
			}
			this.date = date;			
			//执行一次计算
			if (this.start.length == 2 && this.end.length == 2) {
				var startDay = this.date[this.start[0]].year + '/' + this.date[this.start[0]].month + '/' + this.date[this.start[0]].days[this.start[1]].day;
				var endDay = this.date[this.end[0]].year + '/' + this.date[this.end[0]].month + '/' + this.date[this.end[0]].days[this.end[1]].day;
				this.day = this.getDay(startDay, endDay);
				this.submit();
			}
		},
		//关闭
		close() {
			this.$emit('input', false);
		},
		//确定入住离店事件提交
		submit(e) {
			let st = this.start[0];
			let et = this.end[0];
			var obj = {
				start: this.date[st].year + this.type + this.date[st].month + this.type + this.date[st].days[this.start[1]].day,
				end: this.date[et].year + this.type + this.date[et].month + this.type + this.date[et].days[this.end[1]].day,
				startTimeDay: this.date[st].year + '年' + this.date[st].month + '月' + this.date[st].days[this.start[1]].day + '日',
				endTimeDay: this.date[et].year + '年' + this.date[et].month + '月' + this.date[et].days[this.end[1]].day + '日',
				startDay: this.date[st].month + '月' + this.date[st].days[this.start[1]].day + '日',
				endDay: this.date[et].month + '月' + this.date[et].days[this.end[1]].day + '日',
				day: this.day
			};
			//计算房费
			let amount = 0;
			for (let i = st; i <= et; i++) {
				let s_j = 0;
				let e_j = new Date(this.date[i].year, this.date[i].month, 0).getDate();
				if (i == st) {
					//第一个
					s_j = this.start[1];
				}
				if (i == et) {
					//最后一个
					e_j = this.end[1];
				}
				for (let j = s_j; j < e_j; j++) {
					amount += this.date[i].days[j].price;
				}
			}
			obj.amount = amount;
			this.$emit('input', false);
			this.$emit('confirm', obj,e);
		}
	}
};
</script>

<style lang="scss">
/**确认按钮**/
.submit {
	width: 100%;
	background: white;
	position: fixed;
	bottom: 0rpx;
	height: auto;
}

.content {
	z-index: 999;
}

/**
 * 日期部分
 */
.section {
	width: 100%;
	padding-bottom: 150rpx;
	height: auto;
	padding-top: 440rpx;
	background-color: #ffffff;
	.item {
		.year {
			text-align: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			font-weight: bold;
		}
		.day {
			display: flex;
			flex-wrap: wrap;
			text-align: center;
			margin: 0 5px;
			.day-list {
				margin-top: 15rpx;
				margin-bottom: 15rpx;				
				width: calc(100% / 7);
				display: flex;
				height: 110rpx;
				font-size: 28rpx;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.day-day {
					font-size: 28rpx;
				}
				.day-price {
					color: #999;
					font-size: 28rpx;
				}
			}
			/* 节假日的日期样式 */
			.is-festival {
				.day-day {
					font-size: 22rpx;
				}
			}

			/** 非节假日的日期样式**/
			.not-festival {
				font-size: 28rpx;
				color: white;
			}
			.time-out {
				text-decoration: line-through;
				color: #c0c0c0;
			}
		}
	}
}

/**
 * 头部固定
 */
.header {
	position: fixed;
	top: 0;
	width: 100%;
	height: 380rpx;
	background: white;
	.bar {
		width: 100%;
		height: var(--status-bar-height);
		background: #222222;
	}
	.set {
		height: 100rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;

		align-items: center;
		display: flex;
		justify-content: space-between;
	}
	.in-and-out {
		height: 210rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.item {
			display: flex;
			flex-direction: column;
			height: 100rpx;
			.count-border {
				width: 200rpx;
				font-size: 30rpx;
				height: 40rpx;
				margin-top: 48rpx;
				text-align: center;
				line-height: 25rpx;
				.count {
					font-size: 30rpx;
				}
			}
		}
		.text {
			margin-top: 100rpx;
			font-weight: bold;
			font-size: 36rpx;
			color: #c0c0c0;
		}
	}
	/**
	 * 周一到周日
	 */
	.week {
		border-bottom: 1px solid #dcdcdc;
		border-top: 1px solid #dcdcdc;
		height: 70rpx;
		display: flex;
		margin-bottom: 20rpx;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		background: white;
		text-align: center;
		padding: 0 5px;
		view {
			width: calc(100% / 7);
		}
	}
}
</style>
