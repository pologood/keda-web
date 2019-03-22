<template>
	<div class="userMgt-roleMan-videoResource-device">
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
					<th>
						<kc-input v-model="searchData" placeholder="请输入内容"
								  @keydown.enter.native="searchDevice">
							<i slot="suffix" class="icon kedaIconfont KD-sousuo search-size keda-icon-heavy-style" @click="searchDevice"></i>
						</kc-input>
					</th>

					<th>
						<kc-checkbox v-model="allWatching" @change="changeAllWatching"
									 :indeterminate="isIndeterminate.isA">实时观看
						</kc-checkbox><!---->
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
						<kc-checkbox v-model="PTZControl" @change="changePTZControl"
									 :indeterminate="isIndeterminate.isD">PTZ控制
						</kc-checkbox>
					</th>
				</tr>
				</thead>
				<tbody class="device-table-body">
				<tr v-for="(item,index) in selectedData" :key="index" >
					<td>
						<span class="device-name" :title="item.deviceName">{{item.deviceName}}</span>
						<span class="device-delete" @click="delCurrent(index)">
							<kc-tooltip class="item" effect="light" content="删除" placement="right">
							  	<i class="icon kedaIconfont KD-shanchuxiao2 keda-icon-style"></i>&nbsp;&nbsp;
							</kc-tooltip>
						</span>
					</td>
					<td >
						<kc-checkbox v-model="item.permissionCodeDTO.videoRead"
									 @change="changeDeviceAuth(index, 'videoRead')"></kc-checkbox>
					</td>
					<td >
						<kc-checkbox v-model="item.permissionCodeDTO.videoHistoryRead"
									 @change="changeDeviceAuth(index, 'videoHistoryRead')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoDownload"
									 @change="changeDeviceAuth(index, 'videoDownload')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoPtzControl"
									 @change="changeDeviceAuth(index, 'videoPtzControl')"></kc-checkbox>
					</td>
				</tr>
				</tbody>
			</table>
			<div v-if="deviceTable" class="kc-table__empty-block" v-show="selectedData.length === 0"><span class="kc-table__empty-text">暂无数据</span>
			</div>
			<table v-if="!deviceTable" v-loading="LoadingDelDeviceAuth">
				<thead>
				<tr>
					<th>
						<kc-input v-model="searchDataExclude" placeholder="请输入内容"
								  @keydown.enter.native="searchDeviceExclude">

							<i slot="suffix" class="icon kedaIconfont KD-sousuo search-size keda-icon-heavy-style" @click="searchDeviceExclude"></i>
						</kc-input>
					</th>
					<th>
						<kc-checkbox v-model="allWatchingExclude" @change="changeAllWatchingExclude"
									 :indeterminate="isIndeterminate.isE">实时观看
						</kc-checkbox>
					</th>
					<th>
						<kc-checkbox v-model="histroyWatchingExclude" @change="changeHistroyWatchingExclude"
									 :indeterminate="isIndeterminate.isF">历史回放
						</kc-checkbox>
					</th>
					<th>
						<kc-checkbox v-model="videoDownLoadExclude" @change="changeVideoDownLoadExclude"
									 :indeterminate="isIndeterminate.isG">视频下载
						</kc-checkbox>
					</th>
					<th>
						<kc-checkbox v-model="PTZControlExclude" @change="changePTZControlExclude"
									 :indeterminate="isIndeterminate.isH">PTZ控制
						</kc-checkbox>
					</th>
				</tr>
				</thead>
				<tbody >
				<tr v-for="(item,index) in selectedDataExclude" :key="index">
					<td style="width:35%;">
						<span class="device-name" :title="item.deviceName">{{item.deviceName}}</span>
						<span style="cursor:pointer;" class="device-delete" @click="delCurrentExclude(index)">
							<kc-tooltip class="item" effect="light" content="删除" placement="right">
							  	<i class="icon kedaIconfont KD-shanchuxiao2 keda-icon-style"></i>&nbsp;&nbsp;
							</kc-tooltip>&nbsp;
						</span>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoRead"
									 @change="changeDeviceAuthExclude(index, 'videoRead')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoHistoryRead"
									 @change="changeDeviceAuthExclude(index, 'videoHistoryRead')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoDownload"
									 @change="changeDeviceAuthExclude(index, 'videoDownload')"></kc-checkbox>
					</td>
					<td>
						<kc-checkbox v-model="item.permissionCodeDTO.videoPtzControl"
									 @change="changeDeviceAuthExclude(index, 'videoPtzControl')"></kc-checkbox>
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
				activedList: [],
				deviceTable: true,
				/* 已授权 */
				selectedData: [],
				searchData: '',
				allWatching: false,
				histroyWatching: false,
				videoDownLoad: false,
				PTZControl: false,
				/* 已剔除 */
				selectedDataExclude: [],
				searchDataExclude: '',
				allWatchingExclude: false,
				histroyWatchingExclude: false,
				videoDownLoadExclude: false,
				PTZControlExclude: false,
				isIndeterminate: {
					isA: false,
					isB: false,
					isC: false,
					isD: false,
					isE: false,
					isF: false,
					isG: false,
					isH: false
				},
				radio: '1',
				searchState: false,
				addDevice: false,
				LoadingDeviceAuth: false,
				LoadingDelDeviceAuth: false,
				videoDeviceIds: {}
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
			deviceInfosData: {
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
				if (val == 1) {
					this.searchData = '';
					if (this.deviceTable === false) {
						this.deviceTable = true;
						this.getDeviceAuth(this.currentRoleId, '');
					}
				} else if (val == 2) {
					this.searchDataExclude = '';
					if (this.deviceTable === true) {
						this.deviceTable = false;
						this.getDelDeviceAuth(this.currentRoleId, '');
					}
				}
			},
			activedList: function () {
				if (this.activedList.length) {
					if (this.activedList instanceof Array) {
						this.activedList.forEach(item => {
							item.id = item.dataId;
						});
						// 从树选择设备添加
						this.$emit('deviceInfo', this.activedList);
					} else if (this.activedList instanceof Object) {
						// 从搜索列表选择设备添加
						let deviceList = [];
						deviceList.push(this.activedList);
						this.$emit('deviceInfo', deviceList);
					}
				}
			},
			currentRoleId (val) {
				if(this.deviceTable){
					this.getDeviceAuth(val, '');
				}else{
					this.getDelDeviceAuth(val, '');
				}
			},
			//监控树，添加设备(已授权，已剔除）
			deviceInfosData (val) {
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
								videoRead: true,
								videoHistoryRead: true,
								videoDownload: true,
								videoPtzControl: true
							}
						};
						addDeviceAuthRoleApi(params).then(res => {
							that.addDevice = false;
							if (res.status === 200) {
								let obj = {
									deviceName: val[0].nodeInfo.title || val[0].nodeInfo.deviceName,
									permissionCodeDTO: {
										videoRead: true,
										videoHistoryRead: true,
										videoDownload: true,
										videoPtzControl: true
									},
									id: val[0].nodeInfo.id
								};
								that.selectedData.push(obj);
								that.videoDeviceIds[val[0].nodeInfo.id] = true;
								that.VIDEO_DVICE_IDS(that.videoDeviceIds);
								// that.refreshChecked();
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
								if(that.selectedData){
									for(let i = 0; i < that.selectedData.length; i++){
										if(that.selectedData[i].id == val[0].nodeInfo.id){
											that.selectedData.splice(i, 1);
										}
									}
								}
								that.videoDeviceIds[val[0].nodeInfo.id] = false;
								that.VIDEO_DVICE_IDS(that.videoDeviceIds);
								// that.refreshChecked();
							}
						});
					}
				}else if (that.radio === '2') {
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
								videoRead: true,
								videoHistoryRead: true,
								videoDownload: true,
								videoPtzControl: true
							}
						};
						delDeviceAuthRoleApi(params).then(res => {
							that.addDevice = false;
							if (res.status === 200) {
								let obj = {
									deviceName: val[0].nodeInfo.title || val[0].nodeInfo.deviceName,
									permissionCodeDTO: {
										videoRead: true,
										videoHistoryRead: true,
										videoDownload: true,
										videoPtzControl: true
									},
									id: val[0].nodeInfo.id
								};
								that.selectedDataExclude.push(obj);
								that.videoDeviceIds[val[0].nodeInfo.id] = true;
								that.VIDEO_DVICE_IDS(that.videoDeviceIds);
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
								that.videoDeviceIds[val[0].nodeInfo.id] = false;
								that.VIDEO_DVICE_IDS(that.videoDeviceIds);
							}
						});
					}
				}
			}
		},
		methods: {
			...mapMutations({
				VIDEO_DVICE_IDS: 'VIDEO_DVICE_IDS'
			}),
			changeRadio (val) {
				this.radio = val;
			},
			/* 表 */
			// 实时观看全选
			changeAllWatching (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.videoRead = val;
				});
				this.isIndeterminate.isA = false;
				this.changeAllDeviceAuth();
			},
			// 历史回放全选
			changeHistroyWatching (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.videoHistoryRead = val;
				});
				this.isIndeterminate.isB = false;
				this.changeAllDeviceAuth();
			},
			// 视频下载全选
			changeVideoDownLoad (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.videoDownload = val;
				});
				this.isIndeterminate.isC = false;
				this.changeAllDeviceAuth();
			},
			// PTZ控制全选
			changePTZControl (val) {
				this.selectedData.forEach(element => {
					element.permissionCodeDTO.videoPtzControl = val;
				});
				this.isIndeterminate.isD = false;
				this.changeAllDeviceAuth();
			},
			/*  */
			// 实时观看全选 已剔除
			changeAllWatchingExclude (val) {
				this.selectedDataExclude.forEach(element => {
					element.permissionCodeDTO.videoRead = val;
				});
				this.isIndeterminate.isE = false;
				this.changeAllDeviceAuthExclude();
			},
			// 历史回放全选 已剔除
			changeHistroyWatchingExclude (val) {
				this.selectedDataExclude.forEach(element => {
					element.permissionCodeDTO.videoHistoryRead = val;
				});
				this.isIndeterminate.isF = false;
				this.changeAllDeviceAuthExclude();
			},
			// 视频下载全选 已剔除
			changeVideoDownLoadExclude (val) {
				this.selectedDataExclude.forEach(element => {
					element.permissionCodeDTO.videoDownload = val;
				});
				this.isIndeterminate.isG = false;
				this.changeAllDeviceAuthExclude();
			},
			// PTZ控制全选 已剔除
			changePTZControlExclude (val) {
				this.selectedDataExclude.forEach(element => {
					element.permissionCodeDTO.videoPtzControl = val;
				});
				this.isIndeterminate.isH = false;
				this.changeAllDeviceAuthExclude();
			},
			// 单条授权设备更改设备授权
			changeDeviceAuth (index, type) {
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

				let params = {
					id: this.currentRoleId,
					status: [{
						deviceId: this.selectedData[index].id,
						videoRead: this.selectedData[index].permissionCodeDTO.videoRead,
						videoHistoryRead: this.selectedData[index].permissionCodeDTO.videoHistoryRead,
						videoDownload: this.selectedData[index].permissionCodeDTO.videoDownload,
						videoPtzControl: this.selectedData[index].permissionCodeDTO.videoPtzControl
					}]
				};
				changeDeviceAuthApi(params).then(res => {
				});
			},
			// 单条已剔除设备更改设备权限
			changeDeviceAuthExclude (index, type) {
				let flagArr = [];
				this.selectedDataExclude.forEach((v, i) => {
					flagArr.push(v.permissionCodeDTO[type]);
				});

				let flagTrue = flagArr.every(v => v === true);
				if (type === 'videoRead') {
					this.allWatchingExclude = flagTrue;
					if (!this.allWatchingExclude) {
						this.isIndeterminate.isE = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isE = false;
					}
				} else if (type === 'videoHistoryRead') {
					this.histroyWatchingExclude = flagTrue;
					if (!this.histroyWatchingExclude) {
						this.isIndeterminate.isF = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isF = false;
					}
				} else if (type === 'videoDownload') {
					this.videoDownLoadExclude = flagTrue;
					if (!this.videoDownLoadExclude) {
						this.isIndeterminate.isG = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isG = false;
					}
				} else if (type === 'videoPtzControl') {
					this.PTZControlExclude = flagTrue;
					if (!this.PTZControlExclude) {
						this.isIndeterminate.isH = flagArr.some(v => v === true);
					} else {
						this.isIndeterminate.isH = false;
					}
				}

				let params = {
					id: this.currentRoleId,
					status: [{
						deviceId: this.selectedDataExclude[index].id,
						videoRead: this.selectedDataExclude[index].permissionCodeDTO.videoRead,
						videoHistoryRead: this.selectedDataExclude[index].permissionCodeDTO.videoHistoryRead,
						videoDownload: this.selectedDataExclude[index].permissionCodeDTO.videoDownload,
						videoPtzControl: this.selectedDataExclude[index].permissionCodeDTO.videoPtzControl
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
						videoRead: el.permissionCodeDTO.videoRead,
						videoHistoryRead: el.permissionCodeDTO.videoHistoryRead,
						videoDownload: el.permissionCodeDTO.videoDownload,
						videoPtzControl: el.permissionCodeDTO.videoPtzControl
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
						videoRead: el.permissionCodeDTO.videoRead,
						videoHistoryRead: el.permissionCodeDTO.videoHistoryRead,
						videoDownload: el.permissionCodeDTO.videoDownload,
						videoPtzControl: el.permissionCodeDTO.videoPtzControl
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
							this.refreshChecked();
						}
					}
				}, error => {
					that.LoadingDeviceAuth = false;
					this.$message.warning(error);
				}).catch(err => {
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
							this.selectedDataExclude = res.result;

							let flagArrVideoRead = [];
							let flagArrVideoHistoryRead = [];
							let flagArrVideoDownload = [];
							let flagArrvideoPtzControl = [];
							for(let key in that.videoDeviceIds){
								that.videoDeviceIds[key] = false;
							}
							this.selectedDataExclude.forEach((v, i) => {
								flagArrVideoRead.push(v.permissionCodeDTO['videoRead']);
								flagArrVideoHistoryRead.push(v.permissionCodeDTO['videoHistoryRead']);
								flagArrVideoDownload.push(v.permissionCodeDTO['videoDownload']);
								flagArrvideoPtzControl.push(v.permissionCodeDTO['videoPtzControl']);
								that.videoDeviceIds[v.id] = true;
							});
							if(!that.searchState) {
								that.VIDEO_DVICE_IDS(that.videoDeviceIds);
							}
							this.toAjustCheckedStatus('allWatchingExclude', 'isE', flagArrVideoRead);
							this.toAjustCheckedStatus('histroyWatchingExclude', 'isF', flagArrVideoHistoryRead);
							this.toAjustCheckedStatus('videoDownLoadExclude', 'isG', flagArrVideoDownload);
							this.toAjustCheckedStatus('PTZControlExclude', 'isH', flagArrvideoPtzControl);
						}
					}
				}, error => {
					this.$message.warning(error);
					that.LoadingDelDeviceAuth = false;
				});
			},
			// 刷新顶部checkbox [checked]
			refreshChecked () {
				let flagArrVideoRead = [];
				let flagArrVideoHistoryRead = [];
				let flagArrVideoDownload = [];
				let flagArrvideoPtzControl = [];
				for(let key in this.videoDeviceIds){
					this.videoDeviceIds[key] = false;
				}
				this.selectedData.forEach((v, i) => {
					flagArrVideoRead.push(v.permissionCodeDTO['videoRead']);
					flagArrVideoHistoryRead.push(v.permissionCodeDTO['videoHistoryRead']);
					flagArrVideoDownload.push(v.permissionCodeDTO['videoDownload']);
					flagArrvideoPtzControl.push(v.permissionCodeDTO['videoPtzControl']);
					this.videoDeviceIds[v.id] = true;
				});
				this.VIDEO_DVICE_IDS(this.videoDeviceIds);
				this.toAjustCheckedStatus('allWatching', 'isA', flagArrVideoRead);
				this.toAjustCheckedStatus('histroyWatching', 'isB', flagArrVideoHistoryRead);
				this.toAjustCheckedStatus('videoDownLoad', 'isC', flagArrVideoDownload);
				this.toAjustCheckedStatus('PTZControl', 'isD', flagArrvideoPtzControl);
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
						that.videoDeviceIds[that.selectedData[index].id] = false;
						that.selectedData.splice(index, 1);
						if (that.selectedData.length === 0) {
							that.showTable = false;
						}
						that.VIDEO_DVICE_IDS(that.videoDeviceIds);
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
						that.videoDeviceIds[that.selectedDataExclude[index].id] = false;
						that.selectedDataExclude.splice(index, 1);
						if (that.selectedDataExclude.length === 0) {
							that.showTable = false;
						}
						that.VIDEO_DVICE_IDS(that.videoDeviceIds);
					}
				});
			},
			delAll () {
				let that = this;
				that.$confirm('确认删除此设备吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					type: 'warning'
				}).then(() => {
					if (that.radio === '1') {
						let sbids = [];
						that.selectedData.forEach(el => {
							sbids.push(el.id);
						});
						let params = {
							id: that.currentRoleId,
							ids: {
								deviceIds: sbids
							}
						};
						delAllDeviceApi(params).then(res => {
							if (res.status === 200) {
								that.selectedData = [];
							}
						});
						that.showTable = false;
					} else if (this.radio === '2') {
						let sbids1 = [];
						that.selectedDataExclude.forEach(el => {
							sbids1.push(el.id);
						});
						let params = {
							id: that.currentRoleId,
							ids: {
								deviceIds: sbids1
							}
						};
						delAllDeviceExcludeApi(params).then(res => {
							if (res.status === 200) {
								that.selectedDataExclude = [];
							}
						});
						that.showTable = false;
					}
					for(let key in that.videoDeviceIds){
						that.videoDeviceIds[key] = false;
					}
					that.VIDEO_DVICE_IDS(that.videoDeviceIds);
				});
			}
		}

	};

</script>
