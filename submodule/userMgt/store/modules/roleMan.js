import {
	allRoles,	// 查询角色列表
	delMoreRoleApi	// 批量无效角色
} from '../../service/roleMgt.js';
import Vue from 'vue';
const store = {
	state: {
		showActive: 0,
		roleList: [],
		currentRow: null,
		pageNo: 0,
		pageSize: 10,
		total: 1,
		roleDetailInfoOrigin: null,
		roleDetailInfo: {
			creatorName: '',
			createTime: '',
			updaterName: '',
			updateTime: '',
			name: '',
			id: '',
			sign: '',
			description: ''
		},
		// 当前选中角色id
		currentRoleId: '',
		isEdit: false,
		isAdd: false,
		disableRoleAuth: false,
		roleListLoading: false,
		tollgatesDeviceIds: {},
		videoDeviceIds: {},
		attrsSelected: {}
	},
	mutations: {
		//角色管理角色选中状态
		USERMGT_SHOW_ACTIVE (state, showActive) {
			state.showActive = showActive;
		},
		//卡口资源设备已选设备所有ID
		TOLLGATES_DEVICE_IDS (state, tollgatesDeviceIds) {
			state.tollgatesDeviceIds = JSON.parse(JSON.stringify(tollgatesDeviceIds));
		},
		//视频资源设备已选设备所有ID
		ATTRS_SELECTED (state, attrsSelected) {
			state.attrsSelected = JSON.parse(JSON.stringify(attrsSelected));
		},
		//视频资源设备已选设备所有ID
		VIDEO_DVICE_IDS (state, videoDeviceIds) {
			state.videoDeviceIds = JSON.parse(JSON.stringify(videoDeviceIds));
		},
		// 更新页码
		USERMGT_UPDATE_PAGE (state, pageNo) {
			state.pageNo = pageNo;
		},
		// 加载
		USERMGT_LOADING_ROLE (state, roleListLoading) {
			state.roleListLoading = roleListLoading;
		},
		// 更新页
		USERMGT_UPDATE_PAGE_SIZE (state, pageSize) {
			state.pageSize = pageSize;
		},

		USERMGT_UPDATE_ISEDIT (state, isEdit) {
			state.isEdit = isEdit;
		},

		USERMGT_UPDATE_ISADD (state, isAdd) {
			state.isAdd = isAdd;
		},

		USERMGT_UPDATE_DISABLE_ROLEAUTH (state, disableRoleAuth) {
			state.disableRoleAuth = disableRoleAuth;
		},

		// 单击行
		USERMGT_SET_CURRENT_ROW (state, row) {
			state.currentRow = row;
			state.currentRoleId = row.id;
			state.roleDetailInfo.creatorName = row.creatorName;
			state.roleDetailInfo.createTime = row.createTime;
			state.roleDetailInfo.updaterName = row.updaterName;
			state.roleDetailInfo.updateTime = row.updateTime;
			state.roleDetailInfo.name = row.name;
			state.roleDetailInfo.id = row.id;
			state.roleDetailInfo.description = row.description;
			state.roleDetailInfo.sign = row.sign;
			state.roleDetailInfoOrigin = JSON.parse(JSON.stringify(state.roleDetailInfo));
		},
		USERMGT_CLEAR_ROLE_DETAIL_INFO (state) {
			state.roleDetailInfo.creatorName = '';
			state.roleDetailInfo.createTime = '';
			state.roleDetailInfo.updaterName = '';
			state.roleDetailInfo.updateTime = '';
			state.roleDetailInfo.name = '';
			state.roleDetailInfo.id = '';
			state.roleDetailInfo.description = '';
		},
		USERMGT_RECOVER_ROLE_DETAIL_INFO (state) {
			state.roleDetailInfo.creatorName = state.roleDetailInfoOrigin.creatorName;
			state.roleDetailInfo.createTime = state.roleDetailInfoOrigin.createTime;
			state.roleDetailInfo.updaterName = 	state.roleDetailInfoOrigin.updaterName;
			state.roleDetailInfo.updateTime = state.roleDetailInfoOrigin.updateTime;
			state.roleDetailInfo.name = state.roleDetailInfoOrigin.name;
			state.roleDetailInfo.id = state.roleDetailInfoOrigin.id;
			state.roleDetailInfo.description = state.roleDetailInfoOrigin.description;
		}
	},
	actions: {
		// 查询角色列表
		userMgtQueryRole ({state}, params) {
			allRoles(params).then(res => {
				state.roleListLoading = false;
				let roleList = res.result.data;
				state.roleList = roleList;
				state.total = res.result.total;
				if (roleList.length) {
					let first = roleList[0];
					state.currentRoleId = first.id;
					state.roleDetailInfo.creatorName = first.creatorName;
					state.roleDetailInfo.createTime = first.createTime;
					state.roleDetailInfo.updaterName = first.updaterName;
					state.roleDetailInfo.updateTime = first.updateTime;
					state.roleDetailInfo.name = first.name;
					state.roleDetailInfo.id = first.id;
					state.roleDetailInfo.description = first.description;
					state.isEdit = false;
					state.isAdd = false;
					roleList.filter(item => {
						Vue.set(item, 'checked', false);
					});
					state.roleDetailInfoOrigin = JSON.parse(JSON.stringify(state.roleDetailInfo));
				}
			});
		},
		// 批量删除
		userMgtDeleteAllRole ({state}, ids) {
			delMoreRoleApi({
				ids,
				command: 'STOP'
			}).then(res => {
				allRoles({
					pageNo: state.pageNo,
					pageSize: state.pageSize,
					f_eq_status: 1
				}).then(res => {
					state.roleList = res.result.data;
					state.total = res.result.total;
				});
			});
		}

	}
};

export default store;
