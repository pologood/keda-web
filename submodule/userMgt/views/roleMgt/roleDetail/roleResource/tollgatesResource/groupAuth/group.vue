<template>
	<div class="userMgt-roleMan-tollgatesResource-group" >
		<div class="bg-grey">
			<table>
				<thead>
				<tr class="">
					<th>
						已选分组
						<span class="delete-all" @click="delAllData">
								<kc-tooltip class="item" effect="light" content="删除" placement="right">
									<i class="kedaIconfont KD-shanchuda1 keda-icon-style"></i>
								</kc-tooltip>
						</span>
					</th>
					<th>
						<kc-checkbox v-model="closeView" size="small" @change="changeCloseView"
									 :indeterminate="isIndeterminate.isA">近景图权限
						</kc-checkbox>
					</th>
					<th>
						<kc-checkbox v-model="distantView" @change="changeDistantView" :indeterminate="isIndeterminate.isB">
							远景图权限
						</kc-checkbox>
					</th>
					<th>
						<kc-checkbox v-model="viewDownload" @change="changeViewDownload"
									 :indeterminate="isIndeterminate.isC">图片下载
						</kc-checkbox>
					</th>
				</tr>
				</thead>
			</table>
		</div>
		<div class="table-content" v-loading="tableLoading">
			<table>
				<tbody>
					<tr v-for="(item, index) in selectedData" :key="index">
					<td class="area-name">
						<span class="group-name" :title="item.groupName">{{item.groupName}}</span>
						<span class="group-delete" @click="delCurData(index)">
							<kc-tooltip class="item" effect="light" content="删除" placement="right">
							  	<i class="icon kedaIconfont KD-shanchuxiao2 keda-icon-style"></i>&nbsp;&nbsp;
							</kc-tooltip>
						</span>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateRead"
									 @change="changeGroupAuth($event, index, 'tollgateRead')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateRemoteRead"
									 @change="changeGroupAuth($event, index, 'tollgateRemoteRead')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateDownload"
									 @change="changeGroupAuth($event, index, 'tollgateDownload')"></kc-checkbox>
					</td>
				</tr>
				</tbody>
			</table>
			<div  class="kc-table__empty-block" v-show="selectedData.length === 0"><span class="kc-table__empty-text">暂无数据</span>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		roleGroupAuthApi,
		addGroupAuthApi,
		changeGroupAuthsApi,
		cancelGroupAuthApi,
		cancelAllGroupAuthApi
	} from '../../../../../../service/roleMgt.js';

	export default {
		data () {
			return {
				closeView: false,
				distantView: false,
				viewDownload: false,
				selectedData: [],
				fzIds: [],
				isIndeterminate: {
					isA: false,
					isB: false,
					isC: false
				},
				tableLoading: true
			};
		},
		props: {
			kaddGroupData: {
				type: Object
			},
			currentRoleId: {
				type: String
			},
			searchInfo: {
				type: Object
			}
		},
		computed: {
			tollgate () {
				return this.selectedData.map((ele) => {
					return ele.permissionCodeDTO;
				});
			}
		},
		watch: {
			searchInfo(){
				this.getRoleAuth();
			},
			currentRoleId (val) {
				this.currentRoleId = val;
				this.getRoleAuth();
			},
			kaddGroupData: {
				handler (val) {
					if (val.checked === true && val.nodeInfo) {
						let params = {
							roleId: this.currentRoleId,
							deviceGroupId: val.nodeInfo.id,
							tollgateRead: true,
							tollgateRemoteRead: true,
							tollgateDownload: true
						};
						addGroupAuthApi(params).then(res => {
							if (res) {
								this.getRoleAuth();
							}
						});
					} else if (val.checked === false && val.nodeInfo) {
						let deviceGroupId = val.nodeInfo.id;
						let params = {
							roleId: this.currentRoleId,
							deviceGroupId: deviceGroupId
						};
						cancelGroupAuthApi(params).then(res => {
							if (res) {
								this.getRoleAuth();
							}
						});
					}
				},
				deep: true
			}
		},
		created () {
			this.getRoleAuth();
		},
		methods: {
			// 近景图 全选
			changeCloseView (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.tollgateRead = val;
				});
				this.isIndeterminate.isA = false;
				this.changeAllGroupAuth();
			},
			// 远景图 全选
			changeDistantView (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.tollgateRemoteRead = val;
				});
				this.isIndeterminate.isB = false;
				this.changeAllGroupAuth();
			},
			// 图片下载 全选
			changeViewDownload (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.tollgateDownload = val;
				});
				this.isIndeterminate.isC = false;
				this.changeAllGroupAuth();
			},
			// 查询角色授权
			getRoleAuth () {
				this.tableLoading = true;
				let params = {
					id: this.currentRoleId,
					num: this.searchInfo.info.groupType,
					data: {
						deviceName: '',
						ar: this.searchInfo.info.ar,
						deviceTypes: this.searchInfo.info.deviceTypes,
						cameraForms: this.searchInfo.info.cameraForms,
						cameraAbilitys: this.searchInfo.info.cameraAbilitys
					}
				};
				roleGroupAuthApi(params).then(res => {
					this.tableLoading = false;
					if (res && res.result) {
						this.selectedData = res.result;
						let flagArrCloseView = [];
						let flagArrDistantView = [];
						let flagArrViewDownload = [];
						this.selectedData.forEach((v, i) => {
							flagArrCloseView.push(v.permissionCodeDTO['tollgateRead']);
							flagArrDistantView.push(v.permissionCodeDTO['tollgateRemoteRead']);
							flagArrViewDownload.push(v.permissionCodeDTO['tollgateDownload']);
						});
						this.closeView = flagArrCloseView.every(v => v === true);
						if (!this.closeView) {
							this.isIndeterminate.isA = flagArrCloseView.some(v => v === true);
						} else {
							this.isIndeterminate.isA = false;
						}
						this.distantView = flagArrDistantView.every(v => v === true);
						if (!this.distantView) {
							this.isIndeterminate.isB = flagArrDistantView.some(v => v === true);
						} else {
							this.isIndeterminate.isB = false;
						}
						this.viewDownload = flagArrViewDownload.every(v => v === true);
						if (!this.viewDownload) {
							this.isIndeterminate.isC = flagArrViewDownload.some(v => v === true);
						} else {
							this.isIndeterminate.isC = false;
						}

						this.fzIds = [];
						this.selectedData.forEach(el => {
							this.fzIds.push(el.deviceGroupId);
						});
						this.$emit('kgroupId', this.fzIds);
					}
				}, err => {
					this.tableLoading = false;
					this.$message.warning(err);
				});
			},
			delCurData (index) {
				let params = {
					roleId: this.currentRoleId,
					deviceGroupId: this.selectedData[index].deviceGroupId
				};
				cancelGroupAuthApi(params).then(res => {
					this.tableLoading = false;
					if (res.status === 200) {
						this.selectedData.splice(index, 1);
						this.fzIds.splice(index, 1);
						this.$emit('kgroupId', this.fzIds);
					}
				});
			},
			delAllData () {
				this.$confirm('确认删除这些分组吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					type: 'warning'
				}).then(() => {
					let params = {
						roleId: this.currentRoleId,
						deviceGroupIds: {
							deviceGroupIds: this.fzIds
						}
					};
					cancelAllGroupAuthApi(params).then(res => {
						this.tableLoading = false;
						if (res.status === 200) {
							this.fzIds = [];
							this.$emit('kgroupId', this.fzIds);
							this.selectedData = [];
						}
					});
				});
			},
			// 更改单个分组授权
			changeGroupAuth (value, index, type) {
				let flagArr = [];
				this.selectedData.forEach((v, i) => {
					flagArr.push(v.permissionCodeDTO[type]);
				});

				let flagTrue = flagArr.every(v => v === true);
				if (type === 'tollgateRead') {
					this.closeView = flagTrue;
					if (!this.closeView) {
						this.isIndeterminate.isA = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isA = false;
					}
				} else if (type === 'tollgateRemoteRead') {
					this.distantView = flagTrue;
					if (!this.distantView) {
						this.isIndeterminate.isB = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isB = false;
					}
				} else if (type === 'tollgateDownload') {
					this.viewDownload = flagTrue;
					if (!this.viewDownload) {
						this.isIndeterminate.isC = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isC = false;
					}
				}

				let params = [{
					roleId: this.currentRoleId,
					deviceGroupId: this.selectedData[index].deviceGroupId,
					tollgateRead: this.selectedData[index].permissionCodeDTO.tollgateRead,
					tollgateRemoteRead: this.selectedData[index].permissionCodeDTO.tollgateRemoteRead,
					tollgateDownload: this.selectedData[index].permissionCodeDTO.tollgateDownload
				}];
				changeGroupAuthsApi(params).then(res => {
					this.tableLoading = false;
				});
			},
			// 更改全部分组授权
			changeAllGroupAuth () {
				let obj = {};
				let params = [];
				this.selectedData.forEach(el => {
					obj = {
						roleId: this.currentRoleId,
						deviceGroupId: el.deviceGroupId,
						tollgateRead: el.permissionCodeDTO.tollgateRead,
						tollgateRemoteRead: el.permissionCodeDTO.tollgateRemoteRead,
						tollgateDownload: el.permissionCodeDTO.tollgateDownload
					};
					params.push(obj);
				});
				changeGroupAuthsApi(params).then(res => {
					this.tableLoading = false;
				});
			}
		}
	};

</script>

