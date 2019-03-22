<template>
<div class="main-layout-horizontal-box">
	<div v-if="isWindowMain" class="navbar">
		<kc-menu
			:default-active="activeIndex"
			mode="horizontal"
			@select="handleSelect"
			text-color="#Dee9ff"
			active-text-color="#ffffff">
     		 <!-- 一级菜单没有有子节点的情况 -->
      		<template v-for="child1 in menuData">
        		<kc-menu-item :index="child1.id" :key="child1.id" v-if="!child1.children">
          			<span slot="title">{{ child1.title }}</span>
        		</kc-menu-item>
      			<!-- 一级菜单有子节点的情况 -->
				<kc-submenu :index="child1.id" :key="child1.id" v-if="child1.children" :showTimeout=10 :hideTimeout=10>
				  <!-- 二级菜单没有子节点的情况 -->
					<template slot="title" v-if="child1.children">
						<span slot="title">{{ child1.title }}</span>
					</template>
					<template v-for="child2 in child1.children">
						<kc-menu-item :index="child2.id" :key="child2.id" v-if="!child2.children">{{ child2.title }}</kc-menu-item>
					</template>
				  <!-- 二级菜单有子节点的情况 -->
				    <template v-for="child2 in child1.children">
					  <kc-submenu  :index="child2.id" :key="child2.id" v-if="child2.children">
					    <template slot="title">
						  <span slot="title">{{ child2.title }}</span>
					    </template>
					   <!-- 判断是否为三级菜单 -->
					    <template v-for="child3 in child2.children">
						  <kc-menu-item :index="child3.id" :key="child3.id">{{ child3.title }}</kc-menu-item>
					   </template>
					 </kc-submenu>
				  </template>
				</kc-submenu>
			</template>
		</kc-menu>
		<div class="icon-change-window">
			<div class="switch-button" @click="switchWindow(false)" v-if="showSwitch">
				<span>地图屏</span>
			</div>
			<person-center @updateHomePage="updateHomePage"></person-center>
		</div>
	</div>
	<div v-else-if="isWindowMap" class="navbar">
		<div class="logo">
			<span>地图展示</span>
		</div>
		<div class="icon-change-window">
			<div class="switch-button" @click="switchWindow(true)"  v-if="showSwitch">
				<span>业务屏</span>
			</div>
			<person-center @updateHomePage="updateHomePage"></person-center>
		</div>
	</div>
	<kc-modal
		title="个人设置"
		:visible.sync="dialogVisible"
		class="person-setting"
		>
		<person-setting></person-setting>
	</kc-modal>
	<kc-modal
		title="换肤"
		:visible.sync="themeVisible"
		class="person-setting"
		>
		<change-theme></change-theme>
	</kc-modal>

</div>
</template>

