<template>
	<kd-frameset :rows="'3.2rem,*'">
		<nav-bar></nav-bar>
		<kd-frame>
			<div class="flexbox">
				<kd-watermark :settings="settings"></kd-watermark>
				<breadcrumb></breadcrumb>
				<transition name="fade-transform" mode="out-in">
					<keep-alive>
						<router-view></router-view></keep-alive>
				</transition>
			</div>
		</kd-frame>
	</kd-frameset>
</template>
<script>
	import KdWatermark from '@kd-components/kd-watermark/src/watermark';
	import NavBar from './NavBar';
	import Auth from 'utils/auth';
	import Breadcrumb from './Breadcrumb';
	import {kdFrameset, kdFrame} from '@kd-components/kd-frameset';
	export default{
		name: 'App',
		components: {
			kdFrame,
			kdFrameset,
			NavBar,
			Breadcrumb,
			KdWatermark
		},
		data() {
			return {
				settings: {
					watermark_txt: Auth.getUserInfo().username,
					unit: 'rem'
				}
			};
		}
	};
</script>
<style scoped>
	.flexbox{
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
