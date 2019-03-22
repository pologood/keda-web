import axios from 'utils/ajax';
import Global from 'utils/global';
export const userInfoApi = (params) => {
	return axios.ajax(Global.getCloudRbacUrl() + '/authority/me', 'get', params);
};
export const changePasswordApi = (params) => {
	return axios.ajax(Global.getCloudRbacUrl() + '/user/password', 'put', params);
};

export const updateHomePage = (params) => {
	return axios.ajax(Global.getBaseUrl() + '/system/homePage', 'post', params);
};
export const getLocalAddr = (params) => {
	return axios.ajax(Global.getBaseUrl() + '/common/info/ip', 'get', params);
};
// 读取配置,是否增加水印
export const getAddWatermark = (params) => {
	return axios.ajax(Global.getBaseUrl() + '/system/conf/mange/query/systemConfigurationManagement?page=1&size=10&configurationItemCode=watermark', 'get', params);
};
