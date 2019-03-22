<template>
	<div class="app-wrapper" :class="classObj">
		<!--<div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>-->
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container flexbox">
			<navbar></navbar>
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
	import {Navbar, Sidebar, AppMain} from './components';
	export default {
		name: 'layout',
		components: {
			Navbar,
			Sidebar,
			AppMain
		},
		computed: {
			sidebar() {
				return this.$store.state.main.sidebar;
			},
			device() {
				return this.$store.state.main.device;
			},
			classObj() {
				return {
					hideSidebar: !this.sidebar.opened,
					withoutAnimation: this.sidebar.withoutAnimation,
					mobile: false
				};
			}
		},
		methods: {
			handleClickOutside() {
				this.$store.dispatch('closeSideBar', {withoutAnimation: false});
				this.$store.dispatch('mainCloseSideBar', {withoutAnimation: false});
			}
		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "../../../styles/layout/vertical/mixin.scss";
	.flexbox{
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.app-wrapper {
		@include clearfix;
		position: relative;
		height: 100%;
		width: 100%;
	}

	.drawer-bg {
		background: #000;
		opacity: 0.3;
		width: 100%;
		top: 0;
		height: 100%;
		position: absolute;
		z-index: 999;
	}
</style>
