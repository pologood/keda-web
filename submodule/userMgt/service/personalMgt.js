/**
 * 公共的ajaxeEzview数据服务
 */
import axios from './ajax';
import Global from 'utils/global';

// 所属辖区 初始化
export const personalLoadArea = () => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/area', 'get');
};
// 所属辖区 查询
export const personalQueryArea = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/area/list', 'get', params);
};
// 设备列表 树形列表
export const personalLoadSbfzTree = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + params, 'get', {});
};

// 添加父节点
export const personalAddfSpfz = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/top', 'post', params);
};
// 添加子节点
export const personalAddcSpfz = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + params.parentGroupId + '/down', 'post', params);
};
// 修改节点
export const personalEditSpfz = (param) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + param.deviceGroupId, 'put', param);
};
// 删除节点
export const personalDeleteSpfz = (param) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + param.deviceGroupId, 'delete');
};
// 设备类表
// 已选设备类表 初始化
export const personalSourceDevice = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + params.deviceGroupId + '/device', 'get', params);
};
export const personalAddDevice = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + params.deviceGroupId + '/device', 'post', JSON.stringify(params));
};
export const personalDeleteDevice = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + params.deviceGroupId + '/device', 'delete', JSON.stringify(params));
};
// 待选设备类表 初始化
export const personalTargetDevice = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/device/exclude', 'get', params);
};
