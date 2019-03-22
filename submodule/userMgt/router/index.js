var subRouter = function (Main) {
	return [{
		path: '/systemManagement',
		name: 'systemManagement',
		component: Main,
		children: [
			{path: 'userList', name: 'userList', component: () => import('../views/userMgt/index.vue')},
			{path: 'role', name: 'roleManagement', component: () => import('../views/roleMgt/index.vue')},
			{path: 'administrativeArea', name: 'administrativeArea', component: () => import('../views/administrativeArea/index.vue')},
			{path: 'organization', name: 'organization', component: () => import('../views/organization/index.vue')}
		]
	}];
};
export default subRouter;
