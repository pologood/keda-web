<template>
	<div class="userMgt-roleMan-tollgatesResource-device">
		<div class="right-top">
			<span class="change-radio" :class="{'radio-active':radio==='1'}" @click="changeRadio('1')">已授权设备</span>
			<span class="change-radio" :class="{'radio-active':radio==='2'}" @click="changeRadio('2')">已剔除设备</span>
			<span class="delete-all" @click="delAll">
				<kc-tooltip class="item" effect="light" content="删除" placement="right">
					<i class="kedaIconfont KD-shanchuda1 keda-icon-heavy-style"></i>
				</kc-tooltip>
			</span>
		</div>
		<div class="device-table-content">
			<table v-if="deviceTable" v-loading="LoadingDeviceAuth">
				<thead>
				<tr>
					<th style="width:37%;">
						<kc-input v-model="searchData" placeholder="请输入内容"
								  @keydown.enter.native="searchDevice">
							<i slot="suffix" class="icon kedaIconfont KD-sousuo search-size keda-icon-heavy-style" @click="searchDevice"></i>
						</kc-input>
					</th>
					<th style="width:15%;">
						<kc-checkbox v-model="closeView" @change="changeCloseView" :indeterminate="isIndeterminate.isA">
							近景图权限
						</kc-checkbox>
					</th>
					<th style="width:15%;">
						<kc-checkbox v-model="distantView" @change="changeDistantView"
									 :indeterminate="isIndeterminate.isB">远景图权限
						</kc-checkbox>
					</th>
					<th style="width:15%;">
						<kc-checkbox v-model="viewDownload" @change="changeViewDownload"
									 :indeterminate="isIndeterminate.isC">图片下载
						</kc-checkbox>
					</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item,index) in selectedData" :key="index">
					<td style="width:35%;">
						<span class="device-name" :title="item.deviceName">{{item.deviceName}}</span>
						<span class="device-delete" @click="delCurrent(index)">
							<kc-tooltip class="item" effect="light" content="删除" placement="right">
							  	<i class="icon kedaIconfont KD-shanchuxiao2 keda-icon-style"></i>&nbsp;&nbsp;
							</kc-tooltip>
			        	</span>
					</td>
					<td style="width:15%;">
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateRead"
									 @change="changeDeviceAuth(index, 'tollgateRead')"></kc-checkbox>
					</td>
					<td style="width:15%;">
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateRemoteRead"
									 @change="changeDeviceAuth(index, 'tollgateRemoteRead')"></kc-checkbox>
					</td>
					<td style="width:15%;">
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateDownload"
									 @change="changeDeviceAuth(index, 'tollgateDownload')"></kc-checkbox>
					</td>
				</tr>
				</tbody>
			</table>
			<div v-if="deviceTable" class="kc-table__empty-block" v-show="selectedData.length === 0"><span class="kc-table__empty-text">暂无数据</span>
			</div>
			<table v-if="!deviceTable" v-loading="LoadingDelDeviceAuth">
				<thead>
				<tr>
					<th style="width:35%;">
						<kc-input v-model="searchDataExclude" placeholder="请输入内容"
								  @keydown.enter.native="searchDevice1">
							<i slot="suffix" class="icon kedaIconfont KD-sousuo search-size keda-icon-heavy-style" @click="searchDeviceExclude"></i>
						</kc-input>
					</th>
					<th style="width:15%;">
						<kc-checkbox v-model="closeViewExclude" @change="changeCloseViewExclude"
									 :indeterminate="isIndeterminate.isD">近景图权限
						</kc-checkbox>
					</th>
					<th style="width:15%;">
						<kc-checkbox v-model="distantViewExclude" @change="changeDistantViewExclude"
									 :indeterminate="isIndeterminate.isE">远景图权限
						</kc-checkbox>
					</th>
					<th style="width:15%;">
						<kc-checkbox v-model="viewDownloadExclude" @change="changeViewDownloadExclude"
									 :indeterminate="isIndeterminate.isF">图片下载
						</kc-checkbox>
					</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item,index) in selectedDataExclude" :key="index">
					<td style="width:35%;">
						<span class="device-name" :title="item.deviceName">{{item.deviceName}}</span>
						<span style="cursor:pointer;" class="device-delete" @click="delCurrentExclude(index)">
							<kc-tooltip class="item" effect="light" content="删除" placement="right">
							  	<i class="icon kedaIconfont KD-shanchuxiao2 keda-icon-style"></i>&nbsp;&nbsp;
							</kc-tooltip>&nbsp;
						</span>
					</td>
					<td style="width:15%;">
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateRead"
									 @change="changeDeviceAuth1(index, 'tollgateRead')"></kc-checkbox>
					</td>
					<td style="width:15%;">
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateRemoteRead"
									 @change="changeDeviceAuth1(index, 'tollgateRemoteRead')"></kc-checkbox>
					</td>
					<td style="width:15%;">
						<kc-checkbox v-model="item.permissionCodeDTO.tollgateDownload"
									 @change="changeDeviceAuth1(index, 'tollgateDownload')"></kc-checkbox>
					</td>
				</tr>

				</tbody>
			</table>
			<div v-if="!deviceTable" class="kc-table__empty-block" v-show="selectedDataExclude.length === 0"><span class="kc-table__empty-text">暂无数据</span>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		getDeviceAuthApi,
		getDelDeviceAuthApi,
		addDeviceAuthRoleApi,
		delAllDeviceApi,
		changeDeviceAuthApi,
		delDeviceAuthRoleApi,
		delAllDeviceExcludeApi,
		changeDeviceAuthExcludeApi
	} from '../../../../../../service/roleMgt.js';
	import { createNamespacedHelpers } from 'vuex';
	const {mapMutations} = createNamespacedHelpers('userMgtStore');
	export default {
		data () {
			return {
				deviceTable: true,
				showTable: false,
				showTable1: false,
				/* 已授权 */
				selectedData: [],
				closeView: false,
				distantView: false,
				viewDownload: false,
				/* 已剔除 */
				selectedDataExclude: [],
				closeViewExclude: false,
				distantViewExclude: false,
				viewDownloadExclude: false,
				isIndeterminate: {
					isA: false,
					isB: false,
					isC: false,
					isD: false,
					isE: false,
					isF: false
				},
				radio: '1',
				searchData: '',
				searchState: false,
				searchDataExclude: '',
				addDevice: false,
				LoadingDeviceAuth: true,
				LoadingDelDeviceAuth: true,
				tollgatesDeviceIds: {}
			};
		},
		created () {
			if(this.radio === '1'){
				this.getDeviceAuth(this.currentRoleId, '');
			} else if(this.radio === '2'){
				this.getDelDeviceAuth(this.currentRoleId, '');
			}
		},
		props: {
			addRoles: {
				type: Array
			},
			kdeviceInfosData: {
				type: Array
			},
			currentRoleId: {
				type: String
			},
			searchInfo: {
				type: Object
			}
		},
		watch: {
			searchInfo(val){
				if(val.attrType == '按设备授权'){
					if(this.radio === '1'){
						this.getDeviceAuth(this.currentRoleId, '');
					} else if(this.radio === '2'){
						this.getDelDeviceAuth(this.currentRoleId, '');
					}
				}
			},
			radio(val){
				this.searchState = false;
				console.log('watch radio>>>', val);
				if (val == 1) {
					this.searchData = '';
					this.deviceTable = true;
					this.getDeviceAuth(this.currentRoleId, '');
				} else if (val == 2) {
					this.searchDataExclude = '';
					this.deviceTable = false;
					this.getDelDeviceAuth(this.currentRoleId, '');
				}
			},
			currentRoleId (val) {
				this.currentRoleId = val;
				if (this.deviceTable) {
					this.getDeviceAuth(val, '');
				} else {
					this.getDelDeviceAuth(val, '');
				}
			},
			kdeviceInfosData (val) {
				let that = this;
				that.addDevice = false;
				if (that.radio === '1') {
					if (val[0].checked === true) {
						that.selectedData.forEach(el => {
							if (val[0].nodeInfo.id === el.id) {
								that.addDevice = true;
							}
						});
						if (that.addDevice === true) {
							return;
						}
						let params = {
							id: that.currentRoleId,
							status: {
								deviceId: val[0].nodeInfo.id,
								tollgateRead: true,
								tollgateRemoteRead: true,
								tollgateDownload: true
							}
						};
						addDeviceAuthRoleApi(params).then(res => {
							that.addDevice = false;
							if (res.status === 200) {
								let obj = {
									deviceName: val[0].nodeInfo.title || val[0].nodeInfo.deviceName,
									permissionCodeDTO: {
										tollgateRead: true,
										tollgateRemoteRead: true,
										tollgateDownload: true
									},
									id: val[0].nodeInfo.id
								};
								that.selectedData.push(obj);
								that.tollgatesDeviceIds[val[0].nodeInfo.id] = true;
								that.TOLLGATES_DEVICE_IDS(that.tollgatesDeviceIds);
							}
						});
					}else if (val[0].checked === false) {
						let params = {
							id: that.currentRoleId,
							ids: {
								deviceIds: [val[0].nodeInfo.id]
							}
						};
						delAllDeviceApi(params).then(res => {
							if (res.status === 200) {
								for (let i = 0; i < that.selectedData.length; i++) {
									if (that.selectedData[i].id == val[0].nodeInfo.id) {
										that.selectedData.splice(i, 1);
									}
								}
								if (that.selectedData.length === 0) {
									that.showTable = false;
								}
								that.tollgatesDeviceIds[val[0].nodeInfo.id] = false;
								that.TOLLGATES_DEVICE_IDS(that.tollgatesDeviceIds);
							}
						});
					}
				}else if (this.radio === '2') {
					if(val[0].checked === true){
						that.selectedDataExclude.forEach(el => {
							if (val[0].nodeInfo.id === el.id) {
								that.addDevice = true;
							}
						});
						if (that.addDevice === true) {
							return;
						}
						let params = {
							id: that.currentRoleId,
							status: {
								deviceId: val[0].nodeInfo.id,
								tollgateRead: true,
								tollgateRemoteRead: true,
								tollgateDownload: true
							}
						};
						delDeviceAuthRoleApi(params).then(res => {
							that.addDevice = false;
							if (res.status === 200) {
								let obj = {
									deviceName: val[0].nodeInfo.title || val[0].nodeInfo.deviceName,
									permissionCodeDTO: {
										tollgateRead: true,
										tollgateRemoteRead: true,
										tollgateDownload: true
									},
									id: val[0].nodeInfo.id
								};
								that.selectedDataExclude.push(obj);
								that.tollgatesDeviceIds[val[0].nodeInfo.id] = true;
								that.TOLLGATES_DEVICE_IDS(that.tollgatesDeviceIds);
							}
						});
					}else if (val[0].checked === false) {
						let params = {
							id: that.currentRoleId,
							ids: {
								deviceIds: [val[0].nodeInfo.id]
							}
						};
						delAllDeviceExcludeApi(params).then(res => {
							if (res.status === 200) {
								for(let i = 0; i < that.selectedDataExclude.length; i++){
									if(that.selectedDataExclude[i].id == val[0].nodeInfo.id){
										that.selectedDataExclude.splice(i, 1);
									}
								}
								if (that.selectedDataExclude.length === 0) {
									that.showTable = false;
								}
								that.tollgatesDeviceIds[val[0].nodeInfo.id] = false;
								that.TOLLGATES_DEVICE_IDS(that.tollgatesDeviceIds);
							}
						});
					}
				}
			}
		},
		methods: {
			...mapMutations({
				TOLLGATES_DEVICE_IDS: 'TOLLGATES_DEVICE_IDS'
			}),
			changeRadio (val) {
				this.radio = val;
			},
			/* 已授权  全选 */
			// 近景图
			changeCloseView (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.tollgateRead = val;
				});
				this.isIndeterminate.isA = false;
				this.changeAllDeviceAuth();
			},
			// 远景图
			changeDistantView (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.tollgateRemoteRead = val;
				});
				this.isIndeterminate.isB = false;
				this.changeAllDeviceAuth();
			},
			// 下载
			changeViewDownload (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.tollgateDownload = val;
				});
				this.isIndeterminate.isC = false;
				this.changeAllDeviceAuth();
			},
			/* 已剔除  全选 */
			// 近景图
			changeCloseViewExclude (val) {
				this.selectedDataExclude.forEach(element => {
					element.permissionCodeDTO.tollgateRead = val;
				});
				this.isIndeterminate.isD = false;
				this.changeAllDeviceAuthExclude();
			},
			// 远景图
			changeDistantViewExclude (val) {
				this.selectedDataExclude.forEach(element => {
					element.permissionCodeDTO.tollgateRemoteRead = val;
				});
				this.isIndeterminate.isE = false;
				this.changeAllDeviceAuthExclude();
			},
			// 下载
			changeViewDownloadExclude (val) {
				this.selectedDataExclude.forEach(element => {
					element.permissionCodeDTO.tollgateDownload = val;
				});
				this.isIndeterminate.isF = false;
				this.changeAllDeviceAuthExclude();
			},
			// 单条授权设备更改设备授权
			changeDeviceAuth (index, type) {
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
				let params = {
					id: this.currentRoleId,
					status: [{
						deviceId: this.selectedData[index].id,
						tollgateRead: this.selectedData[index].permissionCodeDTO.tollgateRead,
						tollgateRemoteRead: this.selectedData[index].permissionCodeDTO.tollgateRemoteRead,
						tollgateDownload: this.selectedData[index].permissionCodeDTO.tollgateDownload
					}]
				};
				changeDeviceAuthApi(params).then(res => {
				});
			},
			// 单条已剔除设备更改设备权限
			changeDeviceAuth1 (index, type) {
				let flagArr = [];
				this.selectedDataExclude.forEach((v, i) => {
					flagArr.push(v.permissionCodeDTO[type]);
				});
				let flagTrue = flagArr.every(v => v === true);
				if (type === 'tollgateRead') {
					this.closeViewExclude = flagTrue;
					if (!this.closeViewExclude) {
						this.isIndeterminate.isD = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isD = false;
					}
				} else if (type === 'tollgateRemoteRead') {
					this.distantViewExclude = flagTrue;
					if (!this.distantViewExclude) {
						this.isIndeterminate.isE = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isE = false;
					}
				} else if (type === 'tollgateDownload') {
					this.viewDownloadExclude = flagTrue;
					if (!this.viewDownloadExclude) {
						this.isIndeterminate.isF = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isF = false;
					}
				}

				let params = {
					id: this.currentRoleId,
					status: [{
						deviceId: this.selectedDataExclude[index].id,
						tollgateRead: this.selectedDataExclude[index].permissionCodeDTO.tollgateRead,
						tollgateRemoteRead: this.selectedDataExclude[index].permissionCodeDTO.tollgateRemoteRead,
						tollgateDownload: this.selectedDataExclude[index].permissionCodeDTO.tollgateDownload
					}]
				};
				changeDeviceAuthExcludeApi(params).then(res => {
				});
			},
			// 更改全部已授权设备权限
			changeAllDeviceAuth () {
				let obj = {};
				let status = [];
				this.selectedData.forEach(el => {
					obj = {
						deviceId: el.id,
						tollgateRead: el.permissionCodeDTO.tollgateRead,
						tollgateRemoteRead: el.permissionCodeDTO.tollgateRemoteRead,
						tollgateDownload: el.permissionCodeDTO.tollgateDownload
					};
					status.push(obj);
				});
				let params = {
					id: this.currentRoleId,
					status: status
				};
				changeDeviceAuthApi(params).then(res => {
				});
			},
			// 更改全部剔除已授权设备权限
			changeAllDeviceAuthExclude () {
				let obj = {};
				let status = [];
				this.selectedDataExclude.forEach(el => {
					obj = {
						deviceId: el.id,
						tollgateRead: el.permissionCodeDTO.tollgateRead,
						tollgateRemoteRead: el.permissionCodeDTO.tollgateRemoteRead,
						tollgateDownload: el.permissionCodeDTO.tollgateDownload
					};
					status.push(obj);
				});
				let params = {
					id: this.currentRoleId,
					status: status
				};
				changeDeviceAuthExcludeApi(params).then(res => {
				});
			},
			// 获取已授权设备
			getDeviceAuth (id, deviceName) {
				let that = this;
				that.LoadingDeviceAuth = true;
				let params = {
					id: id,
					num: this.searchInfo.info.groupType,
					data: {
						deviceName: deviceName,
						ar: this.searchInfo.info.ar,
						deviceTypes: this.searchInfo.info.deviceTypes,
						cameraForms: this.searchInfo.info.cameraForms,
						cameraAbilitys: this.searchInfo.info.cameraAbilitys
					}
				};
				getDeviceAuthApi(params).then(res => {
					that.LoadingDeviceAuth = false;
					if (res) {
						if (res.result) {
							that.selectedData = res.result;
							let flagArrCloseView = [];
							let flagArrDistantView = [];
							let flagArrViewDownload = [];
							for(let key in that.tollgatesDeviceIds){
								that.tollgatesDeviceIds[key] = false;
							}
							that.selectedData.forEach((v, i) => {
								flagArrCloseView.push(v.permissionCodeDTO['tollgateRead']);
								flagArrDistantView.push(v.permissionCodeDTO['tollgateRemoteRead']);
								flagArrViewDownload.push(v.permissionCodeDTO['tollgateDownload']);
								that.tollgatesDeviceIds[v.id] = true;
							});
							if(!that.searchState){
								that.TOLLGATES_DEVICE_IDS(that.tollgatesDeviceIds);
							}
							this.toAjustCheckedStatus('closeView', 'isA', flagArrCloseView);
							this.toAjustCheckedStatus('distantView', 'isB', flagArrDistantView);
							this.toAjustCheckedStatus('viewDownload', 'isC', flagArrViewDownload);
						}
					}
				}, err => {
					this.$message.warning(err);
					that.LoadingDeviceAuth = false;
				});
			},
			// 获取已剔除授权设备
			getDelDeviceAuth (id, deviceName) {
				this.LoadingDelDeviceAuth = true;
				let that = this;
				let params = {
					id: id,
					num: this.searchInfo.info.groupType,
					data: {
						deviceName: deviceName,
						ar: this.searchInfo.info.ar,
						deviceTypes: this.searchInfo.info.deviceTypes,
						cameraForms: this.searchInfo.info.cameraForms,
						cameraAbilitys: this.searchInfo.info.cameraAbilitys
					}
				};
				getDelDeviceAuthApi(params).then(res => {
					that.LoadingDelDeviceAuth = false;
					if (res) {
						if (res.result) {
							that.selectedDataExclude = res.result;
							let flagArrCloseView = [];
							let flagArrDistantView = [];
							let flagArrViewDownload = [];
							for(let key in that.tollgatesDeviceIds){
								that.tollgatesDeviceIds[key] = false;
							}
							that.selectedDataExclude.forEach((v, i) => {
								flagArrCloseView.push(v.permissionCodeDTO['tollgateRead']);
								flagArrDistantView.push(v.permissionCodeDTO['tollgateRemoteRead']);
								flagArrViewDownload.push(v.permissionCodeDTO['tollgateDownload']);
								that.tollgatesDeviceIds[v.id] = true;
							});
							if(!that.searchState) {
								that.TOLLGATES_DEVICE_IDS(that.tollgatesDeviceIds);
							}
							this.toAjustCheckedStatus('closeViewExclude', 'isD', flagArrCloseView);
							this.toAjustCheckedStatus('distantViewExclude', 'isE', flagArrDistantView);
							this.toAjustCheckedStatus('viewDownloadExclude', 'isF', flagArrViewDownload);
						}
					}
				}).catch(err => {
					this.$message.warning(err);
					that.LoadingDelDeviceAuth = false;
				});
			},
			// 调整选中状态
			toAjustCheckedStatus (checkboxModelName, nameOfcheckAll, ajustTmpArray = []) {
				this[checkboxModelName] = ajustTmpArray.every(v => v === true);
				if (!this[checkboxModelName]) {
					this.isIndeterminate[nameOfcheckAll] = ajustTmpArray.some(v => v === true);
				} else {
					this.isIndeterminate[nameOfcheckAll] = false;
				}
			},
			searchDevice () {
				this.searchState = true;
				this.getDeviceAuth(this.currentRoleId, this.searchData);
			},
			searchDeviceExclude () {
				this.searchState = true;
				this.getDelDeviceAuth(this.currentRoleId, this.searchDataExclude);
			},
			//删除已授权设备
			delCurrent (index) {
				let that = this;
				let params = {
					id: that.currentRoleId,
					ids: {
						deviceIds: [that.selectedData[index].id]
					}
				};
				delAllDeviceApi(params).then(res => {
					if (res.status === 200) {
						that.tollgatesDeviceIds[that.selectedData[index].id] = false;
						that.selectedData.splice(index, 1);
						if (that.selectedData.length === 0) {
							that.showTable = false;
						}
						that.TOLLGATES_DEVICE_IDS(that.tollgatesDeviceIds);
					}
				});
			},
			//删除已剔除设备
			delCurrentExclude (index) {
				let that = this;
				let params = {
					id: that.currentRoleId,
					ids: {
						deviceIds: [that.selectedDataExclude[index].id]
					}
				};
				delAllDeviceExcludeApi(params).then(res => {
					if (res.status === 200) {
						that.tollgatesDeviceIds[that.selectedDataExclude[index].id] = false;
						that.selectedDataExclude.splice(index, 1);
						if (that.selectedDataExclude.length === 0) {
							that.showTable = false;
						}
						that.TOLLGATES_DEVICE_IDS(that.tollgatesDeviceIds);
					}
				});
			},
			delAll () {
				this.$confirm('确认删除此设备吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					type: 'warning'
				}).then(() => {
					if (this.radio === '1') {
						let sbids = [];
						this.selectedData.forEach(el => {
							sbids.push(el.id);
						});
						let params = {
							id: this.currentRoleId,
							ids: {
								deviceIds: sbids
							}
						};
						delAllDeviceApi(params).then(res => {
							if (res.status === 200) {
								this.selectedData = [];
							}
						});
						this.showTable = false;
					} else if (this.radio === '2') {
						let sbids1 = [];
						this.selectedDataExclude.forEach(el => {
							sbids1.push(el.id);
						});
						let params = {
							id: this.currentRoleId,
							ids: {
								deviceIds: sbids1
							}
						};
						delAllDeviceExcludeApi(params).then(res => {
							if (res.status === 200) {
								this.selectedDataExclude = [];
							}
						});
						this.showTable = false;
					}
					for(let key in this.tollgatesDeviceIds){
						this.tollgatesDeviceIds[key] = false;
					}
					this.TOLLGATES_DEVICE_IDS(this.tollgatesDeviceIds);
				});
			}
		}


	};

</script>
