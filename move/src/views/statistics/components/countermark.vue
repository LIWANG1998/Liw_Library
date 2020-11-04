<template>
	<div class="countermark" :style="`height:${height}px;`">
		<van-checkbox-group v-model="result" @change="chioseNum" ref="checkDep">
			<van-cell-group>
				<van-cell v-for="(item, index) in deps.tags" clickable :key="index">
					<div @click="toggle(item.id)">
						<img class="fileimg" src="../../../assets/img/home/zuzhifile.png" alt />
						<span class="name">{{item.title}}</span>
					</div>
					<template #right-icon>
						<van-checkbox :name="item" @click="thisCheck(item)" />
					</template>
				</van-cell>
				<van-list
					v-model="loading"
					:immediate-check="false"
					:finished="finished"
					finished-text="没有更多了"
					@load="onLoad"
				>
					<van-cell v-for="item in deps.user" clickable :key="item.id">
						<div @click="onPopru(item)">
							<img class="fileimg" :src="item.avatar|img(url)" alt />
							<div class="fileimg-box">
								<span class="name">{{item.name}}</span>
								<span class="names">{{item.role_name}}</span>
								<br />
								<span class="demname ellipsis">{{item.dep_name}}</span>
							</div>
						</div>
						<template #right-icon>
							<van-checkbox :name="item" @click="thisCheck(item)" />
						</template>
					</van-cell>
				</van-list>
			</van-cell-group>
		</van-checkbox-group>
		<!--        底部已选人数总数-->
		<div class="bottboxs">
			<div>
				当前标签：
				<span style="margin-right: 10px;">{{nums.dem_num}}</span>
				总人数：
				<span>{{nums.usernum}}</span>
			</div>
			<div style="flex:1;"></div>
		</div>
		<div class="bottommenu">
			<div class="total" style="margin-right: 20px;color:#303133">
				已选人员：
				<span>{{arr.length}}人</span>
			</div>
			<div style="flex:1;"></div>
			<van-button
				class="yesbtn"
				round
				type="info"
				color="linear-gradient(to right, #0082EF, #04A9FE)"
				@click="goToaNewPlace"
				v-if="arr.length!=0"
			>确定</van-button>
		</div>
		<van-popup v-model="show" round position="bottom">
			<p class="toptitle flex-col">人员信息</p>
			<div class="flex-col textbox">
				<span class="left">头像</span>
				<div class="flex-col-bd"></div>
				<img class="imgs" :src="userClickItem.avatar|img(url)" alt />
			</div>
			<div class="flex-col textbox">
				<span class="left">姓名</span>
				<div class="flex-col-bd"></div>
				<span>{{userClickItem.name}}</span>
			</div>
			<div class="flex-col textbox">
				<span class="left">性别</span>
				<div class="flex-col-bd"></div>
				<span>{{userClickItem.gender==1?'男':'女'}}</span>
			</div>
			<div class="flex-col textbox">
				<span class="left">手机号</span>
				<div class="flex-col-bd"></div>
				<span>{{userClickItem.mobile}}</span>
			</div>
			<div class="flex-col textbox">
				<span class="left">邮箱</span>
				<div class="flex-col-bd"></div>
				<span>{{userClickItem.email}}</span>
			</div>
			<div class="flex-col textbox">
				<span class="left">部门</span>
				<div class="flex-col-bd"></div>
				<span>{{userClickItem.dep_name}}</span>
			</div>
			<div class="flex-col textbox">
				<span class="left">职务</span>
				<div class="flex-col-bd"></div>
				<span>{{userClickItem.position}}</span>
			</div>
		</van-popup>
	</div>
</template>

<script>
import { url, screenHeight } from '@/utils/utils.js'
import { getTagsList } from "@/api/home";

