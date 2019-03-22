<template>
		<kc-scrollbar wrapClass="scrollbar-wrapper">
			<kc-menu
				mode="vertical"
				:show-timeout="200"
				unique-opened
				:default-active="$route.path"
				:collapse="isCollapse"
				@select="handleSelectKey"
				router>
				<sidebar-item :routes="menuData"></sidebar-item>
			</kc-menu>
		</kc-scrollbar>
</template>

<script>
	import {mapState} from 'vuex';
	import {menuApi} from '../../../../../service/menu.js';
	import SidebarItem from './SidebarItem';

	export default {
		components: {SidebarItem},
		computed: {
			...mapState({
				sidebar: state => state.main.sidebar
			}),
			isCollapse() {
				return !this.sidebar.opened;
			}
		},
		data() {
			return {
				menuData: []
			};
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				let params = {};
				menuApi(params).then(result => {
					console.log('getMenuList>>>>>>>>>>>>>>>>>');
					console.log(result);
					let menusArray = result;
					let data = [];
					if (typeof menusArray != 'undefined' && menusArray.length > 0) {
						for (let i = 0; i < menusArray.length; i++) {
							let menuObject = {};
							menuObject.id = menusArray[i].id;
							menuObject.title = menusArray[i].name;
							menuObject.url = menusArray[i].url;
							// menuObject.type = 'link';
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
									}
								}
							}
							data.push(menuObject);
						}
					}
					this.menuData = data;
					this.$store.commit('MAIN_SET_MENUDATA', data);
				});
			},
			handleSelectKey(key) {
				console.log('key================', key);
				let menu = {};
				for (let i = 0; i < this.menuData.length; i++) {
					let item = this.menuData[i];
					if (item.children) {
						for (let j = 0; j < item.children.length; j++) {
							let item2 = item.children[j];
							if (String(item2.url) === key) {
								menu = item2;
							}
						}
					} else if (String(item.url) === key) {
						menu = item;
					}
				}
				if (menu.id && menu.url) {
					this.addTags(menu);
					this.changeBreadcrumb(menu);
					this.$router.push({
						path: menu.url
					});
				}
			},
			changeBreadcrumb(menu) { //改变面包屑
				console.log(menu, 'menumenu9999');

				let breadCrumbList = [menu.parentTitle, menu.title];
				this.$store.commit('MAIN_SET_BREADCRUMB', breadCrumbList);
				console.log(this.$store, 'this.$store.000');
			},
			addTags(menu) { //添加标签页
				let tagList = this.$store.state.main.tagList;
				if (tagList.length > 0) {
					let bol = false;
					for (let i = 0, len = tagList.length; i < len; i++) {
						if (menu.url === tagList[i].url) {
							bol = true;
							break;
						}
					}
					if (!bol) {
						tagList.push(menu);
						this.$store.commit('MAIN_SET_TAGLIST', tagList);
					}
				} else {
					tagList.push(menu);
					this.$store.commit('MAIN_SET_TAGLIST', tagList);
				}
			}

		}
	};
</script>
