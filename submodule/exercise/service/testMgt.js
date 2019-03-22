/**
 * 公共的ajax数据服务
 */
import axios from './ajax';
// import Global from 'utils/global';
import myGlobal from '../utils/myGlobal';

export const findTest = (id) => {
	return axios.ajax4exercise(myGlobal.getExerciseBaseUrl() + '/web/test/' + id, 'get');
};

