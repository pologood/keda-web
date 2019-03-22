<template>
	<kc-tree :data="treeData"
			 :props="defaultProps"
			 v-loading="treeDataLoading"
			 :indent="indent"
			 @node-click="handleChange">
	</kc-tree>
</template>

<script>
	import {loadArea} from '../../../service/groupMgt.js';

	export default {
		data() {
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
			handleLoadMore(node) {
				this.treeData[0].children[1].children.splice(
					this.treeData[0].children[1].children.length - 1,
					1
				);
				for (let i = 0; i < 20; i++) {
					this.treeData[0].children[1].children.push({title: 'new item' + i});
				}
				this.treeData[0].children[1].children.push({
					loadMore: true,
					title: 'load more'
				});
			},
			//节点被点击时的回调	共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
			handleChange(obj, node, com) {
				this.$emit('change-area', obj);
			}
		},
		mounted() {
			loadArea().then(response => {
				this.treeDataLoading = false;
				this.treeData = response.result;
			}).catch(err => {
				this.treeDataLoading = false;
				this.$message.warning(err);
			});
		}
	};
</script>
