<template>
	<div class="userMgt-userMgt-userRole">
		<kc-tabs stretch @tab-click="restRoles" :disabled="disableCheckBox">
			<kc-tab-pane label="所有角色" style="height: 100%">
				<kc-input class="common-input-style" placeholder="请输入过滤内容" v-model="searchContent"
						  style="margin-bottom:3px;" @keyup.enter.native="enterSearch">
					<i slot="suffix" class="icon kedaIconfont KD-sousuo  keda-icon-heavy-style" @click="enterSearch"></i>
				</kc-input>
				<div class="kc-table-primary">
					<table ref="userRoleTable" class="userRoleTable" :disabled="disableCheckBox">
						<thead>
						<tr>
							<th><kc-checkbox  @change="allSelectedAll"  v-model="checkedAllRole"  :indeterminate="isIndeterminateRole" :disabled="disableCheckBox"></kc-checkbox></th>
							<th>角色信息</th>
							<th>操作</th>
						</tr>
						</thead>
						<tbody v-loading="roleDataLoading">
						<tr v-for="(item, index) in roleData" :key="index"><!--editRole(tableData[index])-->
							<td><kc-checkbox v-model="item.checked"  @change="selectionSelected(item, index)" :disabled="disableCheckBox"></kc-checkbox></td>
							<td :title="item.name">
								{{item.name}}
							</td>
							<td>
							<span @click="roleDetailClick(item.id)">
								<kc-tooltip class="item" effect="light" content="查看详情" placement="left">
								  	<i class="icon kedaIconfont KD-xiangqing keda-icon-style" ></i>
								</kc-tooltip>
							</span>
							</td>
						</tr>
						</tbody>
					</table>
					<div class="kc-table__empty-block" v-show="roleData.length === 0" ><span class="kc-table__empty-text">暂无数据</span></div>
				</div>
			</kc-tab-pane>
			<kc-tab-pane label="已选角色" style="height: 100%">
				<kc-input class="common-input-style" placeholder="请输入过滤内容" style="margin-bottom:3px;"
						  v-model="searchContent1" @keyup.enter.native="enterSearch1">
					<i slot="suffix" class="icon kedaIconfont KD-sousuo  keda-icon-heavy-style" @click="enterSearch1"></i>
				</kc-input>
				<div class="kc-table-primary">
					<table ref="chosedRoleDataTable" class="userRoleTable" :disabled="disableCheckBox">
						<thead>
						<tr>
							<th><kc-checkbox @change="selectedAll" v-model="checkedAllRoleChosed"  :indeterminate="isIndeterminateRoleChosed" :disabled="disableCheckBox"></kc-checkbox></th>
							<th>角色信息</th>
							<th>操作</th>
						</tr>
						</thead>
						<tbody v-loading.lock="chosedRoleLoading">
						<tr v-for="(item, index) in chosedRoleData" :key="index" style="text-align: center ;" ><!--editRole(tableData[index])-->
							<td><kc-checkbox v-model="item.checked"  @change="selectedRoleSelection(item)" :disabled="disableCheckBox"></kc-checkbox></td>
							<td>
								<span>{{item.name}}</span>
							</td>
							<td>
								<span @click="roleDetailClick(item.id)">
									<kc-tooltip class="item" effect="light" content="查看详情" placement="left">
									  	<i class="icon kedaIconfont KD-xiangqing keda-icon-style" ></i>
									</kc-tooltip>
								</span>
							</td>
						</tr>
						</tbody>
					</table>
					<div class="kc-table__empty-block" v-show="chosedRoleData.length === 0" ><span class="kc-table__empty-text">暂无数据</span></div>
				</div>
			</kc-tab-pane>
		</kc-tabs>


		<kc-modal
			title="角色详情"
			:visible.sync="dialogVisible"
			width="50%"
			class="m-scroll">
			<role-auth :role-id="currentRoleId"></role-auth>
			<span slot="footer" class="dialog-footer">
			</span>
		</kc-modal>
	</div>
