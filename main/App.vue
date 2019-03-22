<template>
	<kd-frameset :cols="'100'" id="app">
		<router-view></router-view>
	</kd-frameset>
</template>
<script>
	import {kdFrameset} from '@kd-components/kd-frameset';
	export default{
		name: 'App',
		components: {
			kdFrameset
		}
	};
</script>
