<template>
	<div class="userMgt-administrativeArea-areaDetail">
		<div class="detail-header">
			<h3 class="title">{{optionName}}</h3>
			<div class="newAdd" @click="detailAdd">
				<kc-tooltip class="item" effect="light" content="新增子根节点" placement="right">
					<i class="icon kedaIconfont KD-tianjiaxiao"></i>
					<span>新增</span>
				</kc-tooltip>
			</div>
		</div>
		<div class="detail-content">
			<kc-form
				ref="detailForm"
				:model="detailResult"
				:rules="rules"
				label-width="6rem"
				class="detail-form">
				<kc-form-item label="行政区域编码" prop="code" class="detail-item">
					<kc-input v-model="detailResult.code" :disabled="codeEdit"></kc-input>
				</kc-form-item>
				<kc-form-item label="行政区域名称" prop="name" class="detail-item">
					<kc-input v-model="detailResult.name" :disabled="isEdit"></kc-input>
				</kc-form-item>
				<kc-form-item label="行政区域简称" prop="simple" class="detail-item">
					<kc-input v-model="detailResult.simple" :disabled="isEdit"></kc-input>
				</kc-form-item>
				<kc-form-item label="区域治安机关" prop="organ" class="detail-item">
					<kc-input v-model="detailResult.organ" :disabled="isEdit"></kc-input>
				</kc-form-item>
				<kc-form-item label="范围XMIN" prop="xMin" class="detail-item">
					<kc-input v-model="detailResult.xMin" :disabled="isEdit"></kc-input>
				</kc-form-item>

				<kc-form-item label="范围YMIN" prop="yMin" class="detail-item">
					<kc-input v-model="detailResult.yMin" :disabled="isEdit"></kc-input>
				</kc-form-item>

				<kc-form-item label="范围XMAX" prop="xMax" class="detail-item">
					<kc-input v-model="detailResult.xMax" :disabled="isEdit"></kc-input>
				</kc-form-item>

				<kc-form-item label="范围YMAX" prop="yMax" class="detail-item">
					<kc-input v-model="detailResult.yMax" :disabled="isEdit"></kc-input>
				</kc-form-item>
			</kc-form>
			<div class="detail-btn-group" v-show="btnGroupShow">
				<kc-button class="btn-origin btn-redact" @click="detailEdit" :disabled="!currentNodeId">编辑</kc-button>
				<kc-button class="btn-origin btn-delete" @click="detailDelete" :disabled="!currentNodeId">删除</kc-button>
			</div>
			<div class="detail-btn-group" v-show="!btnGroupShow">
				<kc-button class="btn-origin btn-redact" @click="detailSave('detailForm')">保存</kc-button>
				<kc-button class="btn-origin button--default" @click="detailCancel">取消</kc-button>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		addNode,
		isAreaCodeUnique,
		deleteNode,
		loadArea,
		editNode
	} from '../../../service/administrativeArea.js';
	import { createNamespacedHelpers } from 'vuex';
	const {mapState, mapMutations, mapActions} = createNamespacedHelpers('userMgtStore');
	export default {
		data() {
			return {
				btnGroupShow: true,
				isEdit: true,
				codeEdit: true,
				operationType: null,
				detailResultCacle: '',
				rules: {
					code: [
						{
							required: true,
							message: '请输入行政区域编码'
						}
					],
					name: [
						{
							required: true,
							message: '请输入行政区域名称'
						}
					],
					organ: [
						{
							required: true,
							message: '请输入区域治安机关'
						}
					]
				}
			};
		},
		mounted() {
			if(this.isAddRootNode == true){
				this.detailReset();
			}
		},
		created(){
			if(this.isAddRootNode == true){
				this.detailReset();
			}
		},
		watch: {
			currentNodeId: {
				handler(vals, oldVal) {
					if (vals === oldVal) {
						return false;
					} else if(vals == ''){
						this.$refs['detailForm'].resetFields();
					}else{
						this.codeEdit = true;
						this.isEdit = true;
						this.btnGroupShow = true;
					}
				}
			}
		},
		computed: {
			...mapState({
				treeData: state => state.administrativeArea.treeData,
				detailResult: state => state.administrativeArea.detailResult,
				currentNodeId: state => state.administrativeArea.currentNodeId,
				currentNode: state => state.administrativeArea.currentNode,
				isAddRootNode: state => state.administrativeArea.isAddRootNode,
				optionName: state => state.administrativeArea.optionName
			})
		},
		methods: {
			...mapActions({
				userMgtRowData: 'userMgtRowData',
				userMgtTreeList: 'userMgtTreeList'
			}),
			...mapMutations({
				IS_ADD_ROOT_NODE: 'IS_ADD_ROOT_NODE',
				UPDATE_OPTION_NAME: 'UPDATE_OPTION_NAME',
				USERMGT_RESET: 'USERMGT_RESET',
				USERMGT_TREE_LIST: 'USERMGT_TREE_LIST',
				USERMGT_SELECT_NODE: 'USERMGT_SELECT_NODE',
				SET_USERMGT_RECOVER: 'SET_USERMGT_RECOVER'
			}),
			// 新增
			detailAdd() {
				if(!this.currentNodeId){
					this.$message({
						message: '请选择行政区域',
						type: 'warning'
					});
					return;
				}
				this.IS_ADD_ROOT_NODE(false);
				this.UPDATE_OPTION_NAME('新增行政区');
				this.detailReset();
			},
			// 编辑
			detailEdit() {
				if (this.currentNodeId) {
					this.detailResultCacle = JSON.parse(JSON.stringify(this.detailResult));
					this.isEdit = false;
					this.btnGroupShow = false;
					this.operationType = 'edit';
					this.UPDATE_OPTION_NAME('编辑行政区');
				}
			},
			// 删除
			detailDelete() {
				this.btnGroupShow = true;
				this.isEdit = true;
				this.codeEdit = true;
				this.operationType = null;
				if(this.currentNode.children.length > 0){
					this.$message.warning('请先删除子行政区！');
					return;
				}
				if (this.currentNodeId) {
					this.$confirm('是否删除该行政区？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let params = {
							id: this.currentNodeId,
							command: 'STOP'
						};
						deleteNode(params).then(res => {
							if (res.status === 200) {
								this.$emit('updateAreaTree', true);
								this.UPDATE_OPTION_NAME('编辑行政区');
								this.USERMGT_RESET();
								loadArea({f_eq_status: 1}).then(list => {
									this.USERMGT_TREE_LIST(list.result);
								});
								this.USERMGT_SELECT_NODE();
								this.$message.success('删除成功！');
								this.codeEdit = true;
								this.isEdit = true;
								this.btnGroupShow = true;
							}
						});
					}).catch(() => {
						this.$message('已取消删除！');
					});
				}
			},
			// 取消
			detailCancel() {
				this.UPDATE_OPTION_NAME('行政区域详情');
				this.codeEdit = true;
				this.isEdit = true;
				this.btnGroupShow = true;
				this.operationType = null;
				this.$refs['detailForm'].resetFields();
				this.SET_USERMGT_RECOVER(this.detailResultCacle);
			},
			// 保存
			detailSave() {
				this.$refs['detailForm'].validate(valid => {
					if (valid) {
						// 新增
						if (this.operationType === 'add') {
							let currentId;
							if(this.isAddRootNode){
								currentId = '';
							}else{
								currentId = this.currentNodeId;
							}
							let params = {
								parentId: currentId,
								code: this.detailResult.code,
								name: this.detailResult.name,
								organ: this.detailResult.organ,
								xMax: +this.detailResult.xMax,
								xMin: +this.detailResult.xMin,
								yMax: +this.detailResult.yMax,
								yMin: +this.detailResult.yMin,
								extendedField: {
									simple: this.detailResult.simple
								}
							};
							let pram = {
								value: params.code
							};
							// 行政区域编码唯一性验证
							isAreaCodeUnique(pram).then(response => {
								if (response.result === true) {
									addNode(params).then(res => {
										if (res.status === 200) {
											loadArea({f_eq_status: 1}).then(list => {
												this.USERMGT_TREE_LIST(list.result);
											});
											this.USERMGT_SELECT_NODE();
											this.$message({
												message: '新增行政区域成功!',
												type: 'success',
												duration: 1000
											});
											this.codeEdit = true;
											this.isEdit = true;
											this.btnGroupShow = true;
										}else{
											this.$message({
												message: '新增行政区域失敗',
												type: 'warning',
												duration: 1000
											});
										}
									});
								}else{
									this.$message({
										message: '行政区域编码已存在',
										type: 'warning',
										duration: 1000
									});
									this.detailReset();
								}
							});
							// 编辑
						} else if (this.operationType === 'edit') {
							let params = {
								code: this.detailResult.code,
								id: this.detailResult.id,
								name: this.detailResult.name,
								organ: this.detailResult.organ,
								xMax: +this.detailResult.xMax,
								xMin: +this.detailResult.xMin,
								yMax: +this.detailResult.yMax,
								yMin: +this.detailResult.yMin,
								extendedField: {
									simple: this.detailResult.simple
								},
								status: '1'
							};
							editNode(params).then(res => {
								if(res.status === 200){
									this.$message({
										message: '修改行政区域成功!',
										type: 'success',
										duration: 1000
									});
									this.USERMGT_SELECT_NODE();
									this.$emit('updateAreaTree', false);
									loadArea({f_eq_status: 1}).then(list => {
										this.USERMGT_TREE_LIST(list.result);
									});
									this.codeEdit = true;
									this.isEdit = true;
									this.btnGroupShow = true;
								}else{
									this.$message.error('修改失败！');
								}
							});
						}
					}else {
						return false;
					}
				});
			},
			//重置
			detailReset() {
				this.detailResultCacle = JSON.parse(JSON.stringify(this.detailResult));
				this.USERMGT_RESET();
				this.$refs['detailForm'].resetFields();
				this.codeEdit = false;
				this.isEdit = false;
				this.btnGroupShow = false;
				this.operationType = 'add';
			}

		}
	};
</script>
