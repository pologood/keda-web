/*
appname+'_'作为state，mutations，actions and getters的命名的前缀，
mutations建议大写
 */
const history = {
	state: {
		app01_history_list: []
	},
	mutations: {
		USERMGT_APP01_ADD_HISTORY: (state, result) => {
			state.app01_history_list.push(result);
		},
		USERMGT_APP01_CLEAR_HISTORY: (state, result) => {
			state.app01_history_list = [];
		}
	},
	getters: {
		app01_history_list (state) {
			return state.app01_history_list;
		}
	}
};

export default history;
