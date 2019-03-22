import Util from './util';
import Global from './global';
import Constants from './constants';
let auth = {};
auth.setUserInfo = function(userInfo){
	try{
		localStorage.setItem(Constants.STORAGE_KEY_USER_INFO, JSON.stringify(userInfo));
	}catch (e) {
		localStorage.setItem(Constants.STORAGE_KEY_USER_INFO, JSON.stringify({}));
	}
};

auth.getUserInfo = function() {
	try{
		let userInfo = JSON.parse(localStorage.getItem(Constants.STORAGE_KEY_USER_INFO));
		if (userInfo) {
			return userInfo;
		} else {
			return {};
		}
	}catch (e) {
		return {};
	}
};

auth.clearStorage = function() {
	let username = auth.getUserInfo().username;
	let password = auth.getUserInfo().password;
	let flag = auth.getRememberUser();
	let theme = Util.getTheme();
	localStorage.clear();
	if (flag) {
		auth.setUserInfo({username: username, password: password});
		auth.setRememberUser(flag);
	}
	Util.setTheme(theme);
};

auth.clearJwtToken = function() {
	if(Global.isPopUp()){
		localStorage.removeItem(Constants.STORAGE_KEY_JWT_TOKEN);
		localStorage.removeItem(Constants.STORAGE_KEY_REFRESH_TOKEN);
	}else{
		sessionStorage.removeItem(Constants.STORAGE_KEY_JWT_TOKEN);
		sessionStorage.removeItem(Constants.STORAGE_KEY_REFRESH_TOKEN);
	}
};

auth.setRememberUser = function(flag) {
	console.log('setRememberUser>>>', flag);
	if (flag) {
		localStorage.setItem(Constants.STORAGE_KEY_REMEMBER_ME, 'Y');
	} else {
		localStorage.setItem(Constants.STORAGE_KEY_REMEMBER_ME, 'N');
	}
};

auth.getRememberUser = function() {
	let flag = localStorage.getItem(Constants.STORAGE_KEY_REMEMBER_ME);
	console.log('getRememberUser>>>', flag);
	if (flag === 'Y') {
		return true;
	} else {
		return false;
	}
};
auth.getJwtToken = function() {
	let token = '';
	if(Global.isPopUp()){
		token = localStorage.getItem(Constants.STORAGE_KEY_JWT_TOKEN);
	}else{
		token = sessionStorage.getItem(Constants.STORAGE_KEY_JWT_TOKEN);
	}
	if (Util.isEmpty(token)) {
		token = '';
	}
	return token;
};

auth.setJwtToken = function(token) {
	if(Global.isPopUp()){
		localStorage.setItem(Constants.STORAGE_KEY_JWT_TOKEN, token);
	}else{
		sessionStorage.setItem(Constants.STORAGE_KEY_JWT_TOKEN, token);
	}
};

auth.setRefreshToken = function(token) {
	if(Global.isPopUp()){
		localStorage.setItem(Constants.STORAGE_KEY_REFRESH_TOKEN, token);
	}else{
		sessionStorage.setItem(Constants.STORAGE_KEY_REFRESH_TOKEN, token);
	}
};

auth.getRefreshToken = function() {
	let token = '';
	if(Global.isPopUp()){
		token = localStorage.getItem(Constants.STORAGE_KEY_REFRESH_TOKEN);
	}else{
		token = sessionStorage.getItem(Constants.STORAGE_KEY_REFRESH_TOKEN);
	}
	if (Util.isEmpty(token)) {
		token = '';
	}
	return token;
};

auth.exit = function() {
	if(Global.isPopUp()){
		Util.openWindows([{
			windowId: Constants.WIN_LOGIN,
			url: Constants.HOME_PAGE_LOGIN
		}]);
		if(Util.isInstalledChromeExtension()){
			let windows = Global.getWindows();
			for(let i = 0; i < windows.length; i++){
				let winParams = {
					action: 'closeWindow',
					appId: Global.getAppName(),
					closeWindowId: windows[i].windowId
				};
				let event = document.createEvent('CustomEvent');
				event.initCustomEvent('closeWindow', false, false, winParams);
				document.dispatchEvent(event);
			}
		}else{
			window.close();
		}
	}else{
		auth.clearJwtToken();
		location.href = Util.getFullUrl(Constants.HOME_PAGE_LOGIN);
	}
};

export default auth;
