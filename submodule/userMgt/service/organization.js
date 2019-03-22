/**
 * 公共的ajax数据服务
 */
import axios from './ajax';
import Global from 'utils/global';
//获取有效dept tree
export const getOrganizationTree = () => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department/tree', 'get', {f_eq_status: 1, paging: false});
};
// 修改组织机构信息
export const changeDepartmentApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department/' + params.id, 'put', params);
};
// 新增组织机构信息
export const addDepartmentApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department', 'post', params);
};

//搜索部门详情
export const getDepartmentApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department', 'get', params);
};
// 删除组织机构信息 --有效 无效  post
// 命令（START有效，STOP无效） /department/{id}/command
export const deleteDepartmentApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department/' + params.id + '/command', 'post', params);
};
// 角色查询
export const allRoles = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/role', 'get', params);
};
// 获取部门详情
export const getDepartmentRole = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department/' + params.id, 'get', params);
};
