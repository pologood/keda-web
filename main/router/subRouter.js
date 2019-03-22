import LoginView from '../views/login';
import WelcomeView from '../views/welcome';
import Page1 from '../views/welcome/Page1';
import Page2 from '../views/welcome/Page2';
import Page404 from '../views/welcome/404';

var subRouter;
subRouter = function (Main) {
	return [{
		path: '/',
		name: 'login',
		component: LoginView
	}, {
		path: '/welcome',
		name: 'welcome',
		component: Main,
		children: [
			{
				path: '',
				name: 'home',
				component: WelcomeView
			},
			{
				path: 'page1',
				name: 'page1',
				component: Page1
			}, {
				path: 'page2',
				name: 'page2',
				component: Page2
			}, {
				path: 'map',
				name: 'welcomeMap',
				component: Page2
			}
		]
	}, {
		path: '*',
		name: '404',
		component: Main,
		hidden: true,
		children: [
			{
				path: '',
				name: 'Page404',
				component: Page404
			}
		]
	}
	];
};
export default subRouter;
