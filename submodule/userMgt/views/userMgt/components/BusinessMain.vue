<template>
	<kc-tree :data="treeData"
			 v-loading="treeDataLoading"
			 :props="defaultProps"
			 @node-click="handleChange">

	</kc-tree>
</template>

<script>
	import {menuApi} from '../../../service/menu';

	export default {
		props: ['userId'],
		data() {
			return {
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				treeDataLoading: true
			};
		},
		methods: {
			handleChange(root) {
				this.$emit('changeBusiness', root);
			}
		},
		mounted() {
			menuApi().then(result => {
				this.treeDataLoading = false;
				this.treeData = result;
			}, err => {
				this.treeDataLoading = false;
				this.$message.warning(err);
			});
		}
	};
</script>