</template>
<script>
	import {
		allRoles
	} from '../../../service/roleMgt.js';
	import {
		changeUserRoleApi
	} from '../../../service/userMgt.js';
	import roleAuth from '../../../components/RoleAuth';
	import Vue from 'vue';
	import { createNamespacedHelpers } from 'vuex';
	const {mapState, mapMutations} = createNamespacedHelpers('userMgtStore');
	export default {
		components: {
			roleAuth
		},
		props: {
			chosedRoleInfo: {
				type: Object
			},
			defaultAllRoles: {
				type: Array
			}
		},
		data () {
			return {
				checkedAllRole: false,
				isIndeterminateRole: false,
				checkedAllRoleChosed: true,
				isIndeterminateRoleChosed: false,
				currentRoleId: '', // 当前选中的角色ID
				roleData: [],
				rolesData: [],
				chosedRoleData: [],
				defaultChecked: [],
				searchContent: '',
				searchContent1: '',
				dialogVisible: false,
				userId: 0,
				roleIds: [],
				checkedUserId: 0,
				// 搜索已选角色时用来存储原来的已选角色数据
				rolesDataCache: [],
				// 存储搜索出来的已选角色点击了checkbox的数据
				curSelectedRoles: [],
				roleDataLoading: true,
				chosedRoleLoading: true,
				chosedCheckBox: true,
				disableCheckBox: true
			};
		},
		created () {
			this.getAllRoles();
		},
		computed: {
			...mapState({
				userData: state => state.userMgt.userData
			})
		},
		watch: {
			...mapMutations({
				VIDEO_DVICE_IDS: 'VIDEO_DVICE_IDS'
			}),
			defaultAllRoles (val) {
				this.clearSelection(this.roleData);
				this.initCheck();
				if (val.length > 0) {
					this.chosedRoleData = val[0].roles;
					this.rolesDataCache = this.chosedRoleData;
					this.userId = val[0].id;
					this.checkedUserId = val[0].id;
					setTimeout(() => {
						this.selectedRoles(this.chosedRoleData, this.roleData);
					}, 200);
				}
			},
			// 用户下已有角色信息
			chosedRoleInfo (val) {
				if(val.id){
					this.disableCheckBox = false;
				}else{
					this.disableCheckBox = true;
				}
				this.chosedRoleLoading = true;
				this.defaultChecked = [];
				this.roleData = this.rolesData;
				this.searchContent = '';
				this.userId = val.id;
				if (val.person) {
					this.checkedUserId = val.person.id;
				} else {
					this.checkedUserId = val.id;
				}
				if (val.roles) {
					this.chosedRoleData = val.roles;
					this.rolesDataCache = this.chosedRoleData;
				}else{
					this.chosedRoleData.splice(0);
				}
				// 把已有角色在所有角色上默认打勾
				setTimeout(() => {
					this.selectedRoles(this.chosedRoleData, this.roleData);
				}, 200);
				this.chosedRoleLoading = false;
			}
		},
		methods: {
			initCheck() {
				this.defaultChecked = [];
				this.rolesDataCache = [];
				this.chosedRoleData = [];
				this.userId = -111; // 与 change-user-roles 方法对应
				this.checkedUserId = null;
			},
			// 修改用户角色方法
			changeUserRoles(data, id, row) {
				if (id === -111 || !id) {
					return this.$message.error('请选定用户后重试');
				}
				data.forEach(el => {
					this.roleIds.push({
						id: el.id
					});
				});

				let params = {
					roles: this.roleIds,
					id: id
				};
				changeUserRoleApi(id, params).then(res => {
					if (res.status === 200) {
						if (row && !row.checked) {
							this.rolesDataCache.forEach((el, index) => {
								if (el.id === row.id) {
									this.rolesDataCache.splice(index, 1);
								}
							});
						}else{
							// this.rolesDataCache = [];
						}
						this.chosedRoleData = data;
						this.$nextTick(() => {
							this.selectedRoles(data, this.roleData);
							this.roleIds = [];
						});
					} else {
					}
				});
			},
			// 切换表单重置已选角色勾选
			restRoles(val) {
				if (val.index === '0') {
					this.curSelectedRoles.forEach(el => {
						this.rolesDataCache.forEach((v, index) => {
							if (el.id === v.id) {
								this.rolesDataCache.splice(index, 1);
								this.roleDataLoading = false;
							}
						});
					});
					this.curSelectedRoles = [];
					this.selectedRoles(this.rolesDataCache, this.roleData);
					this.changeUserRoles(this.rolesDataCache, this.userId);
				} else {
					this.enterSearch1();
				}
			},
			// 获取所有角色
			getAllRoles() {
				this.roleDataLoading = true;
				let params = {};
				params.paging = false;
				allRoles(params).then(res => {
					this.roleDataLoading = false;
					if (res.result) {
						this.roleData = res.result.data;
						this.rolesData = res.result.data;
					}
				});
			},
			checkStatus() {
				if (this.chosedRoleData.length == 0) {
					this.checkedAllRole = false;
					this.isIndeterminateRole = false;
				} else if (this.chosedRoleData.length == this.roleData.length) {
					this.isIndeterminateRole = false;
					this.checkedAllRole = true;
				} else {
					this.isIndeterminateRole = true;
					this.checkedAllRole = false;
				}
			},
			// 回车搜索事件(所有角色过滤搜索)
			enterSearch () {
				this.roleDataLoading = true;
				let params = {};
				params['f_like_name'] = this.searchContent.trim();
				if(params['f_like_name'] === ''){
					this.$message({
						message: '已查询所有',
						type: 'success',
						duration: 1000
					});
				}
				params.paging = false;
				allRoles(params).then(res => {
					this.roleDataLoading = false;
					if (res.result) {
						this.roleData = res.result.data;
						setTimeout(() => {
							this.selectedRoles(this.chosedRoleData, this.roleData);
						}, 200);
					}
				});
			},
			// 回车搜索事件(已选角色过滤搜索)
			enterSearch1 () {
				this.chosedRoleLoading = true;
				let arr = [];
				if (this.searchContent1.trim() === '') {
					this.chosedRoleData = this.rolesDataCache;
					this.chosedRoleLoading = false;
				} else {
					this.rolesDataCache.forEach(el => {
						el.name = (el.name) ? (el.name) : '';
						if (el.name.indexOf(this.searchContent1.trim()) !== -1) {
							arr.push(el);
						}
					});
					if (arr.length > 0) {
						this.chosedRoleData = arr;
					} else {
						this.chosedRoleData = [];
					}
					this.chosedRoleLoading = false;
				}
				this.chosedRoleData.forEach(v => {
					setTimeout(() => {
						this.toggleRowSelection(v, true);
					}, 100);
				});
			},

			//所有角色全选事件
			allSelectedAll (event) {
				if (event){
					this.roleData.filter(function (item) {
						Vue.set(item, 'checked', true);
					});
					this.checkedAllRole = true;
					this.isIndeterminateRole = false;
					this.chosedRoleData.splice(0);
					for (let i = 0; i < this.roleData.length; i++) {
						this.chosedRoleData.push({
							id: this.roleData[i].id,
							name: this.roleData[i].name
						});
					}
				} else {
					this.roleData.filter(function (item) {
						Vue.set(item, 'checked', false);
					});
					this.checkedAllRole = false;
					this.isIndeterminateRole = false;
					this.chosedRoleData.splice(0);
				}
				this.changeUserRoles(this.chosedRoleData, this.userId);
			},
			// 已选角色表格全选事件
			selectedAll (event) {
				if (event){
					this.chosedRoleData.forEach(el => {
						el.checked = true;
					});
					this.checkedAllRoleChosed = true;
					this.isIndeterminateRoleChosed = false;
				} else {
					this.checkedAllRoleChosed = false;
					this.isIndeterminateRoleChosed = false;
					this.chosedRoleData.splice(0);
				}
				this.changeUserRoles(this.chosedRoleData, this.userId);
			},

			// 勾选已选角色的方法
			selectedRoles (chosedData, roleDatas) {
				this.clearSelection(roleDatas);
				this.defaultChecked = [];
				if (chosedData) {
					chosedData.forEach(element => {
						this.toggleRowSelection(element, true);
					});
					this.isIndeterminateRoleChosed = false;
					this.checkedAllRoleChosed = true;
				}
				// 把已有角色在所有角色上默认打勾
				chosedData.forEach(el => {
					if (roleDatas.length > 0) {
						roleDatas.forEach((v, index) => {
							if (v.id === el.id) {
								this.defaultChecked.push(index);
							}
						});
					}
				});
				if (this.defaultChecked) {
					this.defaultChecked.forEach(el => {
						this.toggleRowSelection(this.roleData[el], true);
					});
				}
				this.checkStatus();
			},
			// 勾选当前角色
			selectionSelected (row) {
				if (row.checked == true) {
					let obj = {
						id: row.id,
						name: row.name
					};
					this.chosedRoleData.push(obj);
					this.selectedRoles(this.chosedRoleData, this.roleData);
				} else {
					this.chosedRoleData.forEach((el, index) => {
						if (el.id === row.id) {
							this.chosedRoleData.splice(index, 1);
						}
					});
				}
				this.changeUserRoles(this.chosedRoleData, this.userId, row);
				this.checkStatus();
			},
			// 已选角色勾选事件
			selectedRoleSelection (row) {
				let i = 0;
				this.chosedRoleData.forEach(el => {
					if (el.checked === true) {
						i++;
					}
				});
				if (i === 0) {
					this.checkedAllRoleChosed = false;
					this.isIndeterminateRoleChosed = false;
				} else if (i === this.chosedRoleData.length) {
					this.isIndeterminateRoleChosed = false;
					this.checkedAllRoleChosed = true;
				} else {
					this.isIndeterminateRoleChosed = true;
					this.checkedAllRoleChosed = false;
				}
				this.curSelectedRoles.push(row);
				this.changeUserRoles(this.chosedRoleData, this.userId, row);
			},
			clearSelection (data){
				data.filter(function (item) {
					Vue.set(item, 'checked', false);
				});
			},
			toggleRowSelection (element, flag){
				Vue.set(element, 'checked', flag);
			},
			// 点击详情事件
			roleDetailClick (id) {
				this.currentRoleId = id;
				this.dialogVisible = true;
			}
		}
	};

</script>
