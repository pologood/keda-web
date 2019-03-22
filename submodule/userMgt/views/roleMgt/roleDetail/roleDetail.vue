<template>
	<div class="kiaf-userMgt-roleMan-roleDetail">
		<div class="role-detail-wrapper">
			<div class="header">
				<h2 class="title">角色详情</h2>
				<p @click="createRole">
					<i class="icon kedaIconfont KD-tianjiada keda-icon-style"></i>
					<span>新增</span>
				</p>
			</div>
			<div class="form-body">
				<kc-form label-position="right" :inline="true" label-width="4rem" :model="roleDetailInfo" ref="roleDetailInfo" :rules="rules" class="form-inline">
						<kc-form-item label="角色编号" class="item">
							<kc-input v-model="roleDetailInfo.id" :disabled="true"></kc-input>
						</kc-form-item>
						<kc-form-item label="创建人员" class="item">
							<kc-input v-model="roleDetailInfo.creatorName" :disabled="true"></kc-input>
						</kc-form-item>
						<kc-form-item label="更新人员" class="item">
							<kc-input v-model="roleDetailInfo.updaterName" :disabled="true"></kc-input>
						</kc-form-item>

						<kc-form-item label="角色名称" class="item"  prop="name">
							<kc-input v-model="roleDetailInfo.name" :disabled="!isAdd && !isEdit"></kc-input>
						</kc-form-item>
						<kc-form-item label="创建时间" class="item time">
							<kc-date-picker v-model="roleDetailInfo.createTime" type="datetime" :disabled="true"></kc-date-picker>
						</kc-form-item>
						<kc-form-item label="更新时间" class="item time">
							<kc-date-picker type="datetime" :disabled="true" v-model="roleDetailInfo.updateTime"></kc-date-picker>
						</kc-form-item>

						<kc-form-item label="角色描述" class="area">
							<kc-input type="textarea" resize='none' v-model="roleDetailInfo.description" :disabled="!isAdd && !isEdit"></kc-input>
						</kc-form-item>
				</kc-form>
			</div>
		</div>
		<div class="btn-wrapper">
			<div class="btn-group">
				<kc-button class="btn-origin button--primary" @click="save" :disabled="!isAdd && !isEdit">确定</kc-button>
				<kc-button class="btn-origin button--default" @click="cancel" :disabled="!isAdd && !isEdit">取消</kc-button>
			</div>
		</div>
		<div v-if="!isAdd" class="role-resource-wrapper">
			<div class="header">
				<h2 class="title">角色资源授权</h2>
			</div>
			<div class="content">
				<role-auth :roleId="currentRoleId" :disableRoleAuth="disableRoleAuth" v-if="currentRoleId"></role-auth>
			</div>
		</div>

	</div>
</template>

<script>
	import roleAuth from '../../../components/RoleAuth';
	import Global from 'utils/global';
	import { addRoleApi, changeRoleApi } from '../../../service/roleMgt.js';
	import { createNamespacedHelpers } from 'vuex';
	const { mapState, mapMutations, mapActions } = createNamespacedHelpers('userMgtStore');
	export default {
		data () {
			return {
				rules: {
					name: [
						{
							required: true,
							message: '角色名称不能为空',
							trigger: 'blur'
						}
					]
				}
			};
		},
		computed: {
			...mapState({
				currentRow: state => state.roleMan.currentRow,
				roleDetailInfo: state => state.roleMan.roleDetailInfo,
				pageNo: state => state.roleMan.pageNo,
				pageSize: state => state.roleMan.pageSize,
				currentRoleId: state => state.roleMan.currentRoleId,
				isEdit: state => state.roleMan.isEdit,
				isAdd: state => state.roleMan.isAdd,
				disableRoleAuth: state => state.roleMan.disableRoleAuth
			})
		},
		created () { },
		mounted () { },
		methods: {
			...mapMutations([
				'USERMGT_SHOW_ACTIVE',
				'USERMGT_RECOVER_ROLE_DETAIL_INFO',
				'USERMGT_UPDATE_PAGE',	// 更新页码
				'USERMGT_UPDATE_ISEDIT',
				'USERMGT_CLEAR_ROLE_DETAIL_INFO',
				'USERMGT_UPDATE_ISADD',
				'USERMGT_UPDATE_DISABLE_ROLEAUTH'
			]),
			...mapActions({
				userMgtQueryRole: 'userMgtQueryRole'
			}),
			// 创建角角色
			createRole () {
				this.USERMGT_CLEAR_ROLE_DETAIL_INFO();
				this.USERMGT_UPDATE_ISADD(true);
				this.USERMGT_UPDATE_DISABLE_ROLEAUTH(true);
			},
			// 确定
			save: function () {
				if (this.isAdd) {
					// 新增
					this.$refs.roleDetailInfo.validate(valid => {
						if (valid) {
							this.USERMGT_UPDATE_ISEDIT(false);
							this.USERMGT_UPDATE_ISADD(false);
							this.USERMGT_UPDATE_DISABLE_ROLEAUTH(false);
							let params = {
								description: this.roleDetailInfo.description,
								name: this.roleDetailInfo.name,
								status: 1,
								users: [],
								departments: [],
								sign: +new Date(), //
								clientSign: Global.getClientSign()
							};
							addRoleApi(params).then(res => {
								this.$emit('clearRoleInfo');
								if (res.status === 200) {
									this.USERMGT_SHOW_ACTIVE(res.result);
									this.$message({
										message: '新增角色成功',
										type: 'success',
										duration: 1000
									});
								}
								this.USERMGT_UPDATE_PAGE(0);
								let params = {
									pageNo: 0,
									pageSize: this.pageSize,
									f_eq_status: 1
								};
								this.userMgtQueryRole(params);
							});
						}
					});
				} else if (this.isEdit) {
					// 修改
					this.$refs.roleDetailInfo.validate(valid => {
						if (valid) {
							this.USERMGT_UPDATE_ISEDIT(false);
							this.USERMGT_UPDATE_ISADD(false);
							this.USERMGT_UPDATE_DISABLE_ROLEAUTH(false);
							let params = {
								id: this.currentRoleId,
								info: {
									description: this.roleDetailInfo.description,
									name: this.roleDetailInfo.name,
									status: 1,
									clientSign: Global.getClientSign(),
									sign: this.roleDetailInfo.sign
								}
							};
							// return;
							changeRoleApi(params).then(res => {
								this.USERMGT_UPDATE_PAGE(0);
								let params = {
									pageNo: 0,
									pageSize: this.pageSize,
									f_eq_status: 1
								};
								this.userMgtQueryRole(params);
								if (res.status === 200) {
									this.USERMGT_SHOW_ACTIVE(this.currentRoleId);
									this.$message({
										message: '编辑角色成功',
										type: 'success',
										duration: 1000
									});
								}
							});
						}
					});
				}
			},
			// 取消
			cancel () {
				this.$refs.roleDetailInfo.resetFields();
				this.USERMGT_RECOVER_ROLE_DETAIL_INFO();
				this.USERMGT_UPDATE_ISEDIT(false);
				this.USERMGT_UPDATE_ISADD(false);
				this.USERMGT_UPDATE_DISABLE_ROLEAUTH(false);
			}
		},
		components: {
			roleAuth
		}
	};
</script>

