<template>
	<div class="userMgt-roleMan-roleInfoManagement">
		<div class="header">
			<h3 class="title">角色信息管理</h3>
			<p @click="batchDeleteRole">
				<i class="icon kedaIconfont KD-shanchuda1 keda-icon-style"></i>
				<span>删除所选</span>
			</p>
		</div>
		<div class="role-form">
			<kc-form :inline="true" :model="roleInfo" label-width="4rem"  class="form-inline">
				<kc-form-item label="角色名称" class="item item-first">
					<kc-input v-model="roleInfo.f_like_name"  @keydown.enter.native="queryRoleByExample()" clearable placeholder=""></kc-input>
				</kc-form-item>
				<kc-form-item label="角色描述" class="item">
					<kc-input v-model="roleInfo.f_like_description"  @keydown.enter.native="queryRoleByExample()" clearable placeholder=""></kc-input>
				</kc-form-item>
			</kc-form>
			<span class="search-span" @click="queryRoleByExample()">
				<i slot="suffix" class="icon kedaIconfont KD-sousuo  keda-icon-heavy-style"></i>
			</span>
		</div>
		<div class="role-table" v-loading="roleListLoading">
			<div class="bg-grey">

			</div>
			<table class="table-content">
				<thead>
					<tr>
						<th><kc-checkbox  @change="selectedAll" v-model="checkedAll"  :indeterminate="isIndeterminate"></kc-checkbox></th>
						<th><span>角色名称</span></th>
						<th><span>角色描述</span></th>
						<th><span>创建人员</span></th>
						<th><span>创建时间</span></th>
						<th><span>操作</span></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in roleList" :key="index" :class="{active:index == showActive || item.id == showActive}" @click="rowClick(item,false,index)">
					<td><kc-checkbox v-model="item.checked" @change="selectOne"></kc-checkbox></td>
					<td><span prop="name">{{item.name}}</span></td>
					<td>

						<kc-tooltip v-if="item.description.length>30" effect="light" :content="item.description" placement="bottom-start">
                        <span prop="id">{{item.description.substring(0,30)+"..."}}
                        </span>
						</kc-tooltip>
						<span v-else prop="id">
                        {{item.description}}
                    </span>
					</td>
					<td>
						<span prop="creatorName">{{item.creatorName}}</span>
					</td>
					<td><span>{{dateHandler(item.createTime)}}</span></td>
					<td>
					<span class="btn iconfont cell" @click.stop="rowClick(item,true,index)">
						<kc-tooltip content="编辑" placement="left" effect="light">
						  	<i class="icon kedaIconfont KD-bianjixiao keda-icon-style keda-icon-edit"></i>
						</kc-tooltip>
					</span>
						<span class="btn iconfont cell" @click="deleteRole">
							<kc-tooltip content="删除" placement="right" effect="light">
								<i class="icon kedaIconfont KD-shanchuxiao2 keda-icon-style keda-icon-delete"></i>
							</kc-tooltip>
					</span>
					</td>
				</tr>
				</tbody>
			</table>
			<div class="kc-table__empty-block" v-show="roleList.length === 0"><span class="kc-table__empty-text">暂无数据</span>
			</div>
		</div>
		<div class="pagination-wrapper" v-show="roleList.length > 0">
			<kc-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="pageNo"
				:page-sizes="pageSizes"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</kc-pagination>
		</div>
	</div>
</template>

