import {
	addUserApi,
	changeUserApi,
	getAllUsersApi,
	delCurUserApi,
	delMoreUserApi,
	loadPoliceType,
	changePswApi
} from '../../service/userMgt.js';
const store = {
	state: {
		defaultDepId: 0,
		userData: [],
		pageNo: 0,
		pageSize: 10,
		pageTotal: 0,
		userId: '',
		rules2: {
			personCode: [
				{
					required: true,
					message: '不能为空',
					trigger: 'change'
				}
			],
			policeTypes: [
				{
					required: true,
					message: '不能为空',
					trigger: 'change'
				}
			],
			videoRoute: [
				{
					required: true,
					message: '不能为空',
					trigger: 'change'
				}
			],
			userStatus: [
				{
					required: true,
					message: '不能为空',
					trigger: 'change'
				}
			],
			business: [
				{
					required: true,
					message: '不能为空',
					trigger: 'change'
				}
			],
			username: [{
				required: true,
				message: '请输入登陆名',
				trigger: 'change'
			}, {
				min: 4,
				max: 15,
				message: '登录名长度为4-15位',
				trigger: 'change'
			}],
			policeName: [{
				required: true,
				message: '请输入警员姓名',
				trigger: 'change'
			}, {
				min: 2,
				max: 15,
				message: '警员姓名长度为2-15位',
				trigger: 'change'
			}],
			IDnumber: [
				{
					required: true,
					message: '不能为空',
					trigger: 'change'
				}, {
					pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
					message: '身份证格式不正确',
					trigger: 'change'
				}
			],
			departmentName: [
				{
					required: true,
					message: '不能为空',
					trigger: 'change'
				}
			],
			phoneNumber: [
				{
					pattern: /^1\d{10}$/,
					message: '手机号码格式不正确',
					trigger: 'change'
				}
			],
			ContactNum: [
				{
					pattern: /^0\d{2,3}-?\d{7,8}$/,
					message: '电话号码格式不正确',
					trigger: 'change'
				}
			]
		},
		policeTypeList: [], // 警员类别列表
		searchParams: {
			'f_like_name': '',
			'f_like_code': '',
			'f_like_username': '',
			'paging': true,
			'f_eq_clientSign': ''
		},
		policeTypeInfos: [
			{
				value: '治安警察',
				label: '治安警察'
			}, {
				value: '刑侦警察',
				label: '刑侦警察'
			}, {
				value: '交通警察',
				label: '交通警察'
			}, {
				value: '巡逻警察',
				label: '巡逻警察'
			}
		],
		userStatusInfos: [
			{
				value: 1,
				label: '正常'
			}, {
				value: 2,
				label: '暂时离岗'
			}, {
				value: 3,
				label: '注销'
			}, {
				value: 4,
				label: '待入职'
			}
		],
		videoRouteInfos: [
			{
				value: '1',
				label: '1'
			}, {
				value: '4',
				label: '4'
			}, {
				value: '6',
				label: '6'
			}, {
				value: '8',
				label: '8'
			}, {
				value: '9',
				label: '9'
			}, {
				value: '16',
				label: '16'
			}
		],
		originOfUserInfoDetails: {
			username: '',
			policeName: null,
			policeDuties: '',
			describe: '',
			personCode: '',
			business: null,
			videoRoute: '', //视频路数
			departmentName: null,
			policeCategory: '', //所属警钟
			usefulData: null,
			userStatus: '', //用户状态
			ContactNum: '',
			IDnumber: '',
			Gis: null,
			bindIp: null,
			policeTypes: [], // 警员类别
			phoneNumber: ''
		}
	},
	mutations: {
		USERINFO_DEFAULT_DEPID (state, defaultDepId) {
			state.defaultDepId = defaultDepId;
		},
		USERINFO_POLICE_TYPE_LIST (state, policeTypeList) {
			state.policeTypeList = policeTypeList;
		},
		// 更新页码
		USERINFO_UPDATE_PAGE (state, pageNo) {
			state.pageNo = pageNo;
		},
		// 更新页码
		USERINFO_UPDATE_PAGE_TOTAL (state, pageTotal) {
			state.pageTotal = pageTotal;
		},
		// 更新页
		USERINFO_UPDATE_PAGE_SIZE (state, pageSize) {
			state.pageSize = pageSize;
		},
		USERINFO_UPDATE_USER_ID (state, userId) {
			state.userId = userId;
		},
		All_USERS_INFO(state, list) {
			state.userData = [...list];
		}
	},
	actions: {
		// 获取所有用户方法
		userMgtGetAllUsersInfo ({commit}, params) {
			return	getAllUsersApi(params).then(res => {
				let result = res.result;
				if (result) {
					result.data.forEach(item => {
						item.checked = false;
					});
					commit('All_USERS_INFO', result.data);
					commit('USERINFO_UPDATE_PAGE_TOTAL', result.total);
				}
			});
		},
		// 警员类别数据请求
		userMgtGetPoliceType ({commit}, params) {
			return loadPoliceType(params).then(r => {
				if (r.code === '0') {
					commit('USERINFO_POLICE_TYPE_LIST', r.result);
				}
			}, e => {
				console.log(e);
			});
		},
		// 新增单个用户
		userMgtAddNewUser ({commit}, {params, vm}) {
			return addUserApi(params).then(res => {
				if (res.status === 200) {
					vm.addDialogInfoVisible = false;
					vm.queryAllUsersInfo();
					this.showActive = res.result;
					vm.$message.success('添加成功');
				} else {
					if (res.message === '人员编号重复') {
						res.message = '警员姓名已经存在';
					}
					vm.$alert(res.message ? res.message : '操作失败！', '提示', {
						confirmButtonText: '确定',
						type: 'warning'
					});
				}
			}).catch(err => {
				vm.$alert(err, '提示', {
					confirmButtonText: '确定',
					type: 'warning'
				});
			});
		},
		// 修改单个用户
		userMgtModifyUser ({commit}, {params, editThis}) {
			return changeUserApi(params.id, params).then(res => {
				if (res.status === 200) {
					editThis.addDialogInfoVisible = false;
					editThis.queryAllUsersInfo();
					editThis.$message.success('修改成功');
				} else {
					editThis.$alert(res.message ? res.message : '操作失败！', '提示', {
						confirmButtonText: '确定',
						type: 'warning'
					});
				}
			}).catch(err => {
				editThis.$alert(err, '提示', {
					confirmButtonText: '确定',
					type: 'warning'
				});
			});
		},
		// 删除单个用户
		userMgtDelCurUser ({commit}, {params, vm, index}) {
			return	delCurUserApi(params).then(res => {
				if (res.status === 200) {
					vm.$message.success('删除成功');
					vm.userData.splice(index, 1);
					vm.queryAllUsersInfo();
				}else{
					vm.$message.warning('删除失败');
				}
			});
		},
		// 批量删除用户
		userMgtDelMoreUser ({commit}, {params, vm}) {
			return delMoreUserApi(params).then(res => {
				if (res.status === 200) {
					vm.$message.success('删除成功');
					vm.queryAllUsersInfo();
				}else{
					vm.$message.warning('删除失败');
				}
			});
		},
		//重置密码
		userMgtChangePsw ({commit}, {params, vm}){
			return changePswApi(params).then(r => {
				vm.$message.success('重置成功！');
				vm.changePswDailog = false;
			});
		}
	}
};
export default store;
