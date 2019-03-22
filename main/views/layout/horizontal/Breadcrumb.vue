<template>
	<div class="main-breadcrumb" v-if="isWindowMain">
		<!-- 面包屑 -->
		<!-- <kc-breadcrumb>
			<kc-breadcrumb-item>首页</kc-breadcrumb-item>
			<kc-breadcrumb-item
				v-for="(item,index) in breadCrumbList"
				:key="index" >
				{{item}}
			</kc-breadcrumb-item>
		</kc-breadcrumb> -->
		<!-- 标签页 -->
		<tags-view @isChange="changeBreadcrumb" :tagList="tagList"></tags-view>
	</div>
</template>

<script>
	import Util from 'utils/util';
	import TagsView from '../../../components/TagsView/index.vue';

	export default {
		name: 'Breadcrumb',
		components: {
			TagsView
		},
		computed: {
			isWindowMain(){
				let isWindowMain = !Util.isWindowMap();
				return isWindowMain;
			},
			breadCrumbList(){
				return this.$store.state.main.breadCrumbList;
			},
			tagList(){
				return this.$store.state.main.tagList;
			}
		},
		methods: {
			changeBreadcrumb(menu){ //添加面包屑
				let breadCrumbList = [menu.parentTitle, menu.title];
				this.$store.commit('MAIN_SET_BREADCRUMB', breadCrumbList);
				this.$store.commit('MAIN_SET_MENUACTIVEINDEX', menu.id);
			}
		}
	};
</script>
