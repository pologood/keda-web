<template>
	<div class="main-layout-changetheme-box">
		 <div class="theme-box">	
		 	  <div class="left-theme" @click="changeTheme('dark')">	
		 	  	<span class="img-box" :class="{'active-theme':activeTheme==='dark'}"><img src="../../assets/images/dark-theme.png"></span>
		 	  	<span>深色系</span>
		 	  </div>
		 	  <div class="right-theme" @click="changeTheme('light')">	
		 	  	<span class="img-box" :class="{'active-theme':activeTheme==='light'}"><img src="../../assets/images/light-theme.png"></span>
		 	  	<span>浅色系</span>
		 	  </div>
		 </div>
	</div>
</template>
<script>
	import Constants from 'utils/constants';
	import { postMessage } from 'utils/event-bus';

	export default {
		name: 'ChangeTheme',
		data () {
			return {
				activeTheme: ''
			};
		},

		mounted () {
		},
		created () { 
		},
		methods: {
			changeTheme(type){
				this.activeTheme = type;
				postMessage(Constants.EVENT_BUS_CODE_CHANGE_THEME, {type: type});
			}

		}
	};
</script>

