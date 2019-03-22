<template>
	<div class="userMgt-roleMan-videoResource-group">
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
						<kc-checkbox v-model="allWatching" size="small" @change="changeAllWatching"
									 :indeterminate="isIndeterminate.isA">实时观看
						</kc-checkbox>
						<!---->
					</th>
					<th>
						<kc-checkbox v-model="histroyWatching" @change="changeHistroyWatching"
									 :indeterminate="isIndeterminate.isB">历史回放
						</kc-checkbox>
					</th>
					<th>
						<kc-checkbox v-model="videoDownLoad" @change="changeVideoDownLoad"
									 :indeterminate="isIndeterminate.isC">视频下载
						</kc-checkbox>
					</th>
					<th>
						<kc-checkbox v-model="PTZControl" @change="changePTZControl" :indeterminate="isIndeterminate.isD">
							PTZ控制
						</kc-checkbox>
					</th>
				</tr>
				</thead>
			</table>
		</div>
		<div class="table-content" v-loading="Loading">
			<table>
				<tbody >
				<tr v-for="(item, index) in selectedData" :key="index">
					<td>
						<span class="group-name" :title="item.groupName">{{item.groupName}}</span>
						<span class="group-delete" @click="delCurData(index)">
							<kc-tooltip class="item" effect="light" content="删除" placement="right">
							  	<i class="kedaIconfont KD-shanchuxiao2 keda-icon-style"></i>
							</kc-tooltip>
			        </span>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoRead"
									@change="changeGroupAuth(index, 'videoRead')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoHistoryRead"
									@change="changeGroupAuth(index, 'videoHistoryRead')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoDownload"
									@change="changeGroupAuth(index, 'videoDownload')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoPtzControl"
									@change="changeGroupAuth(index, 'videoPtzControl')"></kc-checkbox>
					</td>
				</tr>
				</tbody>
			</table>
			<div class="kc-table__empty-block" v-show="selectedData.length === 0"><span class="kc-table__empty-text">暂无数据</span>
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
				allWatching: false,
				histroyWatching: false,
				videoDownLoad: false,
				PTZControl: false,
				selectedData: [],
				fzIds: [],
				isIndeterminate: {
					isA: false,
					isB: false,
					isC: false,
					isD: false
				},
				Loading: true
			};
		},
		props: {
			addGroupData: {
				type: Object
			},
			currentRoleId: {
				type: String
			},
			searchInfo: {
				type: Object
			}
		},
		created () {
			this.getRoleAuth();
		},
		watch: {
			currentRoleId (val) {
				this.currentRoleId = val;
				this.getRoleAuth();
			},
			addGroupData (val) {
				if (val.checked === true && val.nodeInfo) {
					let params = {
						roleId: this.currentRoleId,
						deviceGroupId: val.nodeInfo.id,
						videoRead: true,
						videoHistoryRead: true,
						videoDownload: true,
						videoPtzControl: true
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
			searchInfo: {
				handler(val){
					this.getRoleAuth();
				}
			}
		},
		methods: {
			// 实时观看全选
			changeAllWatching (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.videoRead = val;
				});
				this.isIndeterminate.isA = false;
				this.changeAllGroupAuth();
			},
			// 历史回放全选
			changeHistroyWatching (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.videoHistoryRead = val;
				});
				this.isIndeterminate.isB = false;
				this.changeAllGroupAuth();
			},
			// 视频下载全选
			changeVideoDownLoad (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.videoDownload = val;
				});
				this.isIndeterminate.isC = false;
				this.changeAllGroupAuth();
			},
			// PTZ控制全选
			changePTZControl (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.videoPtzControl = val;
				});
				this.isIndeterminate.isD = false;
				this.changeAllGroupAuth();
			},
			// 查询角色授权(绑定)
			getRoleAuth () {
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
					this.Loading = false;
					if (res && res.result) {
						this.selectedData = res.result;
						let flagArrVideoRead = [];
						let flagArrVideoHistoryRead = [];
						let flagArrVideoDownload = [];
						let flagArrvideoPtzControl = [];
						this.selectedData.forEach((v, i) => {
							flagArrVideoRead.push(v.permissionCodeDTO['videoRead']);
							flagArrVideoHistoryRead.push(v.permissionCodeDTO['videoHistoryRead']);
							flagArrVideoDownload.push(v.permissionCodeDTO['videoDownload']);
							flagArrvideoPtzControl.push(v.permissionCodeDTO['videoPtzControl']);
						});

						this.allWatching = flagArrVideoRead.every(v => v === true);
						if (!this.allWatching) {
							this.isIndeterminate.isA = flagArrVideoRead.some(v => v === true);
						} else {
							this.isIndeterminate.isA = false;
						}
						this.histroyWatching = flagArrVideoHistoryRead.every(v => v === true);
						if (!this.histroyWatching) {
							this.isIndeterminate.isB = flagArrVideoHistoryRead.some(v => v === true);
						} else {
							this.isIndeterminate.isB = false;
						}
						this.videoDownLoad = flagArrVideoDownload.every(v => v === true);
						if (!this.videoDownLoad) {
							this.isIndeterminate.isC = flagArrVideoDownload.some(v => v === true);
						} else {
							this.isIndeterminate.isC = false;
						}
						this.PTZControl = flagArrvideoPtzControl.every(v => v === true);
						if (!this.PTZControl) {
							this.isIndeterminate.isD = flagArrvideoPtzControl.some(v => v === true);
						} else {
							this.isIndeterminate.isD = false;
						}
						this.fzIds = [];
						this.selectedData.forEach(el => {
							this.fzIds.push(el.deviceGroupId);
						});
						this.$emit('groupId', this.fzIds);//获取选中分组树的 id
					}
				}, error => {
					this.Loading = false;
					this.$message(error);
				});
			},
			// 删除
			delCurData (index) {
				let params = {
					roleId: this.currentRoleId,
					deviceGroupId: this.selectedData[index].deviceGroupId
				};
				cancelGroupAuthApi(params).then(res => {
					if (res.status === 200) {
						this.selectedData.splice(index, 1);
						this.fzIds.splice(index, 1);
						this.$emit('groupId', this.fzIds);
					}
				});
			},
			// 删除已选分组
			delAllData () {
				this.$confirm('确认删除此分组吗?', '提示', {
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
						if (res.status === 200) {
							this.fzIds = [];
							this.$emit('groupId', this.fzIds);
							this.selectedData = [];
						}
					});
				});
			},
			// 更改单个分组授权
			changeGroupAuth (index, type) {
				let flagArr = [];
				this.selectedData.forEach((v, i) => {
					flagArr.push(v.permissionCodeDTO[type]);
				});
				let flagTrue = flagArr.every(v => v === true);
				if (type === 'videoRead') {
					this.allWatching = flagTrue;
					if (!this.allWatching) {
						this.isIndeterminate.isA = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isA = false;
					}
				} else if (type === 'videoHistoryRead') {
					this.histroyWatching = flagTrue;
					if (!this.histroyWatching) {
						this.isIndeterminate.isB = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isB = false;
					}
				} else if (type === 'videoDownload') {
					this.videoDownLoad = flagTrue;
					if (!this.videoDownLoad) {
						this.isIndeterminate.isC = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isC = false;
					}
				} else if (type === 'videoPtzControl') {
					this.PTZControl = flagTrue;
					if (!this.PTZControl) {
						this.isIndeterminate.isD = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isD = false;
					}
				}

				let params = [{
					roleId: this.currentRoleId,
					deviceGroupId: this.selectedData[index].deviceGroupId,
					videoRead: this.selectedData[index].permissionCodeDTO.videoRead,
					videoHistoryRead: this.selectedData[index].permissionCodeDTO.videoHistoryRead,
					videoDownload: this.selectedData[index].permissionCodeDTO.videoDownload,
					videoPtzControl: this.selectedData[index].permissionCodeDTO.videoPtzControl
				}];
				changeGroupAuthsApi(params).then(res => {
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
						videoRead: el.permissionCodeDTO.videoRead,
						videoHistoryRead: el.permissionCodeDTO.videoHistoryRead,
						videoDownload: el.permissionCodeDTO.videoDownload,
						videoPtzControl: el.permissionCodeDTO.videoPtzControl
					};
					params.push(obj);
				});
				changeGroupAuthsApi(params).then(res => {
				});
			}
		}
	};

</script>
