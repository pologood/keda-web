const store = {
	state: {
		organizationOptionName: '组织机构详情'
	},
	mutations: {
		UPDATE_ORGANIZATION_OPTION_NAME (state, optionName){
			state.organizationOptionName = optionName;
		}
	},
	actions: {
	}
};
export default store;
