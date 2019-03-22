/**
 * 公共的ajaxeEzview数据服务
 */
import axios from './ajax';
import Global from 'utils/global';

// 所属辖区 初始化
export const loadArea = () => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/area/tree', 'get');
};
// 所属辖区 查询
export const queryArea = (param) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/area', 'get', param);
};
// 设备列表 树形列表
export const loadSbfzTree = (params) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/deviceGroup/' + params, 'get', {});
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + params, 'get', {});
	}
};
// 添加父节点
export const addfSpfz = (params) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/top', 'post', params);
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/top', 'post', params);
	}
};
// 添加子节点
export const addcSpfz = (params) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + params.parentGroupId + '/down', 'post', params);
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + params.parentGroupId + '/down', 'post', params);
	}
};
// 修改节点
export const editSpfz = (param) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + param.deviceGroupId, 'put', param);
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + param.deviceGroupId, 'put', param);
	}
};
// 删除节点
export const deleteSpfz = (param) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/' + param.deviceGroupId, 'delete');
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + param.deviceGroupId, 'delete');
	}
	// return axios.ajaxEzview('/deviceGroup/' + param.deviceGroupId, 'delete');
};
// 设备类表
// 已选设备类表 初始化
export const sourceDevice = (params) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/device/' + params.deviceGroupId, 'get', params);
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + params.deviceGroupId + '/device', 'get', params);
	}
};
export const addDevice = (params) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/batch/device/' + params.deviceGroupId, 'post', params.deviceIds);
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + params.deviceGroupId + '/device', 'post', JSON.stringify(params));
	}
};
export const deleteDevice = (params) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/batch/device/' + params.deviceGroupId, 'delete', params.deviceIds);
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + params.deviceGroupId + '/device', 'delete', JSON.stringify(params));
	}
};
// 待选设备类表 初始化
export const targetDevice = (params) => {
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/device/exclude/' + params.deviceGroupId, 'get', params);
    // http://192.168.7.100:8080/icmp-web/customGroup/device/exclude/{deviceGroupId}
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/device/exclude', 'get', params);
	}
};
// 删除所有设备
export const targetDeviceAll = (params) => {
	console.log(params, 'params');
	if (window.location.href.endsWith('personalMediaGroup') || window.location.href.endsWith('personalTollgateGroup')) {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/customGroup/all/device/' + params, 'delete', params);
    // http://192.168.7.100:8080/icmp-web/customGroup/device/exclude/{deviceGroupId}
	} else {
		return axios.ajax4UserMgt(Global.getBaseUrl() + '/deviceGroup/' + params + '/device/empty', 'delete', params);
	}
};



