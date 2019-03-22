<template>
	<div class="userMgt-roleMan-tollgatesResource-groupTree">
		<div class="header-bg">
			<h4 class="header-title">待选分组</h4>
		</div>
		<div class="left-tree">
			<kc-tree
				ref="tollgatesGroupTree"
				node-key="id"
				:props="defaultProps"
				:indent="indent"
				:data="videoTreeData"
				:check-on-click-node="true"
				:default-checked-keys="fzIdArray"
				default-expand-all
				show-checkbox
				v-loading="treeDataLoading"
				@check="checkBoxSelected"
			>
			</kc-tree>
		</div>
	</div>

</template>
<script>
	import {
		loadSbfzTree
	} from '../../../../../../service/roleMgt.js';

	export default {
		components: {
		},
		data () {
			return {
				indent: {size: 0.9, unit: 'rem'},
				fzIdArray: [],
				videoTreeData: [],
				defaultProps: {
					children: 'children',
					label: 'groupName'
				},
				treeDataLoading: true
			};
		},
		props: {
			kkGroupIds: {
				type: Array
			},
			searchInfo: {
				type: Object
			}
		},
		watch: {
			searchInfo (val) {
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
				this.loadSbfzTree(params);
			},
			kkGroupIds (val) {
				if (val) {
					this.$refs.tollgatesGroupTree.setCheckedKeys(val);
				}
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
			this.loadSbfzTree(params);
		},
		methods: {
			loadSbfzTree (parmars){
				this.videoTreeData = [];
				loadSbfzTree(parmars).then(response => {
					this.treeDataLoading = false;
					this.videoTreeData = response.result;
				}, err => {
					this.treeDataLoading = false;
					this.$message.warning(err);
				});
			},
			checkBoxSelected (val, checked) {
				let ischecked = false;
				checked.checkedKeys.map((ele) => {
					if(ele == val.id){
						ischecked = true;
						return true;
					}
				});
				this.$emit('kaddGroup', {
					nodeInfo: val,
					checked: ischecked
				});
			}
		}
	};

</script>
