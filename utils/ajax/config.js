import axios from 'axios';

// 开发环境
axios.setConfig = function (config) {
	// axios.defaults.baseURL = config.BASE_URL;
	axios.defaults.timeout = config.AJAX_TIMEOUT;
	// 解决跨域时丢失 cookie 问题,设置请求超时时间
	axios.defaults.withCredentials = true;
};

export default axios;