<script>
	import Util from 'utils/util';
	import Global from 'utils/global';
	import Constants from 'utils/constants';
	import {postMessage, onMessage} from 'utils/event-bus';
	import PersonCenter from '../../../components/PersonCenter/index.vue';
	import PersonSetting from '../../../components/PersonSetting/index.vue';
	import ChangeTheme from '../../../components/ChangeTheme/index.vue';
	import TagsView from '../../../components/TagsView/index.vue';
	import { menuApi } from '../../../service/menu.js';
	import {kdFrameset, kdFrame} from '@kd-components/kd-frameset';
	export default {
		name: 'NavBar',
		components: {
			PersonCenter,
			PersonSetting,
			ChangeTheme,
			TagsView,
			kdFrameset,
			kdFrame
		},
		data() {
			return {
				dialogVisible: false,
				themeVisible: false,
				menuData: [],
				activedMenu: {}
			};
		},
		computed: {
			isWindowMain(){
				let isWindowMain = !Util.isWindowMap();
				return isWindowMain;
			},
			isWindowMap(){
				let isWindowMap = Util.isWindowMap();
				return isWindowMap;
			},
			showSwitch(){
				return Global.getWindows().length == 2;
			},
			tagList(){
				return this.$store.state.main.tagList;
			},
			breadCrumbList(){
				return this.$store.state.main.breadCrumbList;
			},
			activeIndex(){
				return this.$store.state.main.menuActiveIndex;
			}
		},
		methods: {
			updateHomePage(tpye){
				console.log(tpye, 'dataaaa');
				if (tpye === 'setting') {
					this.dialogVisible = true;
				} else if (tpye === 'theme'){
					this.themeVisible = true;
				}
			},
			beforeunloadHandler(e) {
				postMessage(Constants.EVENT_BUS_CODE_CLOSE_ALL_WIN);
			},
			switchWindow(toPrimary) {
				let windows = Global.getWindows();
				windows.forEach(win => {
					if(toPrimary && win.primary){
						Util.switchWindow(win.windowId);
					}else if(!toPrimary && !win.primary){
						Util.switchWindow(win.windowId);
					}
				});
			},
			checkMenu (key, menus) {
				for (let i = 0; i < menus.length; i++) {
					if (menus[i].id == key) {
						this.activedMenu = {...menus[i]};
					} else if (Array.isArray(menus[i].children)) {
						this.checkMenu(key, menus[i].children);
					}
				}
			},
			handleSelect(key, keyPath) {
				this.checkMenu(key, this.menuData);
				if (this.activedMenu.id && this.activedMenu.url) {
					this.addTags(this.activedMenu);
					this.changeBreadcrumb(this.activedMenu);
					this.$router.push({path: this.activedMenu.url});
				}
			},
			addTags(menu){ //添加标签页
				if (this.tagList.length > 0) {
					let bol = false;
					for (let i = 0, len = this.tagList.length; i < len; i++) {
						if (menu.url === this.tagList[i].url) {
							bol = true;
							break;
						}
					}
					if (!bol) {
						this.tagList.push(menu);
						this.$store.commit('MAIN_SET_TAGLIST', this.tagList);
					}
				} else {
					this.tagList.push(menu);
					this.$store.commit('MAIN_SET_TAGLIST', this.tagList);
				}
			},
			changeBreadcrumb(menu){ //添加面包屑
				let breadCrumbList = [menu.parentTitle, menu.title];
				this.$store.commit('MAIN_SET_BREADCRUMB', breadCrumbList);
			}
		},
		mounted() {
			onMessage(Constants.EVENT_BUS_CODE_CHANGE_THEME, (data) => {
				Util.setTheme(data.type);
			});

			window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));

			let params = {};
			menuApi(params).then(result => {
				console.log('getMenuList>>>>>>>>>>>>>>>>>');
				console.log(result);
				let menusArray = result;
				localStorage.setItem(Constants.MENU_NAME, JSON.stringify(menusArray));
				let data = [];
				if (typeof menusArray != 'undefined' && menusArray.length > 0) {
					for (let i = 0; i < menusArray.length; i++) {
						let menuObject = {};
						menuObject.id = menusArray[i].id;
						menuObject.title = menusArray[i].name;
						menuObject.url = menusArray[i].url;
						if (menusArray[i].url == this.$route.path) { //初始化面包屑/标签页
							let obj = {
								id: menusArray[i].id,
								title: menusArray[i].name,
								type: 'link',
								url: menusArray[i].url};
							this.addTags(obj);
							let breadCrumbList = [menusArray[i].name, menusArray[i].name];
							this.$store.commit('MAIN_SET_BREADCRUMB', breadCrumbList);
							this.$store.commit('MAIN_SET_MENUACTIVEINDEX', obj.id);
						}
						if(menusArray[i].children != null){
							if (typeof menusArray[i].children != 'undefined' && menusArray[i].children.length > 0) {
								menuObject.children = [];
								let menuChildrenArray = menusArray[i].children;

								for (let j = 0; j < menuChildrenArray.length; j++) {
									let menuChildrenObject = {};
									menuChildrenObject.id = menuChildrenArray[j].id;
									menuChildrenObject.title = menuChildrenArray[j].name;
									menuChildrenObject.parentTitle = menusArray[i].name;
								// menuChildrenObject.type = 'link';
									menuChildrenObject.url = menuChildrenArray[j].url;
									menuObject.children.push(menuChildrenObject);
									if (menuChildrenArray[j].url == this.$route.path) { //初始化面包屑/标签页
										let obj = {
											id: menuChildrenArray[j].id,
											parentTitle: menusArray[i].name,
											title: menuChildrenArray[j].name,
											type: 'link',
											url: menuChildrenArray[j].url};
										this.addTags(obj);
										let breadCrumbList = [menusArray[i].name, menuChildrenArray[j].name];
										this.$store.commit('MAIN_SET_BREADCRUMB', breadCrumbList);
										this.$store.commit('MAIN_SET_MENUACTIVEINDEX', obj.id);
									}
									if(menuChildrenArray[j].children != null){
										if(typeof menuChildrenArray[j].children != 'undefined' && menuChildrenArray[j].children.length > 0){
											menuChildrenObject.children = [];
											let menuGrandchildArray = menuChildrenArray[j].children;

											for(let k = 0; k < menuGrandchildArray.length; k++){
												let menuGrandchildObject = {};
												menuGrandchildObject.id = menuGrandchildArray[k].id;
												menuGrandchildObject.title = menuGrandchildArray[k].name;
												menuGrandchildObject.parentTitle = menuChildrenArray[j].name;
                    // menuGrandchildObject.type = 'link';
												menuGrandchildObject.url = menuGrandchildArray[k].url;
												menuChildrenObject.children.push(menuGrandchildObject);
												if (menuGrandchildArray[k].url == this.$route.path) { //初始化面包屑/标签页
													let obj = {
														id: menuGrandchildArray[k].id,
														parentTitle: menuChildrenArray[j].name,
														title: menuGrandchildArray[k].name,
														type: 'link',
														url: menuGrandchildArray[k].url};
													this.addTags(obj);
													let breadCrumbList = [menuChildrenArray[j].name, menuGrandchildArray[k].name];
													this.$store.commit('MAIN_SET_BREADCRUMB', breadCrumbList);
													this.$store.commit('MAIN_SET_MENUACTIVEINDEX', obj.id);
												}
											}
										}
									}
								}
							}
						}
						data.push(menuObject);
					}
				}
				this.menuData = data;
				console.log(this.menuData, '导航菜单');
			});
		},
		beforeDestroy() {
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
		},
		beforeCreate() {
			let windows = Global.getWindows();
			windows.forEach(win => {
				if (window.opener && window.opener[win.windowId]) { //非常重要，用来获取弹出的所有窗口，在联动关闭窗口时会用到
					window[win.windowId] = window.opener[win.windowId];
				}
			});
			postMessage(Constants.EVENT_BUS_CODE_CLOSE_LOGIN_WIN);
			onMessage(Constants.EVENT_BUS_CODE_CLOSE_ALL_WIN);
			onMessage(Constants.EVENT_BUS_CODE_CHECK_LOGINED, (data) => {
				postMessage(Constants.EVENT_BUS_CODE_CHECK_LOGINED_CALLBACK, {status: true});
			});
		}
	};
</script>
