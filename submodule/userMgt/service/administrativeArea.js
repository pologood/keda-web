/**
 * 公共的ajaxCloudRbac数据服务
 */
import axios from './ajax';
import Global from 'utils/global';
// 行政区域 初始化
export const loadArea = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/area/tree', 'get', params);
};
// 行政区域 搜索
export const queryArea = (param) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/area', 'get', param);
};
// 行政区域 新增
export const addNode = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/area', 'post', params);
};
// 行政区域编码唯一性验证
export const isAreaCodeUnique = (param) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/area/unique/code', 'get', param);
};
// 行政区域 修改
export const editNode = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + `/area/${params.id}`, 'put', params);
};
// 行政区域 删除
export const deleteNode = (param) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + `/area/${param.id}/command`, 'POST', param);
};

