import Vue from 'vue';
import './assets/iconfont/iconfont.css';
import packageConfig from './package.json';
import myGlobal from './utils/myGlobal';

let dependencies = packageConfig.dependencies;
for(let key in dependencies){
	let componentList = dependencies[key].components;
	if(componentList){
		componentList.forEach((component) => {
			Vue.component(component.name, function (resolve, reject) {
				require.ensure([], (require) => {
					resolve(require.context('submodule', true, /\.vue$/)(`./${component.path}`));
				});
			});
		});
	}
}


myGlobal.init().then((res) => {
	console.log('myGlobal init result>>>', res);
}).catch((err) => {
	window.alert('myGlobal init err' + err);
});
