import Vue from 'vue';
// import Auth from 'utils/auth';
import Util from 'utils/util';
import Global from 'utils/global';
import VueRouter from 'vue-router';
import LayoutH from '../views/layout/horizontal';
import LayoutV from '../views/layout/vertical';
import subRouter from './subRouter';
import userMgtRouter from 'submodule/userMgt/router';
import exerciseRouter from 'submodule/exercise/router';
var routers = [];

if(Global.isHorizontalLayout()){
	routers.push(...exerciseRouter(LayoutH));
	routers.push(...userMgtRouter(LayoutH));
	routers.push(...subRouter(LayoutH));
}else{
	routers.push(...exerciseRouter(LayoutV));
	routers.push(...userMgtRouter(LayoutV));
	routers.push(...subRouter(LayoutV));
}

Vue.use(VueRouter);
// 路由配置
const RouterConfig = {
	routes: routers
};
const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
	Global.updateWindowUrl(window.name, to.path);
	console.log(Util.getTheme());
	next();
	// console.log('beforeEach>>>JwtToken():' + Auth.getJwtToken() + 'to.name:' + to.name + ',to.path:' + to.path + ',windowId:' + window.name);
	// if (Util.isEmpty(Auth.getJwtToken()) && to.name !== 'login') { // 未登录且前往的页面不是登录页
	// 	Auth.clearJwtToken();
	// 	next({
	// 		name: 'login'// home page
	// 	});
	// }else if (to.name === 'login') { // 前往的页面是登录页
	// 	if(Util.isInstalledChromeExtension() && Util.isChromeExtensionWindow()){
	// 		Auth.clearJwtToken();
	// 	}
	// 	next();
	// } else if(Util.isInstalledChromeExtension() && Global.isPopUp()){ //插件模式下，判断是否是插件窗口，只有插件窗口才可以跳转到其他路由
	// 	let isOpenedWindow = Util.isChromeExtensionWindow();
	// 	if(isOpenedWindow){
	// 		Global.updateWindowUrl(window.name, to.path);
	// 		next();
	// 	}else{
	// 		Auth.clearJwtToken();
	// 		next({
	// 			name: 'login'// home page
	// 		});
	// 	}
	// } else {
	// 	Global.updateWindowUrl(window.name, to.path);
	// 	next();
	// }
});

router.afterEach((to) => {
	// Util.openNewPage(router.app, to.name, to.params, to.query);
	// window.scrollTo(0, 0);
});

export default router;
