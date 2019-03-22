<template>
	<transition name="fade-transform" mode="out-in">
		<keep-alive><router-view :key="key"></router-view></keep-alive>
	</transition>
</template>

<script>
	export default {
		name: 'AppMain',
		computed: {
			key() {
				return this.$route.fullPath;
			}
		}
	};
</script>
