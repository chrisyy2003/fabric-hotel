import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = [
	'vuex_user',
	'vuex_token',
	'vuex_signin',
	'vuex_webs',
	'vuex_lasturl',
	'vuex_theme',
	'vuex_invite_id'
];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {},
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '',
		vuex_invite_id: '',
		vuex_config: {},
		vuex_theme: lifeData.vuex_theme ? lifeData.vuex_theme : {},
		vuex_lasturl: lifeData.vuex_lasturl ? lifeData.vuex_lasturl : '/pages/index/index',
		vuex_location: {
			latitude: 0,
			longitude: 0
		},
		vuex_store: {},
		vuex__token__: '',
		vuex_third: {},
		vuex_lodgerids: [],
		vuex_livenums: 0,
		vuex_signin: {},
		vuex_webs: {},
		vuex_parse_style: {
			// 字符串的形式
			h1: 'padding:20rpx 0;',
			h2: 'padding:10rpx 0;',
			h3: 'padding:10rpx 0;',
			h4: 'padding:10rpx 0;',
			h5: 'padding:5rpx 0;',
			h6: 'padding:5rpx 0;',
			ul: 'margin-bottom:20rpx;padding-left:30rpx;',
			ol: 'margin-bottom:20rpx;padding-left:30rpx;',
			code: 'background-color: #f6f6f6;margin: 0 5rpx;padding: 6rpx 8rpx;border-radius: 6rpx;text-align:center;',
			pre: 'white-space: pre;overflow: auto;background: #f6f6f6;border-radius: 8rpx;border: none;color: #1a1a1a;margin-bottom: 20rpx;padding:20rpx;',
			'pre code': 'margin:0;padding:0;',
			blockquote: 'padding: 15rpx;margin:0 0 20rpx 0;border-radius: 6rpx;',
			p: 'margin-bottom:20rpx',
			table: 'width:100%;margin-bottom:20rpx;border-collapse: collapse;',
			th: 'background-color: whitesmoke;border: 1px solid #e6e6e6;padding:10rpx;',
			td: 'border: 1px solid #e6e6e6;padding:10rpx;'
		}
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (len >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	}
})

export default store
