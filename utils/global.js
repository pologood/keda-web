import axios from './ajax/config';
import Constants from 'utils/constants';
const config = require('../config');
let global = {};
let baseUrl = '';
let cloudRbacUrl = '';
let ispopup = true;//是否时弹出窗口的模式
let refreshTokenUrl = '';
global.setRefreshTokenUrl = function (value) {
	refreshTokenUrl = value;
};

global.getRefreshTokenUrl = function () {
	return refreshTokenUrl;
};

global.getBaseUrl = function () {
	if(!baseUrl){
		let pathname = location.pathname.split('/');
		console.log('pathname>>>', pathname);
		pathname.splice(pathname.length - 1, 1);
		let str = pathname.join('/');
		baseUrl = location.protocol + '//' + location.host + str;
	}
	return baseUrl;
};

global.setBaseUrl = function (value) {
	baseUrl = value;
};

global.setCloudRbacUrl = function (value) {
	cloudRbacUrl = value;
};

global.getCloudRbacUrl = function () {
	return cloudRbacUrl;
};

global.setWindows = function (windows) {
	windows.forEach(win => {
		if(win.url && win.url.indexOf('#') < 0){
			win.url = '/#' + win.url;
		}
	});
	localStorage.setItem(Constants.STORAGE_KEY_WINDOWS, JSON.stringify(windows));
};

global.getWindows = function () {
	let windows = JSON.parse(localStorage.getItem(Constants.STORAGE_KEY_WINDOWS));
	if(!windows){
		windows = [];
	}
	if(windows.length > 0){
		return windows;
	}else{
		return [{
			'windowId': 'primary',
			'primary': true,
			'url': '/#/welcome/page1'
		}];
	}
};

global.updateWindowUrl = function (windowId, url) {
	let windows = global.getWindows();
	windows.forEach(win => {
		if(win.windowId === windowId){
			if(url && url.indexOf('#') < 0){
				win.url = '/#' + url;
			}else{
				win.url = url;
			}
		}
	});
	global.setWindows(windows);
	console.log('updateWindowUrl result>>>', windows);
};

global.isHorizontalLayout = function () {
	let layout = 'H';// h horizontal V vertical
	if(config.app && config.app.layout){
		layout = config.app.layout;
	}
	return layout === 'H';
};

global.getAppName = function () {
	let appName = 'kiaf';
	if(config.app && config.app.name){
		appName = config.app.name;
	}
	return appName;
};

global.getContentPath = function () {
	let contentPath = '';
	if(this.getEnv() !== 'development' && config.app && config.app.contentPath){
		contentPath = config.app.contentPath;
	}
	return contentPath;
};

global.isPopUp = function () {
	return ispopup === 'Y';
};

global.setPopUp = function (value) {
	ispopup = value;
};
let clientSign = '';
global.getClientSign = function () {
	return clientSign;
};

global.setClientSign = function (value) {
	clientSign = value;
};

global.getEnv = function () {
	let env = 'development';
	if(process.env.NODE_ENV){
		env = process.env.NODE_ENV;
	}
	return env;
};

let secretKey = '';
global.setSecretKey = function (value) {
	secretKey = value;
};

global.getSecretKey = function () {
	if(secretKey){
		return secretKey;
	}else{
		return 'kedacom';
	}
};

let menu = [];
global.setMenu = function (value) {
	if(Array.isArray(value)){
		menu = value;
	}
};

global.getMenu = function () {
	return menu;
};

global.init = function () {
	return new Promise((resolve, reject) => {
		let env = this.getEnv();
		axios.get(`static/config/global-${env}.json`).then((res) => {
			let params = res.data;
			if(params['CLOUD_RBAC_URL']){
				this.setCloudRbacUrl(params['CLOUD_RBAC_URL']);
			}
			if(params['BASE_URL']){
				this.setBaseUrl(params['BASE_URL']);
			}
			if(params['REFRESH_TOKEN_URL']){
				this.setRefreshTokenUrl(params['REFRESH_TOKEN_URL']);
			}
			if(params['WINDOWS']){
				this.setWindows(params['WINDOWS']);
			}
			if(params['POPUP']){
				this.setPopUp(params['POPUP']);
			}
			if(params['CLIENT_SIGN']){
				this.setClientSign(params['CLIENT_SIGN']);
			}
			if(params['SECRET_KEY']){
				this.setSecretKey(params['SECRET_KEY']);
			}
			if(params['MENU']){
				this.setMenu(params['MENU']);
			}
			if(params['AJAX']){
				axios.setConfig(params['AJAX']);
			}else{
				axios.setConfig(params, true);
			}
			resolve(true);
		}).catch((err) => {
			console.error('global init err', err);
			reject(true);
		});
	});
};

export default global;
