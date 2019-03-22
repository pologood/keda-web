/**
 * 菜单数据服务
 */
import axios from './ajax';
import Global from 'utils/global';
import myGlobal from '../utils/myGlobal';

export const menuApi = (params) => {
	return new Promise((resolve, reject) => {
		axios.ajax(Global.getBaseUrl() + '/resource/resources_tree_me?sorts[0].name=sortIndex&sorts[0].order=ASC', 'get', params).then(ret => {
			let result = [];
			console.log(ret, 'ret');
			ret.forEach(item => {
				if (item.sign == myGlobal.getSignMenu()) {
					console.log(item.children, '用户权限的菜单资源');
					result = item.children;
				}
			});
			resolve(result);
		}).catch(error => {
			reject(error);
		});
	});
};
