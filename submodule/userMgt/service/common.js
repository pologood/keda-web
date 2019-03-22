/**
 * 公共的apiEzview数据服务
 */
import axios from './ajax';
import Global from 'utils/global';

/**
 简易查询调用的接口
 * @name fnSimpleSearch
 * @params null
 */
export const fnSimpleSearch = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/simple', 'post', params);
};

/**
 * 复合查询调用的接口
 * @name fnComplexSearch
 * @params null
 */
export const fnComplexSearch = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/composite', 'post', params);
};

/**
 * RRID查询调用的接口
 * @param params
 * @returns {*}
 */
export const fnRFIDSearch = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/rfid', 'post', params);
};

/**
 * 卡口、RFID 融合查询
 * @param params
 * @returns {*}
 */
export const fnRFIDfuseSearch = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/fuse', 'post', params);
};

/**
 * @name getUserSbfz
 * @params null
 * 查询分组树（会根据用户权限）
 */
export const getUserSbfz = (groupType, params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/user/deviceGroup/${groupType}`, 'get', params);
};

/**
 * @name getUserSbfzSb
 * @params null
 * 查询分组内设备
 */
export const getUserSbfzSb = (groupId, params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/user/deviceGroup/device/${groupId}`, 'get', params);
};

/**
 * @name getAllDevices
 * @params null
 * 获取分组内所有设备
 */
export const getAllDevices = (groupId, params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/user/deviceGroup/device/${groupId}`, 'get', params);
};

/**
 * @name getUserSbfzSbStatistical
 * @params null
 * 根据设备分组Id查询分组设备统计数据
 */
export const getUserSbfzSbStatistical = (groupType, params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/user/deviceGroup/${groupType}/statistical`, 'get', params);
};

/**
 * @name deviceSearch
 * @params null
 * 搜索设备
 */
export const deviceSearch = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/device', 'get', params);
};

/**
 * @name userFzlxStatistical
 * @params null
 * 根据分组类型获取统计数据
 */
export const userFzlxStatistical = (groupType, params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/user/groupType/${groupType}/statistical`, 'get', params);
};

/**
 * @name tollgateInit
 * @params null
 */
export const tollgateInit = (userId) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/tollgate/page-info/${userId}`, 'get');
};

/**
 * @name collectList
 * 收藏夹列表
 * @params null
 */
export const collectList = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgateFavorite/favorite', 'get', params);
};

/**
 * @name addCollect
 * 添加收藏
 * @params null
 */
export const addCollect = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgateFavorite/favorite', 'post', params);
};

/**
 * @name deleteCollect
 * 删除收藏
 * @params null
 */
export const deleteCollect = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgateFavorite', 'delete', params);
};

/**
 * 订阅实时过车 websocket
 * @name subscribeWebsocket
 * @params null
 */
export const subscribeWebsocket = (deviceId, userId) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/tollgate-real-time/cars/${userId}/${deviceId}`, 'get');
};

/**
 * 取消订阅全部设备
 * @name cancelAllSubscribe
 * @params null
 */
export const cancelAllSubscribe = (userId) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/tollgate-real-time/subscribe/${userId}`, 'delete');
};

/**
 * 取消订阅某个设备
 * @name cancelSubscribe
 * @params null
 */
export const cancelSubscribe = (userId, deviceId) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/tollgate-real-time/subscribe/${userId}/${deviceId}`, 'delete');
};

/**
 * @name getTarck
 * @params null
 */
export const getTarck = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/vehicle-traces', 'get', params);
};

/**
 * 导入号牌规则
 * @name uploadPlateRule
 * @params null
 */
export const uploadPlateRule = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/plate-rule', 'post', params);
};

/**
 * 筛选， 本页数据下载功能
 * @name downloadBySelected
 * @params null
 */
export const downloadBySelected = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/download-by-selected', 'get', params);
};

/**
 * 全部数据下载功能
 * @name downloadAll
 * @params null
 */
export const downloadAll = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/download-all', 'post', params);
};

/**
 * 下载文件
 * @name downloadFile
 * @params null
 */
export const downloadFile = (params) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + '/tollgate/download', 'get', params);
};

/**
 * 取消下载文件
 * @name cancleDownload
 * @params null
 */
export const cancleDownload = (userId) => {
	return axios.ajax4UserMgt(Global.getBaseUrl() + `/tollgate/cancel-download/${userId}`, 'get');
};

/**
 * 车档基本信息检索检索服务
 */
export const getVehicleFilesInfo = (params) => {
	return axios.ajaxHaiYan('/service/vehicle-info/vehicle-file', 'post', params);
};
/**
 * 驾驶员信息查询
 * @param {*} params
 */
export const getVehicleDriverInfo = (params) => {
	return axios.ajaxHaiYan('/service/vehicle-info/driver', 'post', params);
};
/**
 * 违法记录查询
 * @param {*} params
 */
export const getVehicleViolation = (params) => {
	return axios.ajaxHaiYan('/service/vehicle-info/violation', 'post', params);
};

/**
 * 事故记录查询
 * @param params
 * @returns {*}
 */
export const getVehicleAccident = (params) => {
	return axios.ajaxHaiYan('/service/vehicle-info/accident-base', 'post', params);
};

/**
 * @name getTree
 */
export const getTree = () => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/department/tree', 'get');
};

// 获取所有人员
export const getAllPersonApi = (params) => {
	return axios.ajax4UserMgt(Global.getCloudRbacUrl() + '/user', 'get', params);
};

