/**
 * 公共的ajax数据服务
 */
import axios from './ajax';
import Global from 'utils/global';
// 树形类表
// 所属辖区
export const leftTree = () => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/xtgl/lefttree/list', 'get', {});
};
//获取有效dept tree
export const getOrganizationTree = () => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department/tree', 'get', {f_eq_status: 1, paging: false});
};
// 组织机构树的模糊搜索
export const searchOrganizationTree = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department/tree', 'get', params);
};
// 获取所有用户
export const getAllUsersApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/user', 'get', params);
};
// 新增用户
export const addUserApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/user', 'post', params);
};
// 修改用户角色
export const changeUserRoleApi = (id, params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/user/path_role/' + id, 'put', params);
};

// 修改用户
export const changeUserApi = (id, params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/user/' + id, 'put', params);
};
// 单个删除用户
export const delCurUserApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/user/' + params.id + '/command', 'post', params.info);
};
// 批量删除用户
export const delMoreUserApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/user/command', 'post', params);
};

export const changePswApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + `/user/password/${params.id}/reset?password=${params.password}`, 'put', {});
};

// 加载警员类别
export const loadPoliceType = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/common/config/getPolicemanType', 'get', {});
};
