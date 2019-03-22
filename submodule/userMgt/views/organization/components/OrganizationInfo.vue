<template>
	<div class="userMgt-organization-detailOfOrganization">
		<kc-form :model="form" :rules="rules" :inline="true" ref="form" label-width="4rem" label-position="right"
				 class="form" :disabled='watchOnly'>
			<kc-form-item label="单位编号" prop="num" class="allInputs">
				<kc-input v-model="form.num" :disabled="isEdit"></kc-input>
			</kc-form-item>
			<kc-form-item label="单位名称" prop="name" class="allInputs">
				<kc-input v-model="form.name"></kc-input>
			</kc-form-item>
			<kc-form-item label="单位简称" prop="abbreviation" class="allInputs">
				<kc-input v-model="form.abbreviation"></kc-input>
			</kc-form-item>
			<kc-form-item label="单位级别" prop="grade" class="allInputs">
				<kc-select v-model="form.grade" placeholder="请选择单位级别">
					<kc-option label="公安部" value="公安部"></kc-option>
					<kc-option label="省厅" value="省厅"></kc-option>
					<kc-option label="市局" value="市局"></kc-option>
					<kc-option label="分局" value="分局"></kc-option>
					<kc-option label="派出所" value="派出所"></kc-option>
				</kc-select>
			</kc-form-item>
			<kc-form-item label="单位类型" prop="type" class="allInputs">
				<kc-select v-model="form.type" placeholder="请选择单位类型">
					<kc-option label="行政单位" value="行政单位"></kc-option>
					<kc-option label="普通单位" value="普通单位"></kc-option>
				</kc-select>
			</kc-form-item>
			<kc-form-item label="所属辖区" prop="jurisdiction" @click.native="watchOnly?memberAreaDialog=false:memberAreaDialog=true"
						  class="allInputs">
				<kc-input v-model="form.jurisdiction"></kc-input>
			</kc-form-item>
			<kc-form-item label="联系人员" prop="contacts" class="allInputs">
				<kc-input v-model="form.contacts"></kc-input>
			</kc-form-item>
			<kc-form-item label="联系电话"  prop="tel" class="allInputs">
				<kc-input v-model="form.tel"></kc-input>
			</kc-form-item>
			<kc-form-item label="单位地址"  prop="address" class="allInputs">
				<kc-input v-model="form.address"></kc-input>
			</kc-form-item>
			<kc-form-item label="单位描述" prop="describe" class="text-area">
				<kc-input type="textarea" v-model="form.describe" resize="none" :rows="2" :disabled="watchOnly"></kc-input>
			</kc-form-item>
		</kc-form>
		<div class="bottom-anniu">
			<template v-if="newThings" >
				<div class="btn-group">
					<kc-button class="btn-origin  button--primary" @click="onSave('form')">保存</kc-button>
					<kc-button class="btn-origin  kc-button button--default" @click='comeBack()'>返回</kc-button>
				</div>
			</template>
			<template v-else>
				<div class="btn-group">
					<kc-button class="btn-origin  button--primary" @click='edit()' :disabled="!isDeptSelected">编辑</kc-button>
					<kc-button class="btn-origin btn-delete" @click='deletesBefore()' :disabled="!isDeptSelected">删除</kc-button>
				</div>
			</template>
		</div>
		<kc-modal title="所属辖区" :visible.sync="memberAreaDialog" width="35%">
			<div>
				<div class="modal-input-group">
					<kc-input placeholder="请输入内容" v-model="searchText" @keyup.enter.native="queryArea"
							  class="input-with-select">
						<i slot="suffix" class="icon kedaIconfont KD-sousuo search-size keda-icon-heavy-style"
						   @click="queryArea"></i>
					</kc-input>
					<kc-button slot="append" class="user-serach-button keda-icon-heavy-style"
							   @click="reset()"
							   size="small">
						<kc-tooltip class="item" effect="light" content="复位" placement="right">
							<i class="icon kedaIconfont KD-fuwei"></i>
						</kc-tooltip>
					</kc-button>

				</div>
				<div class="area-content" v-show="treeShow">
					<area-tree v-show="treeShow" @change-area="changeArea"></area-tree>
				</div>
				<div v-show="tableShow" class="area-table">
					<kc-table @row-click="changeText" :data="searchTable" border style="width: 100%;cursor:pointer;">
						<kc-table-column label="单位编号" width="180">
							<template slot-scope="scope">{{ scope.row.code }}</template>
						</kc-table-column>
						<kc-table-column label="单位名称">
							<template slot-scope="scope">{{ scope.row.name }}</template>
						</kc-table-column>
					</kc-table>
					<div class="pagination">
						<kc-pagination @current-change="dialogCurrentChange" :current-page=this.pageNodialog
									   :page-size=this.pageSizedialog :total=this.totalDialog>
						</kc-pagination>
					</div>
				</div>

			</div>
			<span slot="footer" class="dialog-footer">
			<kc-button @click="memberAreaDialog = false" size="small" plain>取 消</kc-button>
			<kc-button type="primary" @click="confirm" size="small" plain>确 定</kc-button>
      		</span>
		</kc-modal>
		<kc-modal title="提示" :visible.sync="showWarning" width="30%">
			<span>请选择组织机构</span>
			<span slot="footer" class="dialog-footer">
        		<kc-button type="primary" @click="showWarning = false">确 定</kc-button>
     		 </span>
		</kc-modal>
	</div>
