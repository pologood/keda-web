<template>
	<div class="userMgt-roleMan-videoResource-videoTree">
		<div class="header-bg">
			<h4 class="header-title">待选分组</h4>
		</div>
		<div class="left-tree">
			<kc-tree :data="attrTreeData"
					 :check-on-click-node="true"
					 :indent="indent"
					 :props="defaultProps"
					 ref="attrGroupTree"
					 node-key="id"
					 default-expand-all
					 v-loading="treeDataLoading">
				 	<span class="custom-tree-node" slot-scope="{ node, data }">
						  <kc-checkbox  v-if="node.isLeaf"  v-model="attrsSelected[node.data.id]" @change="()=> checkBoxSelected(node, data)">{{ node.label }}</kc-checkbox>
						  <span v-else>{{ node.label }}</span>
					 </span>
			</kc-tree>
		</div>
	</div>
</template>
<script>
	import {getAttrsApi} from '../../../../../../service/roleMgt.js';
	import { createNamespacedHelpers } from 'vuex';
	const { mapState } = createNamespacedHelpers('userMgtStore');
	export default {
		data () {
			return {
				indent: {size: 0.9, unit: 'rem'},
				attrTreeData: [],
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
			}
		},
		computed: {
			...mapState({
				attrsSelected: state => state.roleMan.attrsSelected
			})
		},
		watch: {
			fzGroupIds (val) {
				if (val) {
					this.$refs.attrGroupTree.setCheckedKeys(val);
				}
			}
		},
		created () {
			this._loadDeviceGroupTree();
		},
		methods: {
			// 加载树
			_loadDeviceGroupTree () {
				getAttrsApi().then(res => {
					this.treeDataLoading = false;
					if (res.result) {
						for (let i = 0, len = res.result.length; i < len; i++) {
							res.result[i].id = i;
							res.result[i].groupName = res.result[i].codeType.codeName;
							res.result[i].children = res.result[i].codeItemPartList;
							for (let j = 0, len = res.result[i].children.length; j < len; j++) {
								res.result[i].children[j].id = res.result[i].children[j].no;
								res.result[i].children[j].parentName = res.result[i].groupName;
								res.result[i].children[j].groupName = res.result[i].children[j].codeItemName;
							}
						}
						this.attrTreeData = res.result;
					}
				}, error => {
					this.$message.warning(error);
					this.treeDataLoading = false;
				});
			},
			// checkbox选中事件
			checkBoxSelected (val) {
				let checkedFlag;
				if(this.attrsSelected[val.data.id]){
					checkedFlag = true;
				}else{
					checkedFlag = false;
				}
				this.$emit('addAttr', {
					nodeInfo: val.data,
					checked: checkedFlag
				});
			}
		}
	};

</script>
