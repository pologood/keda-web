<template>
	<kd-frameset :rows="'3.0rem,*'">
		<kd-navigation></kd-navigation>
		<kd-frame>
			<router-view></router-view>
		</kd-frame>

	</kd-frameset>
</template>
<script>
	import {kdNavigation} from 'components/kd-navigation';
	import {kdFrameset, kdFrame} from '@kd-components/kd-frameset';
	export default{
		name: 'App',
		components: {
			kdFrame,
			kdNavigation,
			kdFrameset
		}
	};
</script>
