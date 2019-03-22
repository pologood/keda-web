<template>
	<div class="box-padding userMgt-organization">
		<div class="user-left">
			<div class="left-tree">
				<div class="tree-title">
					组织机构信息
				</div>
				<department-tree ref="departmentTree"  @handleType="handleType" @click-depid="onClickdepId"
								 @dept-tree="treeData" @show-type="showType" @no-update-tree="noUpdateTree">
				</department-tree>
			</div>
		</div>
		<div class="user-center">
			<div class="user-title">
				<div>{{organizationOptionName}}</div>
				<div class="user-add">
					<kc-button type="text" @click.native="addDetail"><i class="icon kedaIconfont KD-tianjiaxiao icon-size"></i>
						<span>新增</span>
					</kc-button>
				</div>
			</div>
			<organization-info @update-dept-tree='updateDeptTree' @remove='remove' @handleType="handleType"
							   @role-show="changeRoleShow" :dept-tree="deptTree"
							   :show-type-num="showTypeNum" :state="dialogVisibles" :add-type="addType"
							   :depIdsChildren="depIdsChildren">
			</organization-info>
		</div>
	</div>
</template>
<script>
	import DepartmentTree from './components/DepartmentTree.vue';
	import OrganizationInfo from './components/OrganizationInfo.vue';
	import { createNamespacedHelpers } from 'vuex';
	const {mapState} = createNamespacedHelpers('userMgtStore');

	export default {
		components: {
			DepartmentTree,
			OrganizationInfo
		},
		data() {
			return {
				msgShow: true,
				showTypeNum: 0, //左侧tree 点击时更改为1
				dialogVisibles: false,
				depIdsChildren: {}, //部门选中node
				deptTree: [],
				addType: false
			};
		},
		computed: {
			...mapState({
				organizationOptionName: state => state.organization.organizationOptionName
			})
		},
		methods: {
			remove() {
				this.loading = true;
				this.$refs.departmentTree.getTreeData();
			},
			//左侧部门tree|table 点击时 更改showType = 1;
			showType(val) {
				this.showTypeNum = val;
			},
			updateDeptTree() {
				this.loading = true;
				this.$refs.departmentTree.searchClick();
				this.$refs.departmentTree.getTreeData();
			},
			//是否显示角色tree 遮罩
			changeRoleShow(val) {
				this.msgShow = val;
			},
			treeData(val) {
				this.deptTree = val;
				this.loading = false;
			},
			// 左侧树状图事件
			onClickdepId(node, data) {
				//val 点击树node.data
				this.depIdsChildren = node;
			},
			addDetail() {
				this.addType = true;
			},
			//获取是否点击新增
			handleType(val) {
				this.addType = val;
			},
			dialogVisible(val) {
				this.dialogVisibles = val;
			},
			noUpdateTree(){
				this.updateTree = false;
			}

		}
	};

</script>
