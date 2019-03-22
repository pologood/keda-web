import Vue from 'vue';
import Vuex from 'vuex';
import main from './modules/app';
import userMgtStore from 'submodule/userMgt/store';
import exerciseStore from 'submodule/exercise/store';

Vue.use(Vuex);
const store = new Vuex.Store({
	namespaced: true,
	modules: {
		exerciseStore,
		userMgtStore,
		main
	}
});
export default store;
