<template>
	<div class="userMgt-organization-userTree">
		<div class="header">
			<div class="search-content">
				<div class="search-group">
					<kc-input
						placeholder="请输入关键字搜索"
						v-model="searchContent"
						class="user-serach-input"
						@keydown.enter.native="keyupSubmit">
						<i slot="suffix" @click="comeBack()" class="icon kedaIconfont KD-yijianshanchu keda-icon-style" v-if="searchContent.length>0"></i>
						<i slot="suffix" @click="keyupSubmit()" class="icon kedaIconfont search-size keda-icon-heavy-style">&#xe638;</i>
					</kc-input>
					<kc-tooltip class="item" effect="light" content="复位" placement="right">
						<kc-button class="user-serach-button keda-icon-heavy-style"
								   @click="comeBack()"
								   size="small">
							<i class="icon kedaIconfont KD-fuwei"></i>
						</kc-button>
					</kc-tooltip>
				</div>
			</div>
		</div>
		<div class="tree-wrapper" v-if="showTree">
			<kc-tree :data="treeData" :props="defaultProps"  class="filter-tree"
					 ref="tree"
					 node-key="id"
					 default-expand-all
					 highlight-current
					 :indent="indent"
					 v-loading="treeDataLoading"
					 @node-click="treeClick">
			</kc-tree>
		</div>
		<div class="searchTreeData" v-if="!showTree" v-loading="tableLoading">
			<table>
				<thead>
				<tr>
					<th>单位编号</th>
					<th>单位名称</th>
				</tr>
				</thead>
				<tbody class="tableBody">
					<tr v-if="searchData.length>0" v-for="(item,index) in searchData" @click="tableClick(item,index)"
						class="tableStyle"
						:class="{'backgroundColor':ind === index}" :key="index">
						<td>{{item.code}}</td>
						<td>{{item.name}}</td>
					</tr>
				</tbody>
			</table>
			<div class="kc-table__empty-block" v-show="searchData.length === 0" ><span class="kc-table__empty-text">暂无数据</span></div>
		</div>
	</div>
</template>
<script>
	import { getDepartmentApi, getOrganizationTree } from '../../../service/organization.js';
	import { createNamespacedHelpers } from 'vuex';
	const {mapMutations} = createNamespacedHelpers('userMgtStore');
	export default {
		props: {
			inputTreeData: Array
		},
		data() {
			return {
				indent: {size: 0.9, unit: 'rem'},
				ind: '',
				tableStyle: '',
				treeData2: '',
				searchData: [],
				showTree: true,
				searchContent: '',
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				treeDataLoading: true,
				tableLoading: true
			};
		},
		mounted() {
			// 获取树原始数据
			this.getTreeData();
		},
		watch: {
			searchContent: {
				handler(val, oldVal) {
					if(val == ''){
						this.comeBack();
					}
				}
			},
			inputTreeData: {
				handler(val, oldVal) {
					this.treeData = this.inputTreeData;
				},
				deep: true
			}
		},
		methods: {
			...mapMutations({
				UPDATE_ORGANIZATION_OPTION_NAME: 'UPDATE_ORGANIZATION_OPTION_NAME'
			}),
			getTreeData() {
				this.treeDataLoading = true;
				getOrganizationTree().then(res => {
					this.treeDataLoading = false;
					if (res.status === 200) {
						this.treeData2 = JSON.parse(JSON.stringify(res.result));
						this.treeData = res.result;
						console.log(this.treeData, 'treeDate---->');
						this.$emit('dept-tree', this.treeData);
						this.$emit('no-update-tree', false);
					}
				}, err => {
					this.treeDataLoading = false;
					this.$message.warning(err);
				});
			},
			comeBack() {
				this.showTree = true;
				this.searchContent = '';
			},
			setClass(key) {
				let obj = {};
				obj[`qqface${key}`] = true;
				return obj;
			},
			treeClick(data, node, obj) {
				this.UPDATE_ORGANIZATION_OPTION_NAME('组织机构详情');
				this.$emit('show-type', 1);
				this.$emit('handleType', false);
				this.$emit('click-depid', node, data);
			},
			tableClick(val) {
				this.UPDATE_ORGANIZATION_OPTION_NAME('组织机构详情');
				this.$emit('show-type', 1);
				this.$emit('handleType', false);
				this.$emit('click-depid', val, val);
			},
			searchClick() {
				if (!this.searchContent.trim()) {
					this.showTree = true;
				}else{
					this.tableLoading = true;
					let params = {
						f_like_name: this.searchContent.trim(),
						f_eq_status: 1 //查询有效dept数据,
					};
					getDepartmentApi(params).then(res => {
						this.tableLoading = false;
						this.searchData = res.result.data;
						this.searchData.forEach(item => {
							item.select = false;
						});
					});
					this.showTree = false;
				}
			},
			keyupSubmit(e) {
				this.tableLoading = true;
				if (this.searchContent.replace(/\s+/g, '') === '') {
					this.comeBack();
					this.tableLoading = false;
					return;
				}
				this.$emit('show-type', 0);//tree 未点击
				this.searchClick();
			},
			/// 新增
			detailRootAdd() {
				this.$emit('handleType', true);
			}
		}
	};

</script>
