import myUtil from '../../utils/myUtil';
const main = {
	state: {
		sidebar: {
			opened: !+myUtil.getSidebarStatus(),
			withoutAnimation: false
		},
		menuData: '',
		menuActiveIndex: '',
		breadCrumbList: [],
		tagList: []//顶部标签页
	},
	mutations: {
		MAIN_TOGGLE_SIDEBAR: state => {
			if (state.sidebar.opened) {
				myUtil.setSidebarStatus(1);
			} else {
				myUtil.setSidebarStatus(0);
			}
			state.sidebar.opened = !state.sidebar.opened;
			state.sidebar.withoutAnimation = false;
		},
		MAIN_CLOSE_SIDEBAR: (state, withoutAnimation) => {
			myUtil.setSidebarStatus(1);
			state.sidebar.opened = false;
			state.sidebar.withoutAnimation = withoutAnimation;
		},
		MAIN_TOGGLE_DEVICE: (state, device) => {
			state.device = device;
		},
		MAIN_SET_MENUDATA: (state, menuData) => {
			state.menuData = menuData;
		},
		MAIN_SET_BREADCRUMB: (state, menuData) => {
			state.breadCrumbList = menuData;
		},
		MAIN_SET_TAGLIST: (state, tagList) => {
			state.tagList = tagList;
		},
		MAIN_SET_MENUACTIVEINDEX: (state, menuActiveIndex) => {
			state.menuActiveIndex = menuActiveIndex;
		}
	},
	actions: {
		mainToggleSideBar({commit}) {
			commit('MAIN_TOGGLE_SIDEBAR');
		},
		mainCloseSideBar({commit}, {withoutAnimation}) {
			commit('MAIN_CLOSE_SIDEBAR', withoutAnimation);
		},
		mainToggleDevice({commit}, device) {
			commit('MAIN_TOGGLE_DEVICE', device);
		},
		mainSetLanguage({commit}, language) {
			commit('SET_LANGUAGE', language);
		}
	}
};

export default main;
