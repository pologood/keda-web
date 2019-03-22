<template>
	<div class="main-layout-vertical-box">
		<div class="navbar" mode="vertical">
            <div class="ham-breadcrumb">
            	<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
				<!-- 面包屑 -->
				<kc-breadcrumb v-if="isWindowMain">
				    <kc-breadcrumb-item>首页</kc-breadcrumb-item>
				    <kc-breadcrumb-item
				    	v-for="(item,index) in  $store.state.main.breadCrumbList"
				    	:key="index" >
				        {{item}}
					</kc-breadcrumb-item>
				</kc-breadcrumb>
            </div>
			<div class="right-menu" v-if="isWindowMain">
				<div class="icon-change-window">
					<!--<div class="switch-button" @click="switchWindow(false)" v-if="showSwitch">-->
						<!--<span>地图屏</span>-->
					<!--</div>-->
					<person-center @updateHomePage="updateHomePage"></person-center>
				</div>
			</div>
			<div v-else-if="isWindowMap" class="map-nav">
				<div class="right-menu">
					<div class="icon-change-window">
						<div class="switch-button" @click="switchWindow(true)" v-if="showSwitch">
							<span>业务屏</span>
						</div>
						<person-center @updateHomePage="updateHomePage"></person-center>
					</div>
				</div>
			</div>
			<kc-modal
				title="个人设置"
				:visible.sync="dialogVisible"
				class="person-setting">
				<person-setting></person-setting>
			</kc-modal>
			<kc-modal
				title="换肤"
				:visible.sync="themeVisible"
				class="person-setting">
				<change-theme></change-theme>
			</kc-modal>
		</div>
		<!-- 标签页 -->
		<!--<tags-view v-if="isWindowMain" @isChange="changeBreadcrumb" :tagList="$store.state.main.tagList">-->
		<!--</tags-view>-->
	</div>
</template>

<script>
	import Util from 'utils/util';
	import Global from 'utils/global';
	import Constants from 'utils/constants';
	import {postMessage, onMessage} from 'utils/event-bus';
	import {mapState} from 'vuex';
	import Hamburger from './Hamburger';
	import PersonCenter from '../../../../components/PersonCenter/index';
	import PersonSetting from '../../../../components/PersonSetting/index.vue';
	import ChangeTheme from '../../../../components/ChangeTheme/index.vue';
	import TagsView from '../../../../components/TagsView/index.vue';

console.log(mapState, 'mapState99');
	export default {
		data() {
			return {
				dialogVisible: false,
				themeVisible: false
			};
		},
		components: {
			Hamburger,
			PersonCenter,
			PersonSetting,
			TagsView,
			ChangeTheme
		},
		computed: {
			...mapState({
				sidebar: state => state.main.sidebar
			}),
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
			}
		},
		methods: {
			updateHomePage(tpye) {
				if (tpye === 'setting') {
					this.dialogVisible = true;
				} else if (tpye === 'theme'){
					this.themeVisible = true;
				}
			},
			beforeunloadHandler(e) {
				postMessage(Constants.EVENT_BUS_CODE_CLOSE_ALL_WIN);
			},
			// 地图屏业务屏切换
			switchWindow(toPrimary) {
				let windows = Global.getWindows();
				windows.forEach(win => {
					if (toPrimary && win.primary) {
						Util.switchWindow(win.windowId);
					} else if (!toPrimary && !win.primary) {
						Util.switchWindow(win.windowId);
					}
				});
			},
			toggleSideBar() {
				this.$store.dispatch('mainToggleSideBar');
			},
			changeBreadcrumb(menu){ //改变面包屑
				let breadCrumbList = [menu.parentTitle, menu.title];
				this.$store.commit('MAIN_SET_BREADCRUMB', breadCrumbList);
			}
		},
		mounted() {
			if (window.menubar.visible) { //判断是否是弹出框，防止用户在浏览器自己输入地址
				this.isChromeExt = true;
				console.log('this.showExchange>>>' + this.isChromeExt);
			}
			window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
			onMessage(Constants.EVENT_BUS_CODE_CLOSE_ALL_WIN);
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
		}
	};
</script>

