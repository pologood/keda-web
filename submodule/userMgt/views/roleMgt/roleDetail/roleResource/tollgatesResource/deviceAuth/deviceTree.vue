<template>
	<div class="userMgt-roleMan-tollgatesResource-deviceTree">
		<div class="top">
			<div class="header-bg">待选设备
			</div>
			<div class="search-box">
				<kc-input v-model="searchData" placeholder="请输入内容"
						  @keydown.enter.native="searchTollgatesData">
					<i slot="suffix" class="icon kedaIconfont KD-sousuo search-size keda-icon-heavy-style" @click="searchTollgatesData"></i>
				</kc-input>
				<kc-button class="user-serach-button keda-icon-heavy-style"
						   @click="backToTree()"
						   size="small">
					<kc-tooltip class="item" effect="light" content="复位" placement="right">
						<i class="icon kedaIconfont KD-fuwei"></i>
					</kc-tooltip>
				</kc-button>
			</div>
		</div>
		<div class="dev-body m-scroll">
			<div class="left-tree m-scroll" v-show="showTree">
				<kd-tree
					ref= "deviceTree"
					node-key= "id"
					lazy
					:props= "defaultProps"
					:indent="8"
					:load="loadDataLazy"
					:data= 'treeData'
					:expand-on-click-node="true"
					v-loading="treeDataLoading"
					@add-data-from-server="addDataFromServer">
					 <span class="custom-tree-node" slot-scope="{ node, data }">
						 <kc-checkbox  v-if="!node.data.children && node.data.leaf"  v-model="tollgatesDeviceIds[node.data.id]" @change="()=> checkBoxSelected(node, data)">{{ node.label||node.data.deviceName }}</kc-checkbox>
						 <span v-if="!node.data.leaf">
							 {{ node.label }}</span>
					 </span>
				</kd-tree>
			</div>
			<div class="search-table" v-show="!showTree">
				<kc-table ref="multipleTable" border   highlight-current-row :data="searchTableData"  tooltip-effect="dark" style="width: 100%;cursor: pointer;" height="100%" @row-dblclick="checkBoxSelected">
					<kc-table-column label="设备信息" show-overflow-tooltip prop="deviceName"></kc-table-column>
					<kc-table-column label="状态" width='100' prop="status">
						<template slot-scope="scope">
							<span>{{mapStatus(scope.row.status)}}</span>
						</template>
					</kc-table-column>
				</kc-table>
			</div>
		</div>
	</div>

