/**
 * name: store/index.js
 * desc: 应用全局数据
 * author: malixiang
 */
import test from './modules/test';
import getters from './getters';

const store = {
	modules: {
		test
	},
	getters
};
export default store;
