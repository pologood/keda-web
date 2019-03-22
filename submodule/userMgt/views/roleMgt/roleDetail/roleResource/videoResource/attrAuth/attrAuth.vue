<template>
	<div class="userMgt-roleMan-videoResource-attrAuth" style="">
		<div class="bg-grey">
			<table>
				<thead>
				<tr class="">
					<th>
						已选属性
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
						<span class="attr-name">
							{{item.divisionNames.join(',') || item.locationTypeNames.join(',') || item.monitoredAreaNames.join(',') }}
						</span>
						<span class="attr-delete" @click="delCurData(index)">
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
		getRoleAttrsApi,
		addAttrRoleApi,
		delCurAttributeApi,
		delAllAttributeApi,
		ChangeAttrAuthApi
	} from '../../../../../../service/roleMgt.js';
	import { createNamespacedHelpers } from 'vuex';
	const {mapMutations} = createNamespacedHelpers('userMgtStore');
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
				Loading: true,
				choosedAttrs: {}
			};
		},
		props: {
			addGroupData: {
				type: Object
			},
			currentRoleId: {
				type: String
			}
		},
		computed: {

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
					let divisionCodes = [];
					let locationTypeCodes = [];
					let monitoredAreaCodes = [];

					if(val.nodeInfo.children){
						val.nodeInfo.children.map((item) => {
							switch (item.parentName) {
							case '所属部门':
								divisionCodes.push(item.no);
								break;
							case '摄像机位置类型':
								locationTypeCodes.push(item.no);
								break;
							case '监控区域类型':
								monitoredAreaCodes.push(item.no);
								break;
							}
						});
					}else{
						switch (val.nodeInfo.parentName) {
						case '所属部门':
							divisionCodes.push(val.nodeInfo.no);
							break;
						case '摄像机位置类型':
							locationTypeCodes.push(val.nodeInfo.no);
							break;
						case '监控区域类型':
							monitoredAreaCodes.push(val.nodeInfo.no);
							break;
						}
					}
					let params = {
						id: this.currentRoleId,
						types: {
							divisionCodes: divisionCodes,
							monitoredAreaCodes: monitoredAreaCodes,
							locationTypeCodes: locationTypeCodes,
							videoRead: true,
							videoHistoryRead: true,
							videoDownload: true,
							videoPtzControl: true
						}
					};
					addAttrRoleApi(params).then(res => {
						if (res.status === 200) {
						} else {
							this.$alert(res.message, '提示');
						}
						this.getRoleAuth();
						this.divisionCodes = [];
						this.monitoredAreaCodes = [];
						this.locationTypeCodes = [];
					});
				}else if (val.checked === false && val.nodeInfo) {
					let index = '';
					let attrAuthId = [];
					if(val.nodeInfo.children){
						val.nodeInfo.children.map((item) => {
							for (let i = 0, len = this.selectedData.length; i < len; i++) {
								if (this.selectedData[i].divisionCodes[0] === item.id) {
									index = i;
									attrAuthId.push(this.selectedData[index].id);
									break;
								}
								if (this.selectedData[i].monitoredAreaCodes[0] === item.id) {
									index = i;
									attrAuthId.push(this.selectedData[index].id);
									break;
								}
								if (this.selectedData[i].locationTypeCodes[0] === item.id) {
									index = i;
									attrAuthId.push(this.selectedData[index].id);
									break;
								}
							}
						});
					}else{
						for (let i = 0, len = this.selectedData.length; i < len; i++) {
							if (this.selectedData[i].divisionCodes[0] === val.nodeInfo.id) {
								index = i;
								attrAuthId.push(this.selectedData[index].id);
								break;
							}
							if (this.selectedData[i].monitoredAreaCodes[0] === val.nodeInfo.id) {
								index = i;
								attrAuthId.push(this.selectedData[index].id);
								break;
							}
							if (this.selectedData[i].locationTypeCodes[0] === val.nodeInfo.id) {
								index = i;
								attrAuthId.push(this.selectedData[index].id);
								break;
							}
						}
					}

					let params = {
						roleId: this.currentRoleId,
						ids: {
							ids: attrAuthId
						}
					};
					delAllAttributeApi(params).then(res => {
						if (res.status === 200) {
							this.getRoleAuth();
						}
					});
				}
			}
		},
		methods: {
			...mapMutations({
				ATTRS_SELECTED: 'ATTRS_SELECTED'
			}),
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
			// 查询属性授权(绑定)
			getRoleAuth () {
				let that = this;
				let params = {
					roleId: this.currentRoleId
				};
				getRoleAttrsApi(params).then(res => {
					that.Loading = false;
					if (res && res.result) {
						that.selectedData = res.result;
						let flagArrVideoRead = [];
						let flagArrVideoHistoryRead = [];
						let flagArrVideoDownload = [];
						let flagArrvideoPtzControl = [];
						for(let key in that.choosedAttrs){
							that.choosedAttrs[key] = false;
						}
						that.selectedData.forEach((v, i) => {
							flagArrVideoRead.push(v.permissionCodeDTO['videoRead']);
							flagArrVideoHistoryRead.push(v.permissionCodeDTO['videoHistoryRead']);
							flagArrVideoDownload.push(v.permissionCodeDTO['videoDownload']);
							flagArrvideoPtzControl.push(v.permissionCodeDTO['videoPtzControl']);
						});

						that.allWatching = flagArrVideoRead.every(v => v === true);
						if (!that.allWatching) {
							that.isIndeterminate.isA = flagArrVideoRead.some(v => v === true);
						} else {
							that.isIndeterminate.isA = false;
						}
						that.histroyWatching = flagArrVideoHistoryRead.every(v => v === true);
						if (!that.histroyWatching) {
							that.isIndeterminate.isB = flagArrVideoHistoryRead.some(v => v === true);
						} else {
							that.isIndeterminate.isB = false;
						}
						that.videoDownLoad = flagArrVideoDownload.every(v => v === true);
						if (!that.videoDownLoad) {
							that.isIndeterminate.isC = flagArrVideoDownload.some(v => v === true);
						} else {
							that.isIndeterminate.isC = false;
						}
						that.PTZControl = flagArrvideoPtzControl.every(v => v === true);
						if (!that.PTZControl) {
							that.isIndeterminate.isD = flagArrVideoDownload.some(v => v === true);
						} else {
							that.isIndeterminate.isD = false;
						}
						that.fzIds = [];
						that.selectedData.forEach(el => {
							if(el.divisionCodes.length > 0){
								el.divisionCodes.map((item) => {
									if(that.fzIds.indexOf(item) == -1){
										that.fzIds.push(item);
									}
								});
							}
							if(el.locationTypeCodes.length > 0){
								el.locationTypeCodes.map((item) => {
									if(that.fzIds.indexOf(item) == -1){
										that.fzIds.push(item);
									}
								});
							}
							if(el.monitoredAreaCodes.length > 0){
								el.monitoredAreaCodes.map((item) => {
									if(that.fzIds.indexOf(item) == -1){
										that.fzIds.push(item);
									}
								});
							}
						});
						that.fzIds.forEach((v, i) => {
							that.choosedAttrs[v] = true;
						});
						that.ATTRS_SELECTED(that.choosedAttrs);
						that.$emit('groupId', that.fzIds);//获取选中树的 id
					}
				}, err => {
					this.Loading = false;
					this.$message.warning(err);
				});
			},
			// 删除单条（ok）
			delCurData (index) {
				let params = {
					roleId: this.currentRoleId,
					id: this.selectedData[index].id
				};
				delCurAttributeApi(params).then(res => {
					if (res.status === 200) {
						this.selectedData.splice(index, 1);
						this.getRoleAuth();
					}
				});
			},
			// 删除已选分组(多条)
			delAllData () {
				let that = this;
				that.$confirm('确认删除全部吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					type: 'warning'
				}).then(() => {
					let ids = [];
					that.selectedData.forEach(el => {
						ids.push(el.id);
					});
					let params = {
						roleId: that.currentRoleId,
						ids: {
							ids: ids
						}
					};
					delAllAttributeApi(params).then(res => {
						if (res.status === 200) {
							that.fzIds = [];
							that.$emit('groupId', that.fzIds);
							for(let key in that.choosedAttrs){
								that.choosedAttrs[key] = false;
							}
							that.ATTRS_SELECTED(that.choosedAttrs);
							that.selectedData = [];
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

				let params = {
					id: this.currentRoleId,
					status: [
						{
							id: this.selectedData[index].id,
							videoRead: this.selectedData[index].permissionCodeDTO.videoRead,
							videoHistoryRead: this.selectedData[index].permissionCodeDTO
								.videoHistoryRead,
							videoDownload: this.selectedData[index].permissionCodeDTO
								.videoDownload,
							videoPtzControl: this.selectedData[index].permissionCodeDTO
								.videoPtzControl
						}
					]
				};
				ChangeAttrAuthApi(params).then(res => {
				});
			},
			// 更改全部分组授权
			changeAllGroupAuth () {
				let obj = {};
				let status = [];
				this.selectedData.forEach(el => {
					obj = {
						id: el.id,
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
				ChangeAttrAuthApi(params).then(res => {
				});
			}
		}
	};

</script>
