/**
 * 公共的ajax数据服务
 */
import axios from './ajax';
import Global from 'utils/global';
/**
 * @name getUserInfo
 * @params null
 */
// 树形类表
// 所属辖区
export const leftTree = () => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/xtgl/lefttree/list', 'get', {});
};
//加载分组树（卡口传0，视频传1待确认）
export const loadSbfzTree = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + params.num, 'get', params.data);
};
// 新增角色
export const addRoleApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/role', 'post', params);
};
// 修改角色
export const changeRoleApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/role/' + params.id, 'put', params.info);
};
// 角色查询（ok）
export const allRoles = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/role?sorts[0].name=updateTime&sorts[0].order=DESC', 'get', params);
};
// 角色分组授权(ok)(卡口传num参数传0，视频传1待确认）
export const roleGroupAuthApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/deviceGroup/' + params.num, 'get');
};
// 获取待选属性
export const getAttrsApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/codeItem/type?codeTypeNo=40201&codeTypeNo=20006&codeTypeNo=40202', 'get', {});
};
// 获取角色设备授权
export const getDeviceAuthApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/device/' + params.num, 'get', params.data);
};
// 获取角色已剔除设备
export const getDelDeviceAuthApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/device/exclude/' + params.num, 'get', params.data);
};
// 给设备授权角色（ok 待确认）
export const addDeviceAuthRoleApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/device', 'post', params.status);
};
// 剔除设备授权角色（ok 待确认）
export const delDeviceAuthRoleApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/device/exclude', 'post', params.status);
};
// 取消分组授权（ok）
export const cancelGroupAuthApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.roleId + '/deviceGroup/' + params.deviceGroupId, 'DELETE', {});
};
// 批量取消分组授权(ok)
export const cancelAllGroupAuthApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.roleId + '/deviceGroup/', 'DELETE', params.deviceGroupIds);
};
// 角色分组授权(ok)
export const addGroupAuthApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/deviceGroup', 'post', params);
};
// 角色分组权限变更（ok）
export const changeGroupAuthsApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/deviceGroup', 'put', params);
};
// 获取树列表设备（ok）
export const getTreeListDeviceApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + params.id + '/device', 'get', params.status);
};
// 变更授权设备权限（ok 待确认）
export const changeDeviceAuthApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/device', 'put', params.status);
};
// 变更剔除设备权限（ok 待确认）
export const changeDeviceAuthExcludeApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/device/exclude', 'put', params.status);
};
// 批量删除设备已授权（ok 待确认）
export const delAllDeviceApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/device', 'DELETE', params.ids);
};
// 批量删除剔除设备已授权（ok 待确认）
export const delAllDeviceExcludeApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/device/exclude', 'DELETE', params.ids);
};
// 设备树统计数据获取(ok)
export const getDeviceCountApi = (fzId) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/deviceGroup/${fzId}/device/statistical`, 'get', {});
};
// 给属性授权角色
export const addAttrRoleApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/property', 'post', params.types);
};
// 更改属性授权(ok)
export const ChangeAttrAuthApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.id + '/property', 'put', params.status);
};
// 单个移除属性授权()
export const delCurAttributeApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.roleId + '/property/' + params.id, 'DELETE', {});
};
// 批量移除属性授权
export const delAllAttributeApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.roleId + '/property', 'DELETE', params.ids);
};
// 获取角色的授权信息
export const getRoleAttrsApi = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/role/' + params.roleId + '/property', 'get', {});
};
// 单个删除角色 （ok）
export const delOneRoleApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/role/' + params.roleId + '/command', 'post', params.status);
};
// 批量删除角色（ok）
export const delMoreRoleApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/role/command', 'post', params);
};
// 根据分类搜索设备列表
export const searchDeviceByDeviceGroup = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/device/noPermissionControl', 'get', params);
};



// 角色管理 功能菜单 初始化
// gis屏 初始化
export const getTreeCheckedApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/resource_setting/tree/checked', 'get', params);
};
// gis屏 批量授权
export const batchImpower = (param) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/resource_setting/batch', 'put', param);
	// return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/resource_setting/saveAll', 'put', param);
};


export const getMenuTree = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/resource/tree', 'get', params);
};
