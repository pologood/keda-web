<template>
	<div class="userMgt-roleMan-functionMenu">
		<kc-row class="menu-row" :gutter="20">
			<kc-col :span="12" class="menu-col-item">
				<div class="grid-content bg-purple left">
					<div class="header-bg">
						<span>GIS屏菜单</span>
					</div>
					<div class="menu-tree-wrapper" v-loading="treeDataLoading1">
						<kc-tree :data="gisData"
								 ref="gisTree"
								 show-checkbox node-key="id"
								 @check="gisCheck"
								 default-expand-all
								 :indent="indent"
								 :props="defaultProps">
						</kc-tree>
					</div>
				</div>
			</kc-col>
			<kc-col :span="12" class="menu-col-item">
				<div class="grid-content bg-purple-light right">
					<div class="header-bg">
						<span>业务屏菜单</span>
					</div>
					<div class="menu-tree-wrapper" v-loading="treeDataLoading2">
						<kc-tree :data="businessData"
								 ref="businessTree"
								 show-checkbox node-key="id"
								 @check="businessChecked"
								 default-expand-all
								 :indent="indent"
								 :props="defaultProps">
						</kc-tree>
					</div>
				</div>
			</kc-col>
		</kc-row>

	</div>
</template>

<script>
	import Global from 'utils/global';
	import myGlobal from '../../../../../utils/myGlobal';
	import {
		getTreeCheckedApi,
		batchImpower
	} from '../../../../../service/roleMgt.js';

	export default {
		components: {
		},
		data () {
			return {
				indent: {size: 0.9, unit: 'rem'},
				gisData: [],
				businessData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				treeDataLoading1: true,
				treeDataLoading2: true
			};
		},
		props: {
			currentRoleId: {
				type: String
			}
		},
		created () {
			this.getTreeChecked();
		},
		watch: {
			// 监听 currentRoleId变化
			currentRoleId (val) {
				this.currentRoleId = val;
				this.getTreeChecked();
			}
		},
		methods: {
			// 获取资源(gis菜单,业务屏菜单)
			getTreeChecked () {
				let params = {
					f_eq_settingForId: this.currentRoleId,
					paging: false,
					f_eq_settingForType: 'ROLE',
					'f_eq_resource.clientSign': Global.getClientSign()
				};
				this.businessData = [];
				this.gisData = [];
				getTreeCheckedApi(params).then(response => {
					this.treeDataLoading1 = false;
					this.treeDataLoading2 = false;
					if (!response.result || response.result.length < 1){
						return;
					};
					response.result.forEach(val => {
						if (val.sign === myGlobal.getSignMenuGIS()) {
							this.gisData = val.children;
						} else if (val.sign === myGlobal.getSignMenuBusiness()) {
							this.businessData = val.children;
						}
					});

					this.$nextTick(() => {
						this.setGisChecked(this.gisData);
						this.setBusinessChecked(this.businessData);
					});
				}, error => {
					this.$message.warning(error);
					this.treeDataLoading1 = false;
					this.treeDataLoading2 = false;
				});
			},
			//设置gis菜单选中项
			setGisChecked(treeData){
				for (let i = 0, len = treeData.length; i < len; i++) {
					if (treeData[i].checked) {
						this.$refs.gisTree.setChecked(treeData[i].id, true);//设置选中
					}
					if (treeData[i].hasChildren) {
						this.setGisChecked(treeData[i].children);
					}
				}
			},
			//设置业务屏菜单选中项
			setBusinessChecked(treeData){
				for (let i = 0, len = treeData.length; i < len; i++) {
					if (treeData[i].checked) {
						this.$refs.businessTree.setChecked(treeData[i].id, true);//设置选中
					}
					if (treeData[i].hasChildren) {
						this.setBusinessChecked(treeData[i].children);
					}
				}
			},
			// 获取所有checked数据(gis菜单,业务屏菜单)
			getCheckedNode () {
				let checkedNode = [];
				let gisTreeIds = this.$refs.gisTree.getCheckedKeys();//获取gis选中项 id
				let	businessTreeIds = this.$refs.businessTree.getCheckedKeys();//获取业务选中项key id
				let	allIds = gisTreeIds.concat(businessTreeIds);
				for (let i = 0, len = allIds.length; i < len; i++) {
					let obj = {
						resource: {
							id: allIds[i]
						},
						dataScope: '1'
					};
					checkedNode.push(obj);
				}
				return checkedNode;
			},
			// gis树checkbox选中事件
			gisCheck (val, checkedstatus) {
				let settings = this.getCheckedNode();
				let params = {
					settings,
					settingForId: this.currentRoleId,
					settingForType: 'ROLE'
				};
				batchImpower(params).then(res => {
					if (res.status === 200) {
						// this.gisSettings = [];
						this.$message({
							message: '设置成功！',
							type: 'success',
							duration: 1000
						});
					}else{
						this.$message({
							message: '设置失败！',
							type: 'error',
							duration: 1000
						});
						this.getTreeChecked();
					}
				});
			},
			// business树checkbox选中事件
			businessChecked (val, checkedstatus) {
				let settings = this.getCheckedNode();
				let params = {
					settings,
					settingForId: this.currentRoleId,
					settingForType: 'ROLE'
				};
				batchImpower(params).then(res => {
					if (res.status === 200) {
						this.$message({
							message: '设置成功！',
							type: 'success',
							duration: 1000
						});
					}else {
						this.$message({
							message: '设置失败！',
							type: 'error',
							duration: 1000
						});
						this.getTreeChecked();
					}
				});
			}
		}
	};
</script>