export default {
	name: 'countermark',
	data() {
		return {
			result: [], //组织架构菜单选中的值
			deps: [], //部门列表
			choiseAll: true,
			depTotal: 0, //选择部门多少人
			dept_id: '',
			nums: {
				dem_num: 0,
				usernum: 0,
			},
			height: '',
			ids: '',
			url,
			show: false,
			userClickItem: '',
			arr: [], // lx储存的选中数据
			finished: false, // lx分页相关
			loading: false,
			count: 0,
			page: 1,
			limit: 10,
		}
	},
	created() {
		if (!this.$store.state.somePeople) {
			this.$store.commit('set_somePeople', this.$store.state.surePeople)
		}
		this.getDeps()
	},
	mounted() {
		this.height = screenHeight(226.6)
	},
	activated() {
		if (!this.$store.state.somePeople) {
			this.$store.commit('set_somePeople', this.$store.state.surePeople)
		}
		let num = sessionStorage.getItem('num')
		if (num != 2) {
			sessionStorage.removeItem('num')
		}
		if (this.active == 2) {
			// lx
			this.isCover()
		}
	},
	props: ['keys', 'active'],
	watch: {
		keys: function (v) {
			this.eliminate()
			if (String(v).startsWith('空')) {
				this.dept_id = ''
			} else {
				this.dept_id = v
			}
			this.getDeps()
		},
	},
	filters: {
		img(urls, url) {
			let text = String(urls).startsWith('http')
			let imgurl = ''
			if (text) {
				imgurl = urls
			} else {
				imgurl = url + urls
			}
			return imgurl
		},
	},
	methods: {
		// lx滚动加载
		onLoad() {
			this.getDeps()
		},
		// lx点击部门或人员
		thisCheck(val) {
			let arr = this.$store.state.somePeople
				? this.$store.state.somePeople.split(',')
				: []
			// 当前数据是否被显示
			let isFind = this.result.some((item) => {
				return item.id == val.id
			})
			if (isFind) {
				// 显示时添加
				if (val.userids) {
					arr = [...new Set(val.userids.concat(arr))]
				} else {
					let isHave = arr.some((value) => {
						return value == val.userid
					})
					if (!isHave) {
						arr.push(val.userid)
						// 人员添加后，部门下所有人都被选时显示部门

						let newArr = [...this.deps.tags].filter((x) =>
							[...this.result].every((y) => y.id !== x.id)
						)
						let showArr = newArr.filter((item) => {
							if (item.userids) {
								return item.userids.every((v) => {
									return arr.includes(v)
								})
							}
						})
						this.result = this.result.concat(showArr)
					}
				}
			} else {
				// 取消显示时删除
				if (val.userids) {
					// 删除部门下对应人员
					arr = arr.filter(function (v) {
						return val.userids.indexOf(v) == -1
					})
				} else {
					// 删除人员
					let newArr = JSON.parse(JSON.stringify(arr))
					newArr.find((value, index) => {
						if (value == val.userid) {
							arr.splice(index, 1)
						}
					})
					// 人员删除后含有该人员的部门取消显示
					let showArr = this.result.filter((item) => {
						if (item.userids) {
							for (let i = 0; i < item.userids.length; i++) {
								return item.userids[i] == val.userid
								break
							}
						}
					})
					if (showArr.length > 0) {
						this.result = [...this.result].filter((x) =>
							[...showArr].every((y) => y.id !== x.id)
						)
					}
				}
			}
			// arr中不存在的人员取消显示
			this.result = this.result.filter((item) => {
				if (item.userids) {
					return item
				} else {
					for (let i = 0; i < arr.length; i++) {
						if (arr[i] == item.userid) {
							return item
						}
					}
				}
			})
			// arr中存在的人员显示
			let newArr = this.deps.user.filter((item) => {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i] == item.userid) {
						return item
						break
					}
				}
			})
			this.result = [...new Set(this.result.concat(newArr))]
			this.arr = arr
			// console.log(arr, '大数组')
			// console.log(this.result, '显示')
			this.$store.commit('set_somePeople', arr.join(','))
		},
		// lx判断
		isCover() {
			this.result = []
			if (this.$store.state.somePeople) {
				if (this.deps.user && this.deps.tags) {
					let arr = this.$store.state.somePeople.split(',')
					// arr中存在的人员显示
					let newArr = this.deps.user.filter((item) => {
						for (let i = 0; i < arr.length; i++) {
							if (arr[i] == item.userid) {
								return item
								break
							}
						}
					})
					this.result = [...new Set(this.result.concat(newArr))]
					// 人员添加后，部门下所有人都被选时显示部门
					let aArr = [...this.deps.tags].filter((x) =>
						[...this.result].every((y) => y.id !== x.id)
					)

					let showArr = aArr.filter((item) => {
						if (item.userids) {
							if (item.userids.length > 0) {
								return item.userids.every((v) => {
									return arr.includes(v)
								})
							}
						}
					})
					this.result = this.result.concat(showArr)
					this.arr = arr
				}
			} else {
				this.result = []
				this.arr = []
			}
		},
		// 点击确定，带上选中人员的id去下一个页面
		goToaNewPlace() {
			this.$store.commit('set_surePeople', this.arr.join(','))
			this.$store.commit('set_somePeople', '')

			this.$router.go(-1)
		},
		//部门选择多少人
		chioseNum(id) {
			let ids = ''
			for (let i = 0; i < id.length; i++) {
				if (id[i].userid == undefined) {
					if (ids == [''] || id[i].userids == '') {
						ids += id[i].userids.join(',')
					} else {
						ids += `,${id[i].userids.join(',')}`
					}
				} else {
					if (ids == [''] || id[i].userid == '') {
						ids += `${id[i].userid}`
					} else {
						ids += `,${id[i].userid}`
					}
				}
			}
			let idss = [...new Set(ids.split(','))]
			this.ids = idss.join(',')
			if (idss[0] == '') {
				this.depTotal = 0
			} else {
				this.depTotal = idss.length
			}
		},
		// 点击人员获取数据，然后弹出详情
		onPopru(item) {
			this.show = true
			this.userClickItem = item
		},
		// 部门全选
		checkDepAll() {
			this.$refs.checkDep.toggleAll(true)
			this.choiseAll = false
		},
		// 取消全选
		cacelDepCheckAll() {
			this.$refs.checkDep.toggleAll(false)
			this.choiseAll = true
		},
		//获取部门和成员
		getDeps() {
			this.loading = true
			getTagsList({ tagid: this.dept_id }).then((res) => {
				this.loading = false
				if (res.data == '') {
					this.$emit('nodataLabel', false)
					this.finished = true
					this.deps = []
				} else {
					this.loading = false
					this.deps.tags = this.dept_id?[]:res.data.tags
					if (this.page == 1) {
						this.deps.user = res.data.user
					} else {
						this.deps.user = this.deps.user.concat(res.data.user)
					}
					this.nums.dem_num = this.dept_id?0:res.data.tags.length
					this.nums.usernum = res.data.count
					this.count = res.data.count
					this.page++
					if (this.deps.user.length >= this.count) {
						this.finished = true
					}
					// lx分页滚动加载
					this.count = res.data.count
					this.isCover()
				}
			})
		},
		// 点击部门，获取部门id
		toggle(key) {
			this.eliminate()
			this.dept_id = key
			this.getDeps()
			this.$emit('stratum', key)
		},
		// 清除分页信息
		eliminate() {
			this.page = 1
			this.count = 0
			this.deps = { child_dept: [], members: [] }
			this.finished = false
			this.loading = false
		},
	},
}
</script>

