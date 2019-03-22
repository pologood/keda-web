import axios from 'axios';
import Auth from 'utils/auth';
import Util from 'utils/util';
import Global from 'utils/global';

var refreshToken = function(resolve, reject, config, catchReject){
	var headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	console.log('headers>>>', JSON.stringify(headers));
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
		console.log('refreshToken>>>', response);
		// 请求接口正确且成功时
		if (response.data.status === 200) {
			let ret = response.data ? response.data : response;
			if(ret.result && ret.result.jwt_token){
				Auth.setJwtToken(ret.result.jwt_token);
			}
			if(ret.result && ret.result.refresh_token){
				Auth.setRefreshToken(ret.result.refresh_token);
			}
			httpRequest(resolve, reject, config, catchReject, true);
		}else{
			if(catchReject){
				reject(response.data);
			}else{
				Util.errorMessage(response.data.message || '系统异常, 请求失败~~~');
			}
		}
	})
		.catch(error => {
			if(catchReject){
				reject(error);
			}else{
				Util.errorMessage('网络异常, 请求失败~~~');
				reject(error);
			}
		});
};
var httpRequest = function(resolve, reject, config, catchReject, isRetry) {
	if(Auth.getJwtToken() && isRetry){
		config.headers['jwt-token'] = Auth.getJwtToken();
	}
	axios(config)
		.then(response => {
			// 请求接口正确且成功时
			console.log('httpRequest result>>>', response);
			if (response.data.status === 200) {
				resolve(response.data);
			} else if((response.data.status === 10014 || response.data.status === 10013) && response.data.code == '-1') { //10013 错误的JWT 10014 jwt过期 10015 JWT为空
				if(!isRetry){ // jwtoken 过期只retry一次
					refreshToken(resolve, reject, config, catchReject);
				}else{
					if(catchReject){
						reject(response.data);
					}else{
						Auth.exit();
					}
				}
			}else if (response.data.status === 401 || response.data.code === 401) { // session 过期
				Auth.exit();
			} else {
				// 非正常错误
					// 请求接口错误或不成功时
				if(catchReject){
					reject(response.data);
				}else{
					Util.errorMessage(response.data.message || '系统异常, 请求失败~~~');
					resolve(response.data);
				}
			}
		})
		.catch(error => {
			if(catchReject){
				reject(error);
			}else{
				Util.errorMessage('网络异常, 请求失败~~~');
				reject(error);
			}
		});
};
axios.ajax4exercise = function ajax(
	url,
	method,
	params,
	form = false,
	catchReject = false
) {
	return new Promise((resolve, reject) => {
		let config = null;
		if (form) {
			config = {
				url: url,
				cache: false,
				method: method,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',

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
			if(Auth.getJwtToken()){
				console.log('Auth.getJwtToken()>>>>>>>' + Auth.getJwtToken());
				config.headers['jwt-token'] = Auth.getJwtToken();
			}
		}
		if (method && method.toLowerCase() === 'get') {
			config.params = params;
		} else {
			config.data = params;
		}
		httpRequest(resolve, reject, config, catchReject);
	});
};

// 登录的时候要form表单提交请求中多了form参数，关于权限的要请求权限的服务器地址多了authorityService参数
export default axios;
