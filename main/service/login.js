import axios from 'utils/ajax';
import Global from 'utils/global';

export const loginApi = (params) => {
	return axios.ajax(Global.getBaseUrl() + '/oauth2/password', 'post', params, true);
};

export const logoutApi = () => {
	return axios.ajax(Global.getBaseUrl() + '/oauth2/logout', 'get');
};

export const getUserMsg = (params) => {
	return axios.ajax(Global.getCloudRbacUrl() + '/authority/me', 'get', params); // prod
};
/**
 * 获取个人主页配置
* @name updateHomePage
* @params null
*/
export const getHomePage = () => {
	return axios.ajax(Global.getBaseUrl() + '/system/homePage', 'get');
};