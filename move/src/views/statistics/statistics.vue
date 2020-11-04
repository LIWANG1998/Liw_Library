<template>
	<div style="background-color: #FFFFFF">
		<!-- 搜索栏 -->
		<div class="header">
			<van-search
				placeholder="搜索姓名"
				background="#FFFFFF"
				class="searchBox"
				input-align="center"
				v-model="kwd"
				@search="onSearch"
				@clear="onCancel"
				@blur="addBlur"
			/>
		</div>
		<!--<div v-if="record.ids.length==0" class="sync" @click="getsyncOrgan">-->
		<div v-if="record.ids.length==0" class="sync">
			<van-icon name="cluster-o" size="15" />组织架构
		</div>
		<div v-else class="sync" @click="goBack">
			<van-icon name="upgrade" size="15" />返回上一级
		</div>
		<div calss="content">
			<!--列表内容-->
			<van-tabs
				@change="switchTabs"
				title-active-color="#0082EF"
				color="#0082EF"
				swipeable
				line-width="20px"
				v-model="active"
				:class="{'onlyDiv':type==1}"
			>
				<!--组织架构内容列表-->
				<van-tab title="组织架构" name="1">
					<Organize
						@stratum="stratum"
						ref="child"
						:active="active"
						:keys="record.keys"
						:adddatas="record.adddatas"
					/>
				</van-tab>
				<!--标签内容列表-->
				<van-tab title="标签" name="2" v-if="type!=1">
					<Countermark
						v-if="nodata_label"
						@nodataLabel="nodataLabel"
						@stratum="stratum"
						:active="active"
						:keys="record.keys"
					/>
					<noData v-else></noData>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script>
import Organize from '@/views/statistics/components/organize.vue'
import Countermark from '@/views/statistics/components/countermark.vue'
import {  addRoles } from '@/api/organization'
import { syncOrgan } from "../../api/home";
import noData from '@/components/common/noData'
import { Toast } from 'vant'

export default {
	name: 'somePeople',
	data() {
		return {
			active: '1', //菜单tab状态
			record: {
				// 每一层的id
				ids: [],
				// 返回上一补返回的key
				keys: '',
				num: 0,
				// 搜索后获取的数据
				adddatas: '',
			},
			// 搜索框内容
			kwd: '',
			type: 99,
			// 判断是否是搜索框的搜索引发的数据变化 1不是 2是
			datatype: 1,
			isShowNoData: false, //显示没有数据页
			nodata_label: true,
		}
	},
	components: {
		Organize,
		Countermark,
		noData,
	},
	methods: {
		// 无数据
		nodataLabel(data) {
			// console.log(data)
			this.nodata_label = data
		},
		//同步组织架构
		getsyncOrgan() {
			this.$dialog
				.confirm({
					title: '即将同步组织架构',
					message:
						'请确定企业微信后台应用可见范围内,包含你本人,否则同步后你将被禁止登录，确定同步吗？',
				})
				.then(() => {
					Toast.loading({
						message: '加载中...',
						forbidClick: true,
						duration: 0,
					})
					syncOrgan().then((res) => {
						Toast.clear()
						if (res.code == 1) {
							this.$toast.success('同步成功')
						}
					})
				})
				.catch(() => {
					// on cancel
				})
		},
		// 返回上一层
		goBack() {
			if (this.datatype == 2) {
				this.datatype = 1
			} else {
				this.record.ids.pop()
				if (this.record.ids.length == 0) {
					this.record.keys = `空${this.record.num++}`
				} else {
					this.record.keys = this.record.ids[
						this.record.ids.length - 1
					]
				}
			}
		},
		switchTabs(value) {
			this.record.ids = []
			this.goBack()
		},
		// 取消按钮
		onCancel() {
			this.record.adddatas = ''
		},
		// 搜索确定事件
		onSearch() {
			this.datatype = 2
			this.active = '1'
			this.getaddRoles()
		},
		// input失去焦点
		addBlur() {
			if (this.kwd == '') {
				this.record.adddatas = ''
			}
		},
		// 每点击一次文件push一次id，返回的时候使用
		stratum(key) {
			this.record.ids.push(key)
		},
		// 根据关键词搜索人员角色信息 1部门 2人员 3标签
		getaddRoles() {
			let _this = this
			addRoles({ kwd: this.kwd, type: 2 }).then((data) => {
   
				if (data) {
					if (data.code == 1) {
						_this.record.adddatas = {
							dep_name: '',
							child_dept: data.data.child_dept,
							members: data.data.members,
						}
					} else {
						this.isShowNoData = true
					}
					this.$refs.child.isCover()
				}
			})
		},
	},
	activated() {
		if (this.$route.query.type == 1) {
			// 隐藏标签
			this.type = 1
		}
	},
}
</script>

<style lang="scss" scoped>
.header {
	background-color: #ffffff;

	.searchBox {
		background-color: #ffffff;
		width: 100%;
		height: 48px;
		box-shadow: 0px 1px 0px rgba(230, 237, 245, 1);
	}
}

.content {
	padding-bottom: 60px;
	background-color: #ffffff;
}

.sync {
	font-size: 14px;
	height: 41px;
	line-height: 41px;
	background-color: #ebebeb;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	.van-icon {
		// vertical-align: text-top;
		position: relative;
		top: -1.1px;
		padding-right: 5px;
	}
}
.onlyDiv {
	/deep/ .van-tabs__line {
		background-color: #fff !important;
	}
}
</style>