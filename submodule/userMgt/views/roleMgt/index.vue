<template>
	<div class="box-padding userMgt-roleManagement">
		<div class="roleMan-left">
			<roleinfo-management ref="roleInfoManagement"></roleinfo-management>
		</div>
		<div class="roleMan-right">
			<role-detail @clearRoleInfo="clearRoleInfo"></role-detail>
		</div>
	</div>
</template>

<script>
	import roleinfoManagement from './roleInfoManagement/index';
	import roleDetail from './roleDetail/roleDetail';

	export default {
		data () {
			return {
			};
		},
		methods: {
			clearRoleInfo () {
				this.$refs.roleInfoManagement.clearRoleInfo();
			}
		},
		components: {
			roleinfoManagement,
			roleDetail
		}
	};

</script>
