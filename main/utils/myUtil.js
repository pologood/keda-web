import myConstants from './myConstants';
let util = {};

util.getSidebarStatus = function(){
	let result = localStorage.getItem(myConstants.STORAGE_KEY_SIDEBAR_STATUS);
	if(result){
		return parseInt(result);
	}else{
		return 0;
	}
};
util.setSidebarStatus = function(sidebarStatus){
	return localStorage.setItem(myConstants.STORAGE_KEY_SIDEBAR_STATUS, sidebarStatus);
};
export default util;