<script>
	import { delOneRoleApi, delMoreRoleApi } from '../../../service/roleMgt.js';
	import { createNamespacedHelpers } from 'vuex';
	const {mapState, mapActions, mapMutations} = createNamespacedHelpers('userMgtStore');
	export default {
		data () {
			return {
				isIndeterminate: false,
				checkedAll: false,
				pageSizes: [10, 20, 30, 40, 50, 100],
				roleInfo: {
					f_like_name: '',
					f_like_description: ''
				}
			};
		},
		computed: {
			...mapState({
				showActive: state => state.roleMan.showActive,
				roleList: state => state.roleMan.roleList,
				pageNo: state => state.roleMan.pageNo,
				pageSize: state => state.roleMan.pageSize,
				total: state => state.roleMan.total,
				currentRoleId: state => state.roleMan.currentRoleId,
				isEdit: state => state.roleMan.isEdit,
				isAdd: state => state.roleMan.isAdd,
				disableRoleAuth: state => state.roleMan.disableRoleAuth,
				roleDetailInfo: state => state.roleMan.roleDetailInfo,
				roleListLoading: state => state.roleMan.roleListLoading
			}),
			ids(){
				let result = [];
				for (let i = 0, len = this.roleList.length; i < len; i++) {
					if (this.roleList[i].checked) {
						result.push(this.roleList[i].id);
					}
				}
				return result;
			}
		},
		watch: {
		},
		created () {
			this.queryRoleByExample();
		},
		mounted () {

		},
		methods: {
			...mapActions({
				userMgtQueryRole: 'userMgtQueryRole',	// 查询角色
				userMgtDeleteAllRole: 'userMgtDeleteAllRole'	// 批量删除
			}),
			...mapMutations({
				USERMGT_LOADING_ROLE: 'USERMGT_LOADING_ROLE',
				USERMGT_UPDATE_PAGE_SIZE: 'USERMGT_UPDATE_PAGE_SIZE',
				USERMGT_SET_CURRENT_ROW: 'USERMGT_SET_CURRENT_ROW',
				USERMGT_UPDATE_ISADD: 'USERMGT_UPDATE_ISADD',
				USERMGT_UPDATE_ISEDIT: 'USERMGT_UPDATE_ISEDIT',
				USERMGT_UPDATE_DISABLE_ROLEAUTH: 'USERMGT_UPDATE_DISABLE_ROLEAUTH',
				USERMGT_UPDATE_PAGE: 'USERMGT_UPDATE_PAGE',
				USERMGT_SHOW_ACTIVE: 'USERMGT_SHOW_ACTIVE'
			}),
			dateHandler (val) {
				var myDate = new Date(val);
				let y = myDate.getFullYear();
				let m = myDate.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				let d = myDate.getDate();
				d = d < 10 ? '0' + d : d;
				let h = myDate.getHours();
				h = h < 10 ? '0' + h : h;
				let mm = myDate.getMinutes();
				mm = mm < 10 ? '0' + mm : mm;
				let ss = myDate.getSeconds();
				ss = ss < 10 ? '0' + ss : ss;
				return `${y}-${m}-${d} ${h}:${mm}:${ss}`;
			},
			/* 表单 */
			clearRoleInfo () {
				this.roleInfo.f_like_name = '';
				this.roleInfo.f_like_description = '';
			},
			// 全选
			selectedAll (event) {
				if (event) {
					this.roleList.filter(item => {
						this.$set(item, 'checked', true);
					});
					this.checkedAll = true;
					this.isIndeterminate = false;
				} else {
					this.roleList.filter(item => {
						this.$set(item, 'checked', false);
					});
					this.isIndeterminate = false;
					this.checkedAll = false;
				}
			},
			// 单选
			selectOne () {
				let i = 0;
				this.roleList.forEach(item => {
					if (item.checked) {
						i++;
					}
				});
				if (i === 0) {
					this.checkedAll = false;
					this.isIndeterminate = false;
				} else if (i === this.roleList.length) {
					this.isIndeterminate = false;
					this.checkedAll = true;
				} else {
					this.isIndeterminate = true;
				}
			},
			// 查询
			queryRoleByExample () {
				this.USERMGT_LOADING_ROLE(true);
				this.USERMGT_UPDATE_PAGE(0);
				this.roleInfo['f_like_name'] = this.roleInfo['f_like_name'].trim();
				this.roleInfo['f_like_description'] = this.roleInfo['f_like_description'].trim();
				let params = {
					...this.roleInfo,
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					f_eq_status: 1
				};
				this.userMgtQueryRole(params);
			},
			// 删除单个角色
			deleteRole () {
				this.$confirm('确认删除当前选中角色吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.USERMGT_UPDATE_PAGE(0);
					let params = {
						roleId: this.currentRoleId,
						status: {
							command: 'STOP'
						}
					};
					delOneRoleApi(params).then(res => {
						if (res.status === 200) {
							this.USERMGT_SHOW_ACTIVE(0);
							this.$message({
								message: '删除角色成功',
								type: 'success',
								duration: 1000
							});
						}

						let paramsQueryRole = {
							...this.roleInfo,
							pageNo: this.pageNo,
							pageSize: this.pageSize,
							f_eq_status: 1
						};
						this.userMgtQueryRole(paramsQueryRole);
					});
				});
			},
			// 批量删
			batchDeleteRole () {
				if (this.ids.length === 0) {
					this.$message({
						message: '请选择角色进行删除',
						type: 'warning',
						duration: 1000
					});
					return;
				}
				this.$confirm('确认删除当前选中的所有角色吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then((res) => {
					delMoreRoleApi({
						ids: this.ids,
						command: 'STOP'
					}).then(res => {
						if (res.status === 200) {
							this.USERMGT_SHOW_ACTIVE(0);
							this.$message({
								message: '删除角色成功',
								type: 'success',
								duration: 1000
							});
						}
						let paramsQueryRole = {
							pageNo: this.pageNo,
							pageSize: this.pageSize,
							f_eq_status: 1
						};
						this.userMgtQueryRole(paramsQueryRole);

						setTimeout(() => {
							this.roleList.filter(item => {
								this.$set(item, 'checked', false);
							});
							this.isIndeterminate = false;
							this.checkedAll = false;
						}, 100);
					});
				});
			},
			/* 表格 */
			// 单击行
			rowClick (row, bol, index) {
				this.USERMGT_SHOW_ACTIVE(index);
				this.USERMGT_SET_CURRENT_ROW(row);
				this.USERMGT_UPDATE_ISADD(false);
				this.USERMGT_UPDATE_DISABLE_ROLEAUTH(false);
				if (bol) {
					this.USERMGT_UPDATE_ISEDIT(true);
				} else {
					this.USERMGT_UPDATE_ISEDIT(false);
				}
			},
			// 多选
			selectionChange (selection) {
				this.ids = selection.map(v => {
					return v.id;
				});
			},
			/* 分页 */
			// 页数改变
			handleSizeChange (pageSize) {
				this.USERMGT_UPDATE_PAGE_SIZE(pageSize);
				this.USERMGT_UPDATE_PAGE(1);
				let params = {
					...this.roleInfo,
					pageNo: 0,
					pageSize,
					f_eq_status: 1
				};
				this.userMgtQueryRole(params);
			},
			// 当前页码变化
			handleCurrentChange (pageNo) {
				this.USERMGT_UPDATE_PAGE(pageNo);
				let params = {
					...this.roleInfo,
					pageNo: pageNo - 1,
					pageSize: this.pageSize,
					f_eq_status: 1
				};

				this.userMgtQueryRole(params);
			}

		}
	};
</script>
