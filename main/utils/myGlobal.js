import axios from 'utils/ajax/config';
let myGlobal = {};
let keySignMenu = 'sign_menu';
myGlobal.setSignMenu = function (value) {
	sessionStorage.setItem(keySignMenu, value);
};

myGlobal.getSignMenu = function () {
	return sessionStorage.getItem(keySignMenu);
};

myGlobal.init = function () {
	return new Promise((resolve, reject) => {
		axios.get('main/assets/config/global.json').then((res) => {
			let params = res.data;
			if(params[keySignMenu]){
				this.setSignMenu(params[keySignMenu]);
			}
			resolve(true);
		}).catch((err) => {
			console.error('myGlobal init err', err);
			reject(true);
		});
	});
};

export default myGlobal;