</template>
<script>
	import {
		loadSbfzTree,
		getTreeListDeviceApi,
		getDeviceCountApi,
		searchDeviceByDeviceGroup
	} from '../../../../../../service/roleMgt.js';
	import { createNamespacedHelpers } from 'vuex';
	const { mapState } = createNamespacedHelpers('userMgtStore');

	export default {
		data () {
			return {
				indent: {size: 0.9, unit: 'rem'},
				deviceGroupId: 0,
				defaultProps: {
					children: 'children',
					label: 'title',
					isLeaf: 'leaf'
				},
				searchData: '',
				searchState: false,
				showTree: true,
				searchTableData: [],
				fzIds: [],
				fzIdsObj: {},
				tempData: [],
				treeData: [],
				memory: {},
				childData: [],
				fzId: null,
				treeDataLoading: true,
				isExpanded: false
			};
		},
		props: {
			searchInfo: {
				type: Object
			}
		},
		created () {
			let params = {
				num: this.searchInfo.info.groupType,
				data: {
					deviceName: '',
					ar: this.searchInfo.info.ar,
					deviceTypes: this.searchInfo.info.deviceTypes,
					cameraForms: this.searchInfo.info.cameraForms,
					cameraAbilitys: this.searchInfo.info.cameraAbilitys
				}
			};
			this._loadSbfzTree(params);
		},
		watch: {
			searchInfo(val) {
				let params = {
					num: val.info.groupType,
					data: {
						deviceName: '',
						ar: val.info.ar,
						deviceTypes: val.info.deviceTypes,
						cameraForms: val.info.cameraForms,
						cameraAbilitys: val.info.cameraAbilitys
					}
				};
				this._loadSbfzTree(params);
			}
		},
		computed: {
			...mapState({
				tollgatesDeviceIds: state => state.roleMan.tollgatesDeviceIds
			})
		},
		methods: {
			// 获取树的数据
			_loadSbfzTree (params) {
				// 获取
				loadSbfzTree(params).then(response => {
					this.treeDataLoading = false;
					let tempData = [];
					this.dataHandler(response.result, tempData);
					this._getDeviceCount(params.num, res => {
						res.result.forEach((v, i) => {
							this.fzIdsObj[v.groupId] = v;
						});
						this.dataHandlerFinally(tempData);
						this.treeData = JSON.parse(JSON.stringify(tempData));
					});
				}, err => {
					this.treeDataLoading = false;
					this.$message.warning(err);
				});
			},
			_getDeviceCount (fzId, cb) {
				getDeviceCountApi(fzId).then(res => {
					cb(res);
				});
			},
			loadDataLazy (value, callback) {
				if(typeof value.data.children !== 'undefined' && value.data.children.length > 0){
					callback(value.data.children);
				}else {
					let childData = [];
					let fzId = value.data.id;
					let pageNo = 0;
					let params = {
						id: fzId,
						status: {
							pageNo,
							deviceName: '',
							ar: this.searchInfo.info.ar,
							deviceTypes: this.searchInfo.info.deviceTypes,
							cameraForms: this.searchInfo.info.cameraForms,
							cameraAbilitys: this.searchInfo.info.cameraAbilitys,
							pageSize: 20
						}
					};
					if(!fzId){
						return;
					}
					getTreeListDeviceApi(params).then(res => {
						pageNo++;
						let childDataTemp = res.result.data;
						if (childDataTemp && childDataTemp.length > 0) {
							childDataTemp.forEach((v, i) => {
								childData[i] = {};
								childData[i].deviceId = v.deviceId;
								childData[i].id = v.id;
								childData[i].gbId = v.gbId;
								childData[i].title = v.deviceName;
								childData[i].point = [v.lng, v.lat];
								childData[i].status = v.status;
								childData[i].leaf = true;
							});
						}
						callback(childData);
					});
				}
			},
			// 添加加载更多数据
			addDataFromServer({instance, node, pageNum}){
				let fzId = node.data.id;
				let	pageNo = pageNum;
				let params = {
					id: fzId,
					status: {
						pageNo,
						deviceName: '',
						ar: this.searchInfo.info.ar,
						deviceTypes: this.searchInfo.info.deviceTypes,
						cameraForms: this.searchInfo.info.cameraForms,
						cameraAbilitys: this.searchInfo.info.cameraAbilitys,
						pageSize: 20
					}
				};
				getTreeListDeviceApi(params).then(res => {
					if(pageNo < res.result.totalPages){
						node.unfinish = true;
					}
					instance.addData(res.result.data);
				});
			},
			// 勾选或者取消某设备授权
			checkBoxSelected(val) {
				let checkedFlag;
				if(val.data){
					if(this.tollgatesDeviceIds[val.data.id]){
						checkedFlag = true;
					}else{
						checkedFlag = false;
					}
				}else{
					if(this.tollgatesDeviceIds[val.id]){
						checkedFlag = false;
					}else{
						checkedFlag = true;
					}
				}
				this.$emit('addKDeviceInfo', [{
					nodeInfo: val.data || val,
					checked: checkedFlag
				}]);
			},
			// 渲染树递归
			dataHandler (data, copyData) {
				data.forEach((v, i) => {
					this.fzIds.push(v.id);
					copyData[i] = {};
					copyData[i].title = v.groupName;
					copyData[i].id = v.id;
					if (v.children) {
						copyData[i].children = [];
						this.dataHandler(v.children, copyData[i].children);
					} else {
						copyData[i].children = [];
						copyData[i].loading = false;
					}
				});
			},
			dataHandlerFinally (data) {
				data.forEach((v, i) => {
					v.count = {};
					v.count.total = this.fzIdsObj[v.id].totalNum;
					v.count.num1 = this.fzIdsObj[v.id].onlineNum;
					v.count.num2 = this.fzIdsObj[v.id].offlineNum;
					v.count.num3 = this.fzIdsObj[v.id].faultNum;
					v.title = v.title + '  ' + v.count.total + ' / ' + v.count.num1 + ' / ' + v.count.num2 + ' / ' + v.count.num3;
					if (v.children !== undefined) {
						this.dataHandlerFinally(v.children);
					}
				});
			},
			// 搜索设备
			searchTollgatesData () {
				this.searchState = true;
				let searchContent = this.searchData.trim();
				if (searchContent) {
					this.showTree = false;
					let params = {
						deviceName: searchContent,
						groupType: this.deviceGroupId,
						returnTotal: false
					};
					searchDeviceByDeviceGroup(params).then(res => {
						this.searchTableData = res.result.data;
					});
				} else {
					this.$message({
						message: '请输入搜索内容',
						type: 'warning',
						duration: 2000
					});
				}
			},
			// 返回树
			backToTree () {
				this.showTree = true;
				this.searchData = '';
				this.searchState = false;
			},
			mapStatus (num) {
				let desc;
				if (num === 0) {
					desc = '在线';
				} else if (num === 1) {
					desc = '故障';
				} else if (num === 2) {
					desc = '离线';
				}
				return desc;
			}
		}
	};

</script>
