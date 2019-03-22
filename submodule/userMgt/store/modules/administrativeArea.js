import {
	loadArea,
	queryArea
} from '../../service/administrativeArea.js';

const store = {
	state: {
		treeData: [],
		detailResult: {
			code: '',
			name: '',
			organ: '',
			xMin: '',
			yMin: '',
			xMax: '',
			yMax: '',
			extendedField: {
				simple: ''
			}
		},
		currentNode: '',
		currentNodeId: '',
		tableList: [],
		searchTable: [],
		pageNo: 0,
		pageSize: 16,
		total: 1,
		isAddRootNode: false,
		optionName: '行政区域详情'
	},
	mutations: {
    // 行政区域树形列表 初始化
		USERMGT_TREE_LIST (state, list) {
			let treeData = JSON.stringify(list).replace(/name/g, 'label');
			state.treeData = JSON.parse(treeData);
		},
		// 选择树
		USERMGT_SELECT_NODE (state, data) {
			state.currentNode = data;
			if(data){
				state.currentNodeId = data.id;
			}else{
				state.currentNodeId = '';
			}
		},
		// 恢复
		USERMGT_RECOVER (state, node) {
			state.detailResult.code = node.code;
			state.detailResult.name = node.label;
			state.detailResult.id = node.id;
			state.detailResult.organ = node.organ;
			state.detailResult.xMin = node.xMin;
			state.detailResult.yMin = node.yMin;
			state.detailResult.xMax = node.xMax;
			state.detailResult.yMax = node.yMax;
			state.detailResult.simple = node.extendedField.simple;
		},
		SET_USERMGT_RECOVER (state, node) {
			state.detailResult.code = node.code;
			state.detailResult.name = node.name;
			state.detailResult.id = node.id;
			state.detailResult.organ = node.organ;
			state.detailResult.xMin = node.xMin;
			state.detailResult.yMin = node.yMin;
			state.detailResult.xMax = node.xMax;
			state.detailResult.yMax = node.yMax;
			state.detailResult.simple = node.extendedField.simple;
		},
		USERMGT_RESET (state) {
			state.detailResult.code = '';
			state.detailResult.name = '';
			state.detailResult.organ = '';
			state.detailResult.xMin = '';
			state.detailResult.yMin = '';
			state.detailResult.xMax = '';
			state.detailResult.yMax = '';
			state.detailResult.simple = '';
		},
		// 换页
		USERMGT_CHANGE_PAGE (state, {pageNo}) {
			state.pageNo = pageNo;
		},
		//是否增加根节点
		IS_ADD_ROOT_NODE (state, isAddRootNode) {
			state.isAddRootNode = isAddRootNode;
		},
		UPDATE_OPTION_NAME (state, optionName){
			state.optionName = optionName;
		}
	},
	actions: {
		// 获取树数据
		userMgtTreeList ({commit}, params) {
			return loadArea(params)
				.then(list => {
					console.log(list, 'list');
					commit('USERMGT_TREE_LIST', list.result);
				});
		},
		// 行政区信息 无效(删除)
		userMgtDetailData ({commit}, {params, vm}) {

		},
		// 搜索
		userMgtRowData ({state}, params) {
			return queryArea(params).then(res => {
				let result = res.result;
				console.log(result, 'list-------');
				state.searchTable = result.data;
				state.pageNo = result.pageNo + 1;
				state.pageSize = result.pageSize;
				state.total = result.total;
			});
		}
	}
};
export default store;
