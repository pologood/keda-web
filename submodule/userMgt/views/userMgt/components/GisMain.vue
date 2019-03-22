<template>
<div>
	<kc-tree :data="treeData" v-loading="treeDataLoading" :props="defaultProps" @node-click="handleChange" :indent="indent"></kc-tree>
</div>
</template>

<script>
	import {getTreeCheckedApi} from '../../../service/roleMgt.js';
	import Global from 'utils/global';

	export default {
		props: {
			userId: ''
		},
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
		watch: {
			userId(val) {
				this.userId = val;
			}
		},
		methods: {
			handleChange (root, node) {
				let nodeName = root.name;
				this.$emit('changeGis', nodeName);
			}
		},
		mounted () {
			let gisparams = {
				f_eq_settingForId: this.userId,
				'f_eq_resource.clientSign': Global.getClientSign(),
				paging: false,
				f_eq_settingForType: 'USER'
			};
			getTreeCheckedApi(gisparams)
				.then(response => {
					this.treeDataLoading = false;
					if (response.result) {
						this.treeData = response.result;
					}
				}, error => {
					this.$message.warning(error);
					this.treeDataLoading = false;
				});
		}
	};
</script>
