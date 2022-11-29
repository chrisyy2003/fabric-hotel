function strlen(value) {
	//中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
	let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
	let mat = value.match(cnReg);
	let length = 0;
	if (mat) {
		return (length = mat.length + (value.length - mat.length) * 0.5);
	} else {
		return (length = value.length * 0.5);
	}
}

/**
 *
 *  判断是否在微信浏览器 true是
 */
function isWeiXinBrowser() {
	// #ifdef H5	
	let ua = window.navigator.userAgent.toLowerCase()
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true
	} else {
		return false
	}
	// #endif
	return false
}


/**
 * 获取url参数
 * @param {*} name
 * @param {*} 
 * @returns
 */
function getQueryString(name, url) {
	var url = url || window.location.href
	var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
	var r = url.substr(1).match(reg)
	if (r != null) {
		return r[2]
	}
	return null
}

//路径转化
function getPath(path) {
	if (path.indexOf('?') != -1) {
		let arr = path.split('?');
		return arr[0];
	}
	return path;
}


function uniCopy({
	content,
	success,
	error
}) {

	content = typeof content === 'string' ? content : content.toString() // 复制内容，必须字符串，数字需要转换为字符串

	/**
	 * 小程序端 和 app端的复制逻辑
	 */
	//#ifndef H5
	uni.setClipboardData({
		data: content,
		success: function() {
			success("复制成功~")
		},
		fail: function() {
			error("复制失败~")
		}
	});
	//#endif

	/**
	 * H5端的复制逻辑
	 */
	// #ifdef H5
	if (!document.queryCommandSupported('copy')) { //为了兼容有些浏览器 queryCommandSupported 的判断
		// 不支持
		error('浏览器不支持')
	}
	let textarea = document.createElement("textarea")
	textarea.value = content
	textarea.readOnly = "readOnly"
	document.body.appendChild(textarea)
	textarea.select() // 选择对象
	textarea.setSelectionRange(0, content.length) //核心
	let result = document.execCommand("copy") // 执行浏览器复制命令
	if (result) {
		success("复制成功~")
	} else {
		error("复制失败，请检查h5中调用该方法的方式，是不是用户点击的方式调用的，如果不是请改为用户点击的方式触发该方法，因为h5中安全性，不能js直接调用！")
	}
	textarea.remove()
	// #endif
}


//设置缓存
function setDb(name, value, db_time = 7200) {
	let time = (new Date()).getTime();
	let data = {
		value: value,
		time: time,
		db_time: db_time
	}
	uni.setStorageSync(name, data);
}
//获取缓存
function getDb(name) {
	try {
		let res = uni.getStorageSync(name);
		if (!res) {
			return '';
		}
		let time = (new Date()).getTime();
		if ((time - res.time) / 1000 >= res.db_time) {
			uni.removeStorageSync(name);
			return '';
		}
		return res.value;
	} catch (e) {
		//TODO handle the exception
		return '';
	}
}

