import axios from 'utils/ajax/config';
let myGlobal = {};
let signMenuGis = '';
let signMenuBusiness = '';
let deviceTypes = '';
let keySignMenu = 'sign_menu';
let defaultPass = '';
myGlobal.setSignMenuGIS = function (value) {
	signMenuGis = value;
};

myGlobal.getSignMenuGIS = function () {
	return signMenuGis;
};

myGlobal.setSignMenuBusiness = function (value) {
	signMenuBusiness = value;
};

myGlobal.getSignMenuBusiness = function () {
	return signMenuBusiness;
};
myGlobal.setDevicetypes = function (value) {
	deviceTypes = value;
};

myGlobal.getDevicetypes = function () {
	return deviceTypes;
};

myGlobal.setSignMenu = function (value) {
	sessionStorage.setItem(keySignMenu, value);
};

myGlobal.getSignMenu = function () {
	return sessionStorage.getItem(keySignMenu);
};
myGlobal.setDefaultPass = function (value) {
	defaultPass = value;
};

myGlobal.getDefaultPass = function () {
	return defaultPass;
};
myGlobal.init = function () {
	return new Promise((resolve, reject) => {
		axios.get('submodule/userMgt/assets/config/global.json').then((res) => {
			let params = res.data;
			if(params['sign_menu_gis']){
				this.setSignMenuGIS(params['sign_menu_gis']);
			}
			if(params['sign_menu_business']){
				this.setSignMenuBusiness(params['sign_menu_business']);
			}
			if(params['groupServiceList']){
				this.setDevicetypes(params['groupServiceList']);
			}
			if(params[keySignMenu]){
				this.setSignMenu(params[keySignMenu]);
			}
			if(params['default_pass']){
				this.setDefaultPass(params['default_pass']);
			}
			resolve(true);
		}).catch((err) => {
			console.error('myGlobal init err', err);
			reject(true);
		});
	});
};

export default myGlobal;
