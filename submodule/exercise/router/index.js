import LayoutWeb from '../views/layout/web/index.vue';
import Home from '../views/home.vue';

import HomePage from '../views/home/homePage';
import SearchFilms from '../views/home/searchFilms';
import FilmDetail from '../views/home/filmDetail';

var subRouter = function (Main) {
	return [{
		path: '/',
		name: 'main',
		component: Home
	},
		{
		path: '/execrise',
		name: 'execrise',
		component: LayoutWeb,
		children: [
			{
				path: 'homePage',
				name: 'homePage',
				component: HomePage
			},
			{
			path: 'searchFilms',
			name: 'searchFilms',
			component: 	SearchFilms
			},

			/*
			现在测试的是影片详情页的页面；原本应该通过点击影片显示页面。
			但是还没有写多个页面之间的关系。到时候使用<router-link />实现
			 */
			{
				path: 'filmDetail',
				name: 'filmDetail',
				component: FilmDetail
			},
			{
				path: 'testList',
				name: 'testList',
				component: () => import('../views/test/index.vue')
			}
		]
	}];
};
export default subRouter;
