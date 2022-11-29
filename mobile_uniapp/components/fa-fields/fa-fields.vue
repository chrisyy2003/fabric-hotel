<template>
	<view class="fields">
		<block v-for="(item, index) in fields" :key="index">
			<!-- 地点 -->
			<view class="item" v-if="item.type == 'city'">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex">
					<u-icon name="map"></u-icon>
					<text class="u-m-l-10" :selectable="true">{{ item.value }}</text>
				</view>
			</view>

			<!-- 定位 -->
			<view class="item" v-if="item.type == 'location'">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex" @click="lookMap(item.value)">
					<u-icon name="map"></u-icon>
					<text class="u-m-l-10" :selectable="true">{{ item.value && item.value.address }}</text>
				</view>
			</view>
			<!-- 文本,数字 -->
			<view class="item" v-if="['string', 'text', 'number', 'selectpage'].indexOf(item.type) != -1">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex">
					<text class="u-m-l-10" :selectable="true">{{ item.value }}</text>
				</view>
			</view>

			<!-- 文件下载 -->
			<view class="item" v-if="['files', 'file'].indexOf(item.type) != -1"><fa-download :item="item"></fa-download></view>

			<!-- 列表 -->
			<view class="item" v-if="item.type == 'select' || item.type == 'radio'">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex">
					<text class="u-m-l-10" :selectable="true">{{ item.content_list[item.value] }}</text>
				</view>
			</view>
			<!-- 开关 -->
			<view class="item" v-if="item.type == 'switch'">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex">
					<text class="u-m-l-10">{{ item.value }}</text>
				</view>
			</view>

			<!-- 关联多选 -->
			<view class="item" v-if="item.type == 'selectpages'">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex">
					<text class="u-m-l-10" :selectable="true">{{ item.value.join(',') }}</text>
				</view>
			</view>

			<!-- 列表多选 -->
			<view class="item" v-if="item.type == 'selects' || item.type == 'checkbox'">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex">
					<text class="u-m-l-10">{{ listSelects(item) }}</text>
				</view>
			</view>
			<!-- 图 -->
			<view class="item" v-if="['images', 'image'].indexOf(item.type) != -1"><fa-images :item="item"></fa-images></view>
			<!-- 富文本 -->
			<view class="item" v-if="item.type == 'editor'">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex">
					<u-parse
						:html="item.value"
						:tag-style="vuex_parse_style"
						:domain="vuex_config.upload ? vuex_config.upload.cdnurl : ''"
						@linkpress="navigate"
					></u-parse>
				</view>
			</view>
			<!-- 时间 -->
			<view class="item" v-if="['date', 'time', 'datetime', 'datetimerange'].indexOf(item.type) != -1">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content u-flex">
					<u-icon name="clock"></u-icon>
					<text class="u-m-l-10" :selectable="true" v-text="item.value"></text>
				</view>
			</view>

			<!-- 数组 -->
			<view class="item" v-if="item.type == 'array'">
				<view class="u-m-b-30 text-weight u-font-30">					
					<view class="u-item-title" v-text="item.title"></view>
				</view>
				<view class="content">
					<u-table>
						<u-tr class="u-tr">
							<u-th class="u-th" v-text="item.setting.key"></u-th>
							<u-th class="u-th" v-text="item.setting.value"></u-th>
						</u-tr>
						<u-tr class="u-tr" v-for="(res, ink) in item.value" :key="ink">
							<u-td class="u-td" v-text="ink"></u-td>
							<u-td class="u-td" v-text="res"></u-td>
						</u-tr>
					</u-table>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	props: {
		fields: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	computed: {
		listSelects() {
			return item => {
				if (!item) {
					return item;
				}
				let arr = [];
				let varArr = item.value.split(',');
				varArr.forEach(res => {
					arr.push(item.content_list[res]);
				});
				return arr.join(',');
			};
		},
		fileType() {
			return filename => {
				var index1 = filename.lastIndexOf('.');
				var index2 = filename.length;
				return filename.substring(index1, index2);
			};
		}
	},
	data() {
		return {};
	},
	methods:{
		lookMap(item) {
			if(!item) return;			
			uni.openLocation({
				latitude: parseFloat(item.lat),
				longitude: parseFloat(item.lng),
				success: function() {
					console.log('success');
				}
			});
		},
		swipers(index){			
			uni.previewImage({
				current: index,
				urls: this.detail.images_text,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log(data);
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.fields{
	.item{
		background-color: #FFFFFF;
		padding: 30rpx;
		margin-top: 15rpx;
	}
}
</style>
