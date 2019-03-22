<template>
	<div class="box-padding userMgt-administrativeArea">
		<div class="area-left">
			<area-tree ref="areaTree"  @isAddRootNode="isAddRootNode"></area-tree>
		</div>
		<div class="area-right">
			<area-info ref="areaInfo" @updateAreaTree="updateAreaTree"></area-info>
		</div>
	</div>
</template>
<script>
	import AreaTree from './components/AreaTree';
	import AreaInfo from './components/AreaInfo';

	export default {
		components: {
			AreaTree,
			AreaInfo
		},
		methods: {
			updateAreaTree(val) {
				if(val){
					this.$refs.areaInfo.detailReset();
					this.$refs.areaTree.arinfoQuery();
				}else{
					this.$refs.areaTree.arinfoQuery();
				}
			},
			isAddRootNode(){
				this.$refs.areaInfo.detailReset();
			}
		}
	};
</script>
