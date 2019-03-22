import Constants from 'utils/constants';
import CryptoJS from 'crypto-js';
import Global from 'utils/global';
import { Message } from 'kfront-baseui';
let util = {};

util.isWindowMap = function () {
	return location.href.indexOf('#/map') >= 0 || location.href.indexOf('#/welcome/map') >= 0;
};

util.isOpenedWindow = function () {
	if (!window.menubar.visible) { //window open 弹出框
		return true;
	}else{
		let isChromeExtensionWindow = this.isChromeExtensionWindow();
		if (isChromeExtensionWindow) { //插件弹出框
			return true;
		} else {
			return false;
		}
	}
};

util.isEmpty = function (value) {
	if (value === undefined || value === null || value === 'null' || value === '' || value.length <= 0) {
		return true;
	} else {
		return false;
	}
};
util.getHost = function () {
	let pathname = location.pathname.split('/');
	pathname.splice(pathname.length - 1, 1);
	let str = pathname.join('/');
	let baseUrl = location.protocol + '//' + location.host + str;
	console.log('getBaseUrl>>>', baseUrl);
	return baseUrl;
};

util.getFullUrl = function (url) {
	let fullUrl = '';
	if(url.indexOf('http') == 0){
		fullUrl = url;
	}else if(this.getHost().indexOf(Global.getContentPath()) < 0){
		fullUrl = this.getHost() + Global.getContentPath() + url;
	}else{
		fullUrl = this.getHost() + url;
	}
	return fullUrl;
};

util.openWindows = function(windows){
	var appId = Global.getAppName();
	if(this.isInstalledChromeExtension()){
		let windowArray = [];
		windows.forEach(win => {
			let url = '';
			if(win.windowId === Constants.WIN_LOGIN){
				appId = Constants.WIN_LOGIN;
			}
			if(this.getHost().indexOf(Global.getContentPath()) < 0){
				url = this.getHost() + Global.getContentPath() + win.url;
			}else{
				url = this.getHost() + win.url;
			}
			let window = {
				windowId: win.windowId,
				windowState: {state: 'fullscreen'},
				isPrimary: win.primary,
				params: {
					url: url,
					left: 0,
					top: 0,
					type: 'popup'
				}
			};
			windowArray.push(window);
		});
		let winParams = {
			action: Constants.CRX_EVENT_OPEN_WINDOWS,
			appId: appId,
			windowArray: windowArray
		};
		console.log('winParams>>>', winParams);
		let event = document.createEvent('CustomEvent');
		event.initCustomEvent(Constants.CRX_EVENT_OPEN_WINDOWS, false, false, winParams);
		document.dispatchEvent(event);
	}else{
		windows.forEach(win => {
			this.openWindow(win.windowId);
		});
	}
};
util.switchWindow = function(windowId){
	console.log('switchWindow>>>', window);
	if(this.isInstalledChromeExtension()){
		let winParams = {
			action: Constants.CRX_EVENT_SWITCH_WINDOWS,
			appId: Global.getAppName(),
			windowId: windowId
		};
		let event = document.createEvent('CustomEvent');
		event.initCustomEvent(Constants.CRX_EVENT_SWITCH_WINDOWS, false, false, winParams);
		document.dispatchEvent(event);
	}else{
		this.openWindow(windowId);
	}
};

util.openWindow = function (windowId) {
	let mixW = window.screen.availWidth;
	let mixH = window.screen.availHeight - 50;

	if (windowId === Constants.WIN_LOGIN) {
		let app = window.open(Global.getContentPath() + Constants.HOME_PAGE_LOGIN, Constants.WIN_LOGIN, `width=${mixW}px, height=${mixH}px, top=0, left=0`);
		window[windowId] = app;
	}else {
		let windows = Global.getWindows();
		for (let i = 0; i < windows.length; i++) {
			if (windows[i].windowId == windowId) {
				let app = window.open(Global.getContentPath() + windows[i].url, windows[i].windowId, `width=${mixW}px, height=${mixH}px, top=0, left=0`);
				window[windowId] = app;
			}
		}
	}
};

util.isWindowClosed = function (callback) {
	let result = false;
	setTimeout(function () {
		console.log('window>>>', window);
		let windows = Global.getWindows();
		windows.forEach(win => {
			if(window[win.windowId] && window[win.windowId].closed){
				result = true;
			}
		});
		callback(result);
	}, 1000);
};
util.getTheme = function(){
	let theme = localStorage.getItem(Constants.THEME);
	if(!theme){
		theme = Constants.THEME_LIGHT;
	}
	if(theme != Constants.THEME_LIGHT && theme != Constants.THEME_DARK){
		theme = Constants.THEME_LIGHT;
	}
	return theme;
};

util.setTheme = function(type){
	localStorage.setItem(Constants.THEME, type);
	console.log('setTheme>>>>', type);
	let importScss = true; // 开发时如果想直接从scss获取样式，可以设置为true
	if(Global.getEnv() === 'development' && importScss){ // 开发环境下可用
		import('static/theme/' + type + '/index.scss');
	}else{
		let styleid = 'kedacom-theme-type';
		let styleTag = document.getElementById(styleid);
		if (!styleTag) {
			styleTag = document.createElement('style');
			styleTag.setAttribute('id', styleid);
			document.head.appendChild(styleTag);
		}
		fetch('./static/theme/' + type + '/lib/index.css').then(function(response){
			response.text().then(function (result) {
				if(Global.getContentPath()){
					result = result.replace(/.\/submodule\//g, './' + Global.getContentPath() + '/submodule/');
					result = result.replace(/.\/main\//g, './' + Global.getContentPath() + '/main/');
				}
				styleTag.innerText = result;
			});
		});
	}
};

util.changeTheme = function(type){
	util.setTheme(type);
};

util.isInstalledChromeExtension = function(){
	let obj = document.getElementById('chromeExt');
	if (typeof obj != 'undefined' && obj != null) {
		return true;
	} else {
		return false;
	}
};

util.isChromeExtensionWindow = function(){
	let windowOuterHeight = window.outerHeight;
	let windowScreenHeight = window.screen.height;
	let windowScreenX = window.screenX;
	console.log('windowOuterHeight>>>', windowOuterHeight);
	console.log('windowScreenHeight>>>', windowScreenHeight);
	console.log('windowScreenX>>>', windowScreenX);
	let isChromeExtensionWindow = sessionStorage.getItem('isChromeExtensionWindow');
	if (isChromeExtensionWindow === 'Y' || (Math.abs(windowOuterHeight - windowScreenHeight) <= 2 && windowScreenX >= 0)) {
		sessionStorage.setItem('isChromeExtensionWindow', 'Y');
		return true;
	} else {
		return false;
	}
};

util.addScript = function (url, callback) {
	var script = document.createElement('script');     // 创建script标签;
	script.type = 'text/javascript';                   // 设置type属性;
	script.src = url;                                  // 引入url;
	document.getElementsByTagName('head')[0].appendChild(script);    // 将script引入<head>中;
	script.onload = function(){
		if(callback){
			callback();
		}
	};
};

util.errorMessage = function (message) {
	Message({
		message: message,
		type: 'error',
		duration: 3000
	});
};

util.encrypt = function (value) {
	return CryptoJS.AES.encrypt(value, Global.getSecretKey()).toString();
};

util.decrypt = function (value) {
	return CryptoJS.AES.decrypt(value, Global.getSecretKey()).toString(CryptoJS.enc.Utf8);
};
export default util;
