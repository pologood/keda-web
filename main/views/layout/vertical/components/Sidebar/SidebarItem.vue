<template>
	<div class="menu-wrapper">
		<img class="logoLeft" src="../../../../../assets/images/logo2.png">
		<img class="login-icon" src="../../../../../assets/images/logo.png">
		<template v-for="item in routes">

			<div v-if="!item.children">
				<kc-menu-item :index="item.url" :class="{'submenu-title-noDropdown':!isNest}">
					<i class="kc-icon-location"></i>
					<!--<i c.pathlass="fa" :class="item.icon"></i>-->
					<span v-if="item.title" slot="title">{{item.title}}</span>
				</kc-menu-item>
			</div>

			<div v-else-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow">
				<kc-menu-item :index="item.children[0].url" :class="{'submenu-title-noDropdown':!isNest}">
					<i class="kc-icon-menu"></i>
					<!--<i class="fa" :class="item.icon"></i>-->
					<span v-if="item.children[0].title" slot="title">{{item.children[0].title}}</span>
				</kc-menu-item>
			</div>

			<kc-submenu v-else :index="item.id" :key="item.id">
				<template slot="title">
					<!--<i class="fa" :class="item.icon"></i>-->
					<i class="kc-icon-document"></i>
					<span v-if="item.title" slot="title">{{item.title}}</span>
				</template>

				<template v-for="child in item.children">
					<!-- <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0"
								  :routes="[child]" :key="child.id"></sidebar-item> -->

					<div>
						<kc-menu-item :index="child.url" :key="child.url">
							<i class="kc-icon-setting"></i>
							<i class="fa" :class="child.icon"></i>
							<span v-if="child.title" slot="title">{{child.title}}</span>
						</kc-menu-item>
					</div>
				</template>
			</kc-submenu>

		</template>
	</div>
</template>

<script>

	export default {
		name: 'SidebarItem',
		props: {
			routes: {
				type: Array
			},
			isNest: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			hasOneShowingChildren(children) {
				const showingChildren = children.filter(item => {
					return !item.hidden;
				});
				if (showingChildren.length === 1) {
					return true;
				}
				return false;
			}
		}
	};
</script>
<style scoped>
	.logoLeft{
		width: 100%;
		height: 56px;
		margin-top: 3px;
	}
</style>