//获取农历
function getLunarCalendar(GY, GM, GD) {

	let lunarInfo = [
		0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
		0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
		0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
		0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
		0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
		0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
		0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
		0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
		0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
		0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
		0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
		0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
		0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
		0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
		0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
	]

	//==== 传回农历 year年的总天数
	function lYearDays(year) {
		let i, sum = 348
		for (i = 0x8000; i > 0x8; i >>= 1) {
			sum += (lunarInfo[year - 1900] & i) ? 1 : 0
		}
		return (sum + leapDays(year))
	}

	//==== 传回农历 year年闰月的天数
	function leapDays(year) {
		if (leapMonth(year)) {
			return ((lunarInfo[year - 1900] & 0x10000) ? 30 : 29)
		} else {
			return 0
		}
	}

	//==== 传回农历 year年闰哪个月 1-12 , 没闰传回 0
	function leapMonth(year) {
		return (lunarInfo[year - 1900] & 0xf)
	}

	//==== 传回农历 year年month月的总天数
	function monthDays(year, month) {
		return ((lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29)
	}

	//==== 算出农历, 传入日期对象, 传回农历日期对象
	//     该对象属性有 农历年year 农历月month 农历日day 是否闰年isLeap yearCyl dayCyl monCyl
	function Lunar(objDate) {
		let i, temp = 0
		let baseDate = new Date(1900, 0, 31)
		let offset = Math.floor((objDate - baseDate) / 86400000)

		let dayCyl = offset + 40
		let monCyl = 14

		for (i = 1900; i < 2050 && offset > 0; i++) {
			temp = lYearDays(i)
			offset -= temp
			monCyl += 12
		}
		if (offset < 0) {
			offset += temp;
			i--;
			monCyl -= 12
		}
		//农历年
		let year = i
		let yearCyl = i - 1864

		let leap = leapMonth(i) //闰哪个月
		let isLeap = false //是否闰年

		for (i = 1; i < 13 && offset > 0; i++) {
			//闰月
			if (leap > 0 && i === (leap + 1) && isLeap === false) {
				--i;
				isLeap = true;
				temp = leapDays(year);
			} else {
				temp = monthDays(year, i);
			}

			//解除闰月
			if (isLeap === true && i === (leap + 1)) {
				isLeap = false
			}

			offset -= temp
			if (isLeap === false) {
				monCyl++
			}
		}

		if (offset === 0 && leap > 0 && i === leap + 1)
			if (isLeap) {
				isLeap = false
			}
		else {
			isLeap = true
				--i
				--monCyl
		}

		if (offset < 0) {
			offset += temp
				--i
				--monCyl
		}
		//农历月
		let month = i
		//农历日
		let day = offset + 1

		return {
			year: year,
			month: month,
			day: day,
			isLeap: isLeap,
			leap: leap,
			yearCyl: yearCyl,
			dayCyl: dayCyl,
			monCyl: monCyl
		}
	}

	//==== 中文日期 m为传入月份，d为传入日期
	function cDay(m, d) {
		let nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
		let nStr2 = ['初', '十', '廿', '卅', '']
		//农历中文月
		let lunarMonthCn
		//农历中文日
		let lunarDayCn
		if (m > 10) {
			lunarMonthCn = '十' + nStr1[m - 10]
		} else {
			lunarMonthCn = nStr1[m]
		}
		lunarMonthCn += '月'

		switch (d) {
			case 10:
				lunarDayCn = '初十';
				break;
			case 20:
				lunarDayCn = '二十';
				break;
			case 30:
				lunarDayCn = '三十';
				break;
			default:
				lunarDayCn = nStr2[Math.floor(d / 10)] + nStr1[d % 10]
		}
		return {
			lunarMonthCn: lunarMonthCn,
			lunarDayCn: lunarDayCn
		}
	}

	//节气
	function getSolarTerm() {
		let sTermInfo = [
			0, 21208, 42467, 63836, 85337, 107014,
			128867, 150921, 173149, 195551, 218072, 240693,
			263343, 285989, 308563, 331033, 353350, 375494,
			397447, 419210, 440795, 462224, 483532, 504758
		]
		let solarTerm = [
			'小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
			'清明', '谷雨', '立夏', '小满', '芒种', '夏至',
			'小暑', '大暑', '立秋', '处暑', '白露', '秋分',
			'寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
		]

		let solarTerms = ''
		let tmp1 = new Date(
			(31556925974.7 * (GY - 1900) + sTermInfo[GM * 2 + 1] * 60000) + Date.UTC(1900, 0, 6, 2, 5)
		)
		let tmp2 = tmp1.getUTCDate()
		if (tmp2 === GD) solarTerms = solarTerm[GM * 2 + 1]
		tmp1 = new Date(
			(31556925974.7 * (GY - 1900) + sTermInfo[GM * 2] * 60000) + Date.UTC(1900, 0, 6, 2, 5)
		)
		tmp2 = tmp1.getUTCDate()
		if (tmp2 === GD) solarTerms = solarTerm[GM * 2]

		return solarTerms
	}
	
	const calendar = {
		lunarYear: null, //农历年
		lunarMonth: null, //农历月
		lunarDay: null, //农历日                            
		lunarMonthCn: '', //农历中文月
		lunarDayCn: '', //农历中文日                                        
		solarTerm: '', //节气
	}
	//去掉时分秒的日期
	let sDObj = new Date(GY, GM, GD);
	let lDObj = new Lunar(sDObj);
	//农历年月日、生肖年
	calendar.lunarYear = lDObj.year
	calendar.lunarMonth = (lDObj.month+'').padStart(2,'0')
	calendar.lunarDay = (lDObj.day+'').padStart(2,'0')
	//农历中文年月日           
	calendar.lunarMonthCn = cDay(lDObj.month, lDObj.day).lunarMonthCn
	calendar.lunarDayCn = cDay(lDObj.month, lDObj.day).lunarDayCn
	//节气
	calendar.solarTerm = getSolarTerm();
	return calendar;
}

export {
	strlen,
	isWeiXinBrowser,
	getQueryString,
	getPath,
	uniCopy,
	setDb,
	getDb,
	getLunarCalendar
}
