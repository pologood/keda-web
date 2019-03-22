<template>
	<kc-tree :data="treeData"
			 :props="defaultProps"
			 node-key="id"
			 v-loading="treeDataLoading"
			 default-expand-all
			 @node-click="handleNodeClick"
			 width="12.5rem"
			 :indent="indent"
			 empty-text="无数据">
	</kc-tree>
</template>

<script>
	import {
		getOrganizationTree
	} from '../../../service/userMgt.js';
	export default {
		components: {},
		data () {
			return {
				indent: {size: 0.9, unit: 'rem'},
				treeData: [],

				defaultProps: {
					children: 'children',
					label: 'name'
				},
				treeDataLoading: true
			};
		},
		methods: {
			handleNodeClick (root, node) {
				let name = root.name;
				let code = root.code;
				let id = root.id;
				let status = root.status;
				this.$emit('changeDepartment', name, code, id, status);
			},
			handleOpen () {
				let that = this;
				// 获取树原始数据
				getOrganizationTree().then(res => {
					this.treeDataLoading = false;
					if (res.status == 200) {
						that.treeData = res.result;
					}
				}, err => {
					this.treeDataLoading = false;
					this.$message.warning(err);
				});
			}
		},
		mounted: function () {
			this.handleOpen();
		}
	};
</script>
