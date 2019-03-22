<template>
	<kc-tree :data="treedata" :keymap="keymap" :styles="styles" @on-select-change="handleChange"></kc-tree>
</template>

<script>
	import {loadArea} from '../../../service/groupMgt.js';
	import {mapState} from 'vuex';

	export default {
		components: {
		},
		data() {
			return {
				treedata: [],
				styles: {
					icon: {
						color: '#FFA70B',
						leftIonIconName: 'downarrow',
						folder: 'wenjianjia'
					}
				},
				keymap: {
					title: 'name'
				}
			};
		},
		created() {

		},
		computed: {
			...mapState({
				searchvuexText: state => state.groupManagement.searchvuexText
			})
		},
		methods: {
			handleChange(root, node) {
				let nodeName = node.name;
				this.$emit('changePoliceCategory', nodeName);
				this.policeComfirm(nodeName);
				// console.log('树节点name', nodeName);
			}
		},
		mounted() {
			loadArea()
				.then(response => {
					this.treedata = response.result;
				});
		}
	};
</script>
