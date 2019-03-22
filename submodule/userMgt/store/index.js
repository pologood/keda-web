/**
 * name: store/index.js
 * desc: 应用全局数据
 * author: malixiang
 */
import user from './modules/user';
import administrativeArea from './modules/administrativeArea.js';
import groupManagement from './modules/groupManagement.js';
import organization from './modules/organization.js';
import roleMan from './modules/roleMan.js';
import userMgt from './modules/userMgt.js';

const store = {
	namespaced: true,
	modules: {
		user: user,
		administrativeArea: administrativeArea,
		groupManagement: groupManagement,
		organization: organization,
		roleMan: roleMan,
		userMgt: userMgt
	}
};
export default store;
