import axios from './config';
import Auth from 'utils/auth';
import Util from 'utils/util';
import Global from 'utils/global';

var refreshToken = function (resolve, reject, config) {
	var headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	let refreshConfig = {
		url: Global.getRefreshTokenUrl(),
		method: 'post',
		headers: headers,
		data: {
			refreshToken: Auth.getRefreshToken()
		}
	};
	refreshConfig.transformRequest = [function (data) {
		let ret = '';
		for (let it in data) {
			ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
		}
		return ret;
	}];
	axios(refreshConfig).then(response => {
		console.log('refreshToken>>>', JSON.stringify(response));
		// 请求接口正确且成功时
		if (response.data.status === 200) {
			let result = response.data.result ? response.data.result : response.data;
			if (result.jwt_token) {
				Auth.setJwtToken(result.jwt_token);
			}
			if (result && result.refresh_token) {
				Auth.setRefreshToken(result.refresh_token);
			}
			httpRequest(resolve, reject, config, true);
		} else {
			resolve(response.data);
			Util.errorMessage(response.data.message || '系统异常, 请求失败~~~');
		}
	}).catch(error => {
		reject(error);
		Util.errorMessage('网络异常, 请求失败~~~');
	});
};
var httpRequest = function (resolve, reject, config, isRetry) {
	if(Auth.getJwtToken() && isRetry){
		config.headers['jwt-token'] = Auth.getJwtToken();
	}
	axios(config)
		.then(response => {
			// 请求接口正确且成功时
			if (response.data.status === 200) {
				resolve(response.data.result ? response.data.result : response.data);
			} else if ((response.data.status === 10014 || response.data.status === 10013) && response.data.code == '-1') { // 10013 错误的JWT 10014 jwt过期 10015 JWT为空
				if (!isRetry) { // jwtoken 过期只retry一次
					refreshToken(resolve, reject, config);
				} else {
					Auth.exit();
				}
			} else if (response.data.status === 401 || response.data.code === 401) { // session 过期
				Auth.exit();
			} else {
				// 请求接口错误或不成功时
				resolve(response.data.result ? response.data.result : response.data);
			}
		}).catch(error => {
		reject(error);
		Util.errorMessage('网络异常, 请求失败~~~');
	});
};

axios.ajax = function ajax (url, method, params, form = false) {
	return new Promise((resolve, reject) => {
		let config = null;
		if (form) {
			config = {
				url: url,
				method: method,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			};
			config.transformRequest = [
				function (data) {
					let ret = '';
					for (let it in data) {
						ret +=
							encodeURIComponent(it) +
							'=' +
							encodeURIComponent(data[it]) +
							'&';
					}
					return ret;
				}
			];
		} else {
			config = {
				url: url,
				method: method
			};
			config.headers = {
				'Content-type': 'application/json;charset=utf-8'
			};
			if (Auth.getJwtToken()) {
				config.headers['jwt-token'] = Auth.getJwtToken();
			}
		}
		if (method && method.toLowerCase() === 'get') {
			config.params = params;
		} else {
			config.data = params;
		}
		httpRequest(resolve, reject, config);
	});
};

// 登录的时候要form表单提交请求中多了form参数，关于权限的要请求权限的服务器地址多了authorityService参数
export default axios;
