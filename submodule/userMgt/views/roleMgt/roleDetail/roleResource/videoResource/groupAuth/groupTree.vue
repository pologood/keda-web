<template>
	<div class="userMgt-roleMan-videoResource-videoTree">
		<div class="header-bg">
			<h4 class="header-title">待选分组</h4>
		</div>
		<div class="left-tree">
			<kc-tree
				ref="videoGroupTree"
				:data="videoTreeData"
				:check-on-click-node="true"
				:indent="indent"
				:props="defaultProps"
				node-key="id"
				show-checkbox
				v-loading="treeDataLoading"
				default-expand-all
				@check="checkBoxSelected">
			</kc-tree>
		</div>
	</div>

</template>
<script>
	import {loadSbfzTree} from '../../../../../../service/roleMgt.js';
	export default {
		components: {
		},
		data () {
			return {
				indent: {size: 0.9, unit: 'rem'},
				videoTreeData: [],
				defaultProps: {
					children: 'children',
					label: 'groupName'
				},
				treeDataLoading: true
			};
		},
		props: {
			fzGroupIds: {
				type: Array
			},
			searchInfo: {
				type: Object
			}
		},
		watch: {
			fzGroupIds (val) {
				if (val) {
					this.$refs.videoGroupTree.setCheckedKeys(val);
				}
			},
			searchInfo(val){
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
				this._loadDeviceGroupTree(params);
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
			this._loadDeviceGroupTree(params);
		},
		methods: {
			// 加载设备分组树
			_loadDeviceGroupTree (parmars) {
				loadSbfzTree(parmars).then(res => {
					this.treeDataLoading = false;
					if (res && res.result) {
						this.videoTreeData = res.result;
					}
				}, err => {
					this.treeDataLoading = false;
					this.$message.warning(err);
				});
			},
			// checkbox选中事件
			checkBoxSelected (val, checked) {
				let isChecked = false;
				checked.checkedKeys.map((ele) => {
					if(ele == val.id){
						isChecked = true;
						return true;
					}
				});
				this.$emit('addGroup', {
					nodeInfo: val,
					checked: isChecked
				});
			}
		}
	};

</script>
