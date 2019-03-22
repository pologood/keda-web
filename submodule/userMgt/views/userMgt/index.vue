<template>
	<div class="box-padding userMgt-userList">
			<div class="user-left">
				<div class="left-tree">
					<div class="tree-title">
						组织机构信息
					</div>
					<user-tree @depId="depId" @treeDatas="treeDatas"></user-tree>
				</div>
			</div>
			<div class="user-center">
				<div class="user-title">
					用户信息管理
				</div>
				<user-info :department="department" @chosedRole="chosedRole" :depData="depData"
						   @defaultRole="defaultRole"></user-info>
			</div>
			<div class="user-right">
				<div class="role-title">
					用户角色管理
				</div>
				<user-role :chosedRoleInfo="chosedRoleInfo" :defaultAllRoles="defaultAllRoles"></user-role>
			</div>
		</div>
</template>
<script>
	import UserTree from './components/UserTree.vue';
	import UserInfo from './components/UserInfo.vue';
	import UserRole from './components/UserRole.vue';

	export default {
		components: {
			UserTree,
			UserInfo,
			UserRole
		},
		data () {
			return {
				department: '',
				chosedRoleInfo: {},
				depData: [],
				defaultAllRoles: []
			};
		},
		created () {

		},
		mounted () {

		},
		methods: {
			depId (val) {
				this.department = val;
			},
			defaultRole (val) {
				this.defaultAllRoles = val;
			},
			treeDatas (val) {
				this.depData = val;
			},
			chosedRole (val) {
				this.chosedRoleInfo = val;
			}
		}
	};

</script>
