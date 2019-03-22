// app入口文件
// 初始化 路由、样式、语言、store、全局配置global.json
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import Util from 'utils/util';
import Global from 'utils/global';
import myGlobal from './utils/myGlobal';
import KFront from 'kfront-baseui';
import axios from 'axios';
import './assets/iconfont/iconfont.css';
import 'kfront-baseui/css/index.css';
import 'submodule/userMgt/main.js';
import 'submodule/exercise/main.js';

// 使用羌云浩封装好的树
import kdTreeGroup from 'kd-tree-group';

Vue.use(KFront);
Vue.config.productionTip = false;

Util.setTheme(Util.getTheme());
myGlobal.init();
Global.init().then(async (res) => {
	// 给设备树传入设备类型json和设备树的请求url
	let deviceConfig = await axios.get('./static/config/device-group.json');
	Vue.use(kdTreeGroup, {
		axiosConfig: {
			baseURL: Global.getBaseUrl()
		},
		deviceServiceList: deviceConfig.data.deviceServiceList
	});
	/* eslint-disable no-new */
	new Vue({
		el: '#app',
		router,
		store,
		template: '<App/>',
		components: {App}
	});
}).catch((err) => {
	window.alert('global init err' + err);
});



