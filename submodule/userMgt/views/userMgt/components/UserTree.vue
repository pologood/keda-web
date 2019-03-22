<template>
	<div class="userMgt-userMgt-userTree">
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
		   <kc-tree
			   v-loading="treeDataLoading"
				:data="treeData"
				default-expand-all
				node-key="id"
				ref="tree"
				highlight-current
				@node-click="treeClick"
			   :indent="indent"
			   :props="defaultProps">
			</kc-tree>
		</div>
		<div class="searchTreeData" v-if="!showTree">
			<table v-loading="loadingSearchData">
				<thead>
				<tr>
					<th>单位编号</th>
					<th>单位名称</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item, index) in searchData" :key="index" @click="tableClick(item,index)"><!--editRole(tableData[index])-->
					<td label="单位编号" :title="item.code">
						{{item.code}}
					</td>
					<td label="单位名称">
						{{item.name}}
					</td>
				</tr>
				</tbody>
			</table>
			<div class="kc-table__empty-block" v-show="searchData.length === 0" ><span class="kc-table__empty-text">暂无数据</span></div>
		</div>
	</div>
</template>
<script>
	import {
		getOrganizationTree,
		searchOrganizationTree
	} from '../../../service/userMgt.js';

	export default {
		props: {
			inputTreeData: Array
		},
		components: {
		},
		data () {
			return {
				indent: {size: 0.9, unit: 'rem'},
				tableStyle: '',
				backgroundColor: '',
				treeData2: '',
				searchData: [],
				showTree: true,
				searchContent: '',
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				keymap: {
					title: 'name'
				},
				treeDataLoading: true,
				loadingSearchData: true
			};
		},
		watch: {
			inputTreeData: {
				handler (val, oldVal) {
					this.treeData = this.inputTreeData;
				},
				deep: true
			},
			searchContent: {
				handler(val, oldVal) {
					if(val == ''){
						this.comeBack();
					}
				}
			}
		},
		created () {
			// 获取树原始数据
			getOrganizationTree().then(res => {
				this.treeDataLoading = false;
				if (res.status == 200) {
					this.treeData2 = JSON.parse(JSON.stringify(res.result));
					this.treeData = res.result;
					this.$emit('treeDatas', this.treeData2);
				}
			}, err => {
				this.treeDataLoading = false;
				this.$message.warning(err);
			});
		},
		methods: {
			comeBack () {
				this.showTree = true;
				this.searchContent = '';
			},
			setClass (key) {
				let obj = {};
				obj[`qqface${key}`] = true;
				return obj;
			},
			treeClick (val, root) {
				this.$emit('showType', 1);
				this.$emit('depId', val);
				this.$emit('onClickdepId', root, val);
			},
			tableClick (val, index) {
				this.$emit('onClickdepId', val, index);
				this.$emit('depId', val);
			},
			searchClick () {
				this.loadingSearchData = true;
				if (this.searchContent.replace(/\s+/g, '') === '') {
					this.comeBack();
					this.loadingSearchData = false;
					this.$message({
						message: '已查询所有',
						type: 'success',
						duration: 1000
					});
					return;
				}
				let params = {
					f_like_name: this.searchContent.trim(),
					f_eq_status: 1, //查询有效dept数据
					paging: false //默认不分页
				};
				searchOrganizationTree(params).then(res => {
					this.loadingSearchData = false;
					this.searchData = res.result;
					this.searchData.forEach(item => {
						item.select = false;
					});
				});
				this.showTree = false;
			},
			keyupSubmit (e) {
				this.searchClick();
			}
		}
	};

</script>

