import { findTest } from '../../service/testMgt.js';

const test = {
	state: {
		testcol: ''
	},

	mutations: {
		SET_TESTCOL: (state, testcol) => {
			state.testcol = testcol;
		}
	},

	actions: {
		// 获取Test信息
		GetTestInfo({ commit }, id) {
			return new Promise((resolve, reject) => {
				findTest(id).then(response => {
					const data = response.result;
					commit('SET_TESTCOL', data.testcol);
					resolve(response);
				}).catch(error => {
					reject(error);
				});
			});
		}
	}
};

export default test;
