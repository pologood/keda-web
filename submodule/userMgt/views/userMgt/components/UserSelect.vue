<template>
	<kc-modal
		:title="dialogTitle"
		:visible.sync="dialogVisible"
		width="39.5rem"
		top="10vh"
		:close-on-click-modal="false"
		@open="handleOpen"
		:before-close="handleClose"
		append-to-body
		class="userMgt-userMgt-userSelect custom-dialog">
		<kc-row>
			<kc-col :span="12">
				<div class="left-header"><span>组织机构</span></div>
				<div class="tree m-scroll">
					<div class="grid-content bg-purple">
						<kc-tree :data="treeData"
								 :props="defaultProps"
								 node-key="id"
								 :default-expanded-keys="[2]"
								 :expand-on-click-node="false"
								 @node-click="handleNodeClick" width="12.5rem"
								 v-loading="treeDataLoading"
								 :indent="indent"
								 empty-text="无数据">
						</kc-tree>
					</div>
				</div>
			</kc-col>
			<kc-col :span="12">
				<kc-table
					ref="singleTable"
					:data="tableConfig.data"
					highlight-current-row
					size="mini"
					class="ez-table"
					@row-click="selectionChange">

					<kc-table-column
						property="name"
						label="姓名"
					>
					</kc-table-column>
					<kc-table-column
						property="email"
						label="邮箱">
					</kc-table-column>

				</kc-table>
				<div class="pagination-wrapper">
					<kc-pagination
						@size-change="handleSizeChange"
						@current-change="handlePageChange"
						:page-sizes="tableConfig.pageSizes"
						:page-size="tableConfig.pageSize"
						:pager-count="5"
						layout="prev, pager, next, jumper"
						:total="tableConfig.total">
					</kc-pagination>
				</div>
				<kc-button  @click="handleClose" class="kc-button" size="small">取 消</kc-button>
				<kc-button type="primary"   size="small" @click="okay" class="kc-button " >确 定</kc-button>

			</kc-col>
		</kc-row>
	</kc-modal>
</template>

<script>
	import {getTree, getAllPersonApi} from '../../../service/common.js';


	const addAlarmBtnLabel = '添加报警用户';
	const addAuditBtnLabel = '添加审核用户';
	export default {
		name: 'user-select',
		components: {},
		props: {
			dialogVisible: Boolean,
			firstLevelAudit: Boolean,
			secondLevelAudit: Boolean,
			currentValue: String
		},
		data () {
			return {
				indent: {size: 0.9, unit: 'rem'},
				dialogTitle: '警员姓名',
				addBtnLabel: addAlarmBtnLabel,
				treeData: [],

				defaultProps: {
					children: 'children',
					label: 'name'
				},
				treeDataLoading: true,
				tableConfig: {
					data: [],
					total: 0,
					currentPage: 1,
					pageSizes: [10, 20, 50, 100],
					pageSize: 10,
					currentOrg: ''
				},
				currentRow: {}, // 选中的用户
				tableSelection: [],
				result: {
					closeOnly: true,
					selection: [],
					selectedArray: []
				}
			};
		},
		methods: {
			handleNodeClick (data) {
				this.getTableData(data.id);
			},
			handleOpen () {
				this.result.selectedArray = [];
				this.tableConfig.data = [];
				this.tableConfig.currentPage = 1;
				this.tableConfig.total = 0;
				let that = this;
				getTree().then(response => {
					this.treeDataLoading = false;
					if (response) {
						that.treeData = response.result;
					} else {
						alert('error');
					}
				}, err => {
					this.treeDataLoading = false;
					this.$message.warning(err);
				});
				this.getTableData();
			},
			handleClose () {
				this.result.closeOnly = true;
				this.$emit('closeUserSelectDialog', this.result);
			},
			addUser () {
				this.result.selection = [];
				for (var i = 0; i < this.tableSelection.length; i++) {
					if (this.tableSelection[i].person && this.tableSelection[i].person.department) {
						this.tableSelection[i].orgName = this.tableSelection[i].person.department.name;
					} else {
						this.tableSelection[i].orgName = '';
					}
					this.result.selection.push(this.tableSelection[i]);
					let sel = this.tableSelection[i].name;
					if (this.result.selectedArray.indexOf(sel) < 0) {
						this.result.selectedArray.push(sel);
					}
				}
			},
			okay () {
				if (!this.currentRow.id) {
					this.$message.error('请点击要选择用户！');
					return;
				}

				this.result.closeOnly = false;
				this.$emit('closeUserSelectDialog', this.currentRow);
			},
			clear () {
				this.result.selectedArray = [];
			},
			selectionChange (selection) {
				this.currentRow = selection;
			},

			handleSizeChange (val) {
				this.tableConfig.pageSize = val;
				this.tableConfig.currentPage = 1;
				this.getTableData(this.tableConfig.currentOrg);
			},
			// 当前页数变化事件
			handlePageChange (val) {
				this.tableConfig.currentPage = val;
				this.getTableData(this.tableConfig.currentOrg);
			},

			getTableData (orgId) {
				let that = this;
				this.addBtnLabel = this.firstLevelAudit || this.secondLevelAudit ? addAuditBtnLabel : addAlarmBtnLabel;
				this.tableConfig.currentOrg = orgId;

				let params = {
					f_eq_status: 1,
					pageNo: that.tableConfig.currentPage - 1,
					pageSize: that.tableConfig.pageSize
				};
				if (orgId) {
					params['f_eq_department.id'] = orgId;
				}

				getAllPersonApi(params).then(response => {
					if(response && response.status === 200 && response.result){
						this.tableConfig.total = response.result.total;
						this.tableConfig.data = response.result.data;
					}
				});
			},

			removeItem (item) {
				this.result.selectedArray.splice(this.result.selectedArray.indexOf(item), 1);
				let removeIndex;
				for (var i = 0; i < this.result.selection.length; i++) {
					if (item === (this.result.selection[i].jyxm + '(' + this.result.selection[i].dlm + ')')) {
						removeIndex = i;
						break;
					}
				}
				this.result.selection.splice(removeIndex, 1);
			},

			getExtendValue (person, key) {
				if (person && person.extendedField) {
					let jsonStr = person.extendedField;
					if (jsonStr) {
						let json = JSON.parse(jsonStr);
						if (json && json[key] != undefined) {
							return json[key];
						}
					}
				}

				return '';
			}
		},
		mounted: function () {
			this.handleOpen();
		}
	};
</script>