<style lang="scss" scoped>
.countermark {
	color: #2d3034;
	padding-bottom: 110px;
	overflow: auto;
	.toptitle {
		margin-top: 10px;
		font-size: 16px;
		padding: 0px 20px;
		height: 40px;
		font-weight: 900;
	}
	.textbox {
		font-size: 14px;
		padding: 0px 20px;
		min-height: 45px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			color: rgb(149, 148, 148);
		}

		.imgs {
			height: 40px;
			width: 40px;
			border-radius: 5px;
		}
	}
	.yesbtn {
		height: 30px;
		padding: 0px 20px;
	}
	.van-cell {
		.fileimg {
			width: 40px;
			height: 40px;
			//   border: 1px dotted #2d3034;
			vertical-align: middle;
		}
		.fileimg-box {
			display: inline-block;
			vertical-align: top;
		}
		.demname {
			font-size: 12px;
			color: #959595;
			margin-left: 10px;
			width: 250px;
		}
		.name {
			display: inline-block;
			width: auto;
			padding-left: 10px;
		}
		.names {
			font-size: 14px;
			margin-left: 15px;
		}
		.name {
			display: inline-block;
			width: auto;
			padding-left: 10px;
		}
	}
	.bottboxs {
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		height: 50px;
		line-height: 50px;
		width: 100%;
		box-sizing: border-box;
		bottom: 60px;
		background-color: #ffffff;
		position: fixed;
		right: 0;
		max-width: 720px;
	}
	.bottommenu {
		padding: 0 20px;
		display: flex;
		align-items: center;
		height: 60px;
		line-height: 60px;
		width: 100%;
		right: 0;
		bottom: 0;
		max-width: 720px;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		background-color: #ffffff;
		border-top: 1px solid #f5f6f7;
	}
}
</style>