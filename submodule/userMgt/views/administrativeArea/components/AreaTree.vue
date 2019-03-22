<template>
  <div class="userMgt-administrativeArea-areaTree">
	  <div class="header">
			<h3 class="title">行政区域信息</h3>
			<div class="search-content">
				<div class="search-group">
					<kc-input
						placeholder="请输入关键字搜索"
						id="stid"
						ref="searchref"
						v-model="searchText"
						class="input-with-select"
						@keyup.enter.native="arinfoQuery">
						<i slot="suffix" @click="arinfoBack()" class="icon kedaIconfont KD-yijianshanchu keda-icon-style" v-if="searchText.length>0"></i>
						<i slot="suffix" @click="arinfoQuery()" class="icon kedaIconfont search-size keda-icon-heavy-style">&#xe638;</i>
					</kc-input>
					<kc-tooltip class="item" effect="light" content="新增根节点" placement="right">
						<kc-button class="user-serach-button keda-icon-heavy-style"
								   @click="rootNodeAdd()"
								   size="small">
								<i class="icon kedaIconfont KD-jia"></i>
						</kc-button>
					</kc-tooltip>
				</div>
			</div>
		</div>
  	  <div class="tree-wrapper" v-if="treeShow">
			<kc-tree
				:data="treeData"
				:styles="styles"
				node-key="id"
				v-loading="treeDataLoading"
        		highlight-current
				default-expand-all
				:indent="indent"
				@node-click="getTreeNode">
			</kc-tree>
  	</div>
	  <div class="searchTreeData" v-if="!treeShow" v-loading="tableLoading">
		  <table class="tabOrgan">
			  <thead>
			  <tr>
				  <th>行政编码</th>
				  <th>行政名称</th>
			  </tr>
			  </thead>
			  <tbody class="tableBody">
			  <tr v-if="searchTable.length>0" v-for="(item,index) in searchTable" @click="changeText(item, index)" class="tableStyle" :class="{'backgroundColor':ind === index}" :key="index">
				  <td>{{item.code}}</td>
				  <td>{{item.name}}</td>
			  </tr>
			  </tbody>
		  </table>
		  <div class="kc-table__empty-block" v-show="searchTable.length === 0" ><span class="kc-table__empty-text">暂无数据</span></div>
	  </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
const {mapState, mapMutations, mapActions} = createNamespacedHelpers('userMgtStore');
export default {
	data () {
		return {
			indent: {size: 0.9, unit: 'rem'},
			ind: 0,
			currentNode: {},
			searchText: '',
			treeShow: true,
			Loading: true,
			defaultProps: {
				children: 'children',
				label: 'name'
			},
			styles: {
				color: {
					total: '#303133',
					num1: '#7fcc59',
					num2: '#f76b69',
					num3: '#909399'
				}
			},
			treeDataLoading: false,
			tableLoading: false
		};
	},
	created () {
		let params = {
			f_eq_status: 1,
			pageSize: this.pageSize,
			pageNo: this.pageNo
		};
		// 初始化树数据
		this.userMgtTreeList(params);
	},
	watch: {
		searchText: {
			handler(val, oldVal) {
				if(val == oldVal){
					return false;
				}
				if(val == ''){
					this.arinfoBack();
				}
			}
		}
	},
	computed: {
		...mapState({
			treeData: state => state.administrativeArea.treeData,
			searchTable: state => state.administrativeArea.searchTable,
			pageNo: state => state.administrativeArea.pageNo,
			pageSize: state => state.administrativeArea.pageSize,
			total: state => state.administrativeArea.total
		})
	},
	methods: {
		...mapActions({
			userMgtRowData: 'userMgtRowData',
			userMgtTreeList: 'userMgtTreeList'
		}),
		...mapMutations({
			USERMGT_CHANGE_PAGE: 'USERMGT_CHANGE_PAGE',
			USERMGT_SELECT_NODE: 'USERMGT_SELECT_NODE',
			USERMGT_RESET: 'USERMGT_RESET',
			UPDATE_OPTION_NAME: 'UPDATE_OPTION_NAME',
			SET_USERMGT_RECOVER: 'SET_USERMGT_RECOVER',
			IS_ADD_ROOT_NODE: 'IS_ADD_ROOT_NODE',
			USERMGT_RECOVER: 'USERMGT_RECOVER'
		}),
		// 单击节点获取节点数据
		getTreeNode (root, node) {
			this.UPDATE_OPTION_NAME('行政区域详情');
			this.USERMGT_SELECT_NODE(node.data);
			if(typeof node.data.extendedField === 'object'){
				node.data.extendedField = JSON.parse(JSON.stringify(node.data.extendedField));
			}else{
				node.data.extendedField = JSON.parse(node.data.extendedField);
			}
			this.USERMGT_RECOVER(node.data);
		},
		// 搜索按钮
		arinfoQuery () {
			if (!this.searchText.trim()) {
				this.treeShow = true;
			} else {
				this.USERMGT_CHANGE_PAGE(0);
				this.treeShow = false;
				let params = {
					f_like_name: this.searchText.trim(),
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					f_eq_status: 1
				};
				this.userMgtRowData(params);
			}
			this.USERMGT_SELECT_NODE('');
			this.USERMGT_RESET();
		},
		// 返回按钮
		arinfoBack () {
			this.treeShow = true;
			this.searchText = '';
		},
		// 点击选中的查询出来的table当前行
		changeText (row, index) {
			this.UPDATE_OPTION_NAME('行政区域详情');
			this.ind = index;
			this.USERMGT_SELECT_NODE(row);
			if(typeof row.extendedField === 'object'){
				row.extendedField = JSON.parse(JSON.stringify(row.extendedField));
			}else{
				row.extendedField = JSON.parse(row.extendedField);
			}
			this.SET_USERMGT_RECOVER(row);
		},
		// 新增
		rootNodeAdd() {
			this.IS_ADD_ROOT_NODE(true);
			this.UPDATE_OPTION_NAME('新增行政区');
			this.$emit('isAddRootNode', '');
		}
	}
};
</script>
