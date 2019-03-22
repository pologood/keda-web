## submodule框架结构

| 目录名称 | 作用|备注|
| ---- | ---- | -----|
|submodule/xxx|业务子模块|拥有独立的git仓库，资源代码不会污染到main|
|submodule/xxx/components|该子模块views里面公用的组件| |
|submodule/xxx/router|该子模块里面的路由|采用了嵌套路由的模式，第一层path命名为该app的名字（xxx），便于与其他子模块路由的区分，会在kiaf-main的router中引入|
|submodule/xxx/service|该子模块里面的http Api| 建议api function的命名以Api结束，便于与其他vue文件里面的methods的区分，一看就知道是http请求的|
|submodule/xxx/store|该子模块里面的Vuex|命名规则与router类似，都要有以app 的名字（xxx）开头，便于与其他子模块的vuex区分，会在kiaf-main的store中引入|
|submodule/xxx/styles|该子模块的styles|每个vue的scss统一写到这里，按照vue的name命名scss的name,同时以该app的name和vue的name声明一个最外层的className（比如kiaf-main的login.vue,这可以申明一个叫kiaf-main-login的class），该vue里面的class全部嵌套在该className下面（kiaf-main-login）。最后在index.scss中导入。颜色和字体大小统一写道var.scss中，并且申明为!default,这样，在主工程中，可以申明!global统一覆盖子模块的样式。子模块中styles不要定义字体|
|submodule/xxx/styles/dark|该子模块的dark styles 入口|支持换肤|
|submodule/xxx/styles/light|该子模块的light styles 入口|支持换肤|
|submodule/xxx/utils|该子模块的utils|处理该工程的一些公用的工具方法|
|submodule/xxx/utils/myConstants |该子模块views里面如果用到了locaStorage, 里面的key必须定义到myConstants里,切key的命名规则为global.getAppName()+submoduleName+keyName|
|submodule/xxx/views|存放该子模块的vue|里面不要写scss，更不能在html标签上写style|
|submodule/xxx/assets|每个子模块所需要的静态资源(图片，iconfont，环境配置的json)需要放到自己的工程的assets中|iconfont在main.js中引入|
|submodule/xxx/main.js|负责iconfont的引入和定义第三方依赖模块的组件||
|submodule/xxx/package.json|定义子模块的名称，版本，描述以及声明自己对其他子模块的依赖,dependencies里声明对其他模块的依赖，devDependencies里声明第三方组件的依赖，scripts申明对kmap，kmedia，sockjs的依赖||

`"dependencies": {
	"userMgt": {
		"version": "1.0.0",
		"components": [
			{
				"name": "UserRole",
				"path": "userMgt/views/userMgt/components/UserRole.vue"
			}
		]
	}
 }`


`"devDependencies": {
	"html2canvas": "1.0.0-alpha.12"
 }`


`"scripts": {
	"kmap": true,
	"kmedia": true,
	"sockjs": true
}`