</template>
<script>
	import {
		queryArea
	} from '../../../service/groupMgt.js';
	import {
		addDepartmentApi,
		changeDepartmentApi,
		deleteDepartmentApi
	} from '../../../service/organization.js';

	import AreaTree from './AreaTree';
	import Global from 'utils/global';
	import { createNamespacedHelpers } from 'vuex';
	const {mapMutations} = createNamespacedHelpers('userMgtStore');

	export default {
		components: {
			AreaTree
		},
		props: {
			depIdsChildren: Object,
			deptTree: Array,
			showTypeNum: Number, // 1为左侧tree点击状态 0 是未点击
			addType: Boolean//是否点击新增按钮
		},
		data() {
			return {
				msgShow: false,
				isEdit: false, // 改变添加修改状态 1修改 0添加
				showTypeNumNow: 0,
				showWarning: false,
				status: 0,
				isDeptSelected: false,
				districtId: '',
				currentId: '',
				currentNode: {},
				type: 0,
				froms: {},
				watchOnly: true,
				newThings: false,
				searchText: '',
				deptparentId: '',
				searchTable: [],
				tableShow: false,
				treeShow: true,
				pageNodialog: 0,
				pageSizedialog: 10,
				totalDialog: 0,
				keymap: {
					title: 'name'
				},
				memberAreaDialog: false,
				form: {
					num: '', // 单位编号
					name: '', // 单位名称
					abbreviation: '', // 单位简称
					grade: '', // 单位级别
					type: '', // 单位类型
					jurisdiction: '', // 所属辖区
					contacts: '', // 联系人员
					tel: '', // 联系电话
					address: '', // 单位地址
					describe: '' // 单位描述
				},
				rules: {
					name: [{required: true, message: '请输入单位名称'}],
					num: [{required: true, message: '请输入单位编号'}],
					abbreviation: [
						{required: true, message: '请输入单位简称'}
					],
					grade: [
						{required: false, message: '请选择单位级别'}
					],
					type: [{required: false, message: '请选择单位类型'}],
					jurisdiction: [
						{required: false, message: '请选择所属辖区'}
					]
				}
			};
		},
		watch: {
			depIdsChildren: {
				handler(vals, oldVal) {
					if (vals === oldVal) {
						return;
					}
					this.showTypeNumNow = this.showTypeNum;
					if (this.showTypeNumNow != 1) {
					} else {
						if(vals){
							this.isDeptSelected = true;
							if(vals.data){
								this.deptparentId = vals.data.parentId;
							}
						}
						this.currentNode = vals.data || vals;
						let val = vals.data || vals;
						this.currentId = val.id;
						this.form.num = val.code;
						this.form.type = val.type; // 单位类型
						this.form.grade = val.grade; //单位级别
						this.form.jurisdiction = val.district; // 所属辖区
						this.form.name = val.name; //单位全称
						if(val.extendedField){
							let extendedField = JSON.parse(val.extendedField);
							this.form.contacts = extendedField.contacts; // 联系人员
							this.form.tel = extendedField.tel; // 联系电话
							this.form.address = extendedField.address; // 单位地址
							this.form.abbreviation = extendedField.fullName; //单位全称
						} else {
							this.form.jurisdiction = ''; // 所属辖区
							this.form.contacts = ''; // 联系人员
							this.form.tel = ''; // 联系电话
							this.form.address = ''; // 单位地址
							this.form.grade = ''; // 单位级别
						}
						this.form.describe = val.description; // 单位描述
						this.newThings = false;
						this.watchOnly = true;
					}
				},
				deep: true
			},
			addType(newV, oldV) {
				if(!newV){
					return;
				}
				if (this.isDeptSelected) {
					this.onSubmit();
					this.UPDATE_ORGANIZATION_OPTION_NAME('新增组织机构');
				}else {
					this.$emit('handleType', false);
					this.$message({
						message: '请选择组织机构',
						type: 'warning'
					});
				}
			},
			showTypeNum(newV, oldV) {
				if(newV === 0) {
					this.clearForm();
				}
			}
		},
		methods: {
			...mapMutations({
				UPDATE_ORGANIZATION_OPTION_NAME: 'UPDATE_ORGANIZATION_OPTION_NAME'
			}),
			changeArea(val) {
				this.searchText = val.name;
				this.districtId = val.id;
			},
			// 确定按钮
			confirm() {
				this.form.jurisdiction = this.searchText;
				this.memberAreaDialog = false;
			},
			// 查询所属辖区 模糊查询
			dialogCurrentChange(val) {
				let param = {
					queryStr: this.searchText,
					pageNo: val - 1,
					pageSize: this.pageSizedialog
				};
				queryArea(param).then(response => {
					this.searchTable = response.result.data;
					this.totalDialog = response.result.total;
				});
			},
			queryArea() {
				// 模态框所属辖区 搜索按钮
				if (this.searchText === '') {
					this.treeShow = true;
					this.tableShow = false;
				} else {
					this.treeShow = false;
					this.tableShow = true;
					let param = {
						queryStr: this.searchText,
						pageNo: this.pageNodialog,
						pageSize: this.pageSizedialog
					};
					queryArea(param).then(response => {
						this.searchTable = response.result.data;
						this.totalDialog = response.result.total;
					});
				}
			},
			//显示tree隐藏Table
			reset() {
				this.treeShow = true;
				this.tableShow = false;
				this.searchText = '';
			},
			onSubmit() {
				this.msgShow = true;
				this.isEdit = false;
				this.watchOnly = false;
				this.newThings = true;
				this.froms = JSON.parse(JSON.stringify(this.form));
				this.$refs['form'].resetFields();
			},
			clearForm() {
				this.watchOnly = true;
				this.newThings = false;
				this.froms = this.form;
				this.$refs['form'].resetFields();
			},
			//保存
			onSave(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						// 新增
						if (this.isEdit == false) {
							let params = {
								clientSign: Global.getClientSign(),
								code: this.form.num, // 部门编号
								district: this.form.jurisdiction, // 行政区域
								parentId: this.currentId, // 单位id
								name: this.form.name, // 单位名称
								status: 1,
								sortIndex: '',
								description: this.form.describe, // 单位描述
								type: this.form.type,
								grade: this.form.grade,
								extendedField: {
									contacts: this.form.contacts,
									tel: this.form.tel,
									address: this.form.address,
									fullName: this.form.name
								}
							};
							this.form.parentId = this.currentId;
							addDepartmentApi(params).then(res => {
								if (res.status === 200) {
									this.$message.success('保存成功');
									params.expand = true;
									params.children = [];
									this.$emit('update-dept-tree', false);
									this.$emit('handleType', false);
									const children = this.depIdsChildren.children || [];
									params.children = [];
									children.push(params);
									this.$set(this.depIdsChildren, 'children', children);
									this.watchOnly = true;
									this.newThings = false;
									this.currentId = res.result;
								}
							}, err => {
								this.$alert(err, '提示', {
									confirmButtonText: '确定',
									type: 'warning'
								});
							});
						} else { //修改
							let params = {
								id: this.currentId,
								clientSign: Global.getClientSign(),
								code: this.form.num, // 部门编号
								district: this.form.jurisdiction, // 行政区域
								parentId: this.deptparentId, // 单位id
								name: this.form.name, // 单位名称
								status: 1,
								sortIndex: '',
								description: this.form.describe, // 单位描述
								type: this.form.type,
								grade: this.form.grade,
								extendedField: {
									contacts: this.form.contacts,
									tel: this.form.tel,
									address: this.form.address,
									fullName: this.form.name
								}
							};
							changeDepartmentApi(params).then(res => {
								if (res.status === 200) {
									this.$message.success('修改成功');
									this.$emit('update-dept-tree', false);
									this.$emit('handleType', false);
									this.watchOnly = true;
									this.newThings = false;
								}
							}).catch(err => {
								this.$message.error(err);
							});
						}
					} else {
						return false;
					}
				});
			},
			//返回
			comeBack() {
				this.UPDATE_ORGANIZATION_OPTION_NAME('组织机构详情');
				this.msgShow = true;
				this.isEdit = false;
				this.watchOnly = false;
				this.newThings = true;
				this.newThings = false;
				this.watchOnly = true;
				this.form = this.froms;
				this.$emit('handleType', false);
				// 请求下后端
			},
			//编辑
			edit() {
				if (!this.isDeptSelected) {
					this.$message({
						message: '请选择组织机构',
						type: 'warning'
					});
				} else {
					this.isEdit = true; //编辑状态
					this.froms = JSON.parse(JSON.stringify(this.form));
					this.status = 2;
					this.watchOnly = false;
					this.newThings = true;
					this.UPDATE_ORGANIZATION_OPTION_NAME('编辑组织机构');
				}
				this.$emit('handleType', false);
			},
			deletesBefore() {
				if(this.currentNode.children.length > 0){
					this.$message.warning('请先删除该组织机构下面的组织机构！');
					return;
				}
				if (this.currentId) {
					this.$confirm('您确定要删除吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let params = {
							id: this.currentId,
							command: 'STOP'
						};
						deleteDepartmentApi(params).then(res => {
							if (res.status == 200) {
								this.$message.success('删除成功');
								this.$emit('update-dept-tree');
								this.clearForm();
								this.showTypeNumNow = 2;
							}
						});
					}).catch(() => {
						this.$message('已取消删除');
					});
				}
			},
			getKey() {
				if (event.keyCode == 13) {
					this.treeShow = false;
					this.tableShow = true;
					let param = {
						queryStr: this.searchText
					};
					queryArea(param).then(response => {
						this.searchTable = response.result.data;
					});
				}
			},
			// 点击选中的查询出来的table当前行
			changeText(row) {
				this.searchText = row.name;
				this.districtId = row.id;
			}
		}
	};
</script>
