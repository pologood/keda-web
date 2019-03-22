// 子模块依赖引入相关操作
const fs = require('fs');
const path = require('path');
const childModuleFiles = fs.readdirSync('./submodule');

// node参数
const arguments = process.argv.splice(2);
const action = [...new Set(arguments)][0];
const target = [...new Set(arguments)][1];

// 引入路径
const mainUrl = 'main/main.js';
const routerUrl = 'main/router/index.js';
const storeUrl = 'main/store/index.js';
const scssLightUrl = 'static/theme/light/index.scss';
const scssDarkUrl = 'static/theme/dark/index.scss';

let childModules = [];
let contentArray;
let hasChild;
let hasAction;
// 返回字符串前面空格字符串
const spaceFront = str =>{
	return str.match(/^\s*/g);
};
// 去掉下划线中划线字符串 =》 驼峰
const toCamel = str => {
	return str.replace(/([-_])(\w)/g, c => { return c.toUpperCase(); }).replace(/[-_]/g, '');
};
//去除空格并且替换双引号为单引号,去除\t,;
const Trim = str => {
	let result;
	// 前后替换
	result = str.replace(/(^\s+)|(\s+$)/g,"");
	// 全局替换
	result = result.replace(/\s/g,"").replace(/\"/g,"'").replace(/\\t/g, '').replace(/\;/g, '');

	return result;
};

// 引入相关依赖
const mainInsert = (fileName) => {
	const mainCompare =`import 'kfront-baseui/css/index.css';`;
	const mainReplace =`import 'submodule/${fileName}/main.js';`;
	const newContentArray = [];
	contentArray.forEach((item)=> {
		if (Trim(item) === Trim(mainCompare)) {
			newContentArray.push(item);
			newContentArray.push(mainReplace);
			return
		}
		newContentArray.push(item);
	});
	contentArray = newContentArray;
	return contentArray;
};

const routerInsert = (fileName) => {
	//router
	const routerImportCompare = `import subRouter from './subRouter';`;
	const routerImportReplace = `import ${toCamel(fileName)}Router from 'submodule/${fileName}/router';`;
	const routerLayoutHCompare = `routers.push(...subRouter(LayoutH));`;
	const routerLayoutHReplace = `routers.push(...${toCamel(fileName)}Router(LayoutH));`;
	const routerLayoutVCompare = `routers.push(...subRouter(LayoutV));`;
	const routerLayoutVReplace = `routers.push(...${toCamel(fileName)}Router(LayoutV));`;
	const newContentArray = [];
	contentArray.forEach((item)=> {
		if(Trim(item) === Trim(routerImportCompare)){
			newContentArray.push(item);
			newContentArray.push(routerImportReplace);
		}else if(Trim(item) === Trim(routerLayoutHCompare)){
			newContentArray.push(spaceFront(item)+routerLayoutHReplace);
			newContentArray.push(item);
		}else if(Trim(item) === Trim(routerLayoutVCompare)){
			newContentArray.push(spaceFront(item)+routerLayoutVReplace);
			newContentArray.push(item);
		}else{
			newContentArray.push(item);
		}
	});
	contentArray = newContentArray;
	return contentArray;
};

const storeInsert = (fileName) => {
	//store
	const storeImportCompare = `import main from './modules/app';`;
	const storeImportReplace = `import ${toCamel(fileName)}Store from 'submodule/${fileName}/store';`;
	const storeModuleCompare = `main`;
	const storeModuleReplace = `${toCamel(fileName)}Store,`;
	const newContentArray = [];
	contentArray.forEach((item)=> {
		if (Trim(item) === Trim(storeImportCompare)) {
			newContentArray.push(item);
			newContentArray.push(storeImportReplace);
		} else if (Trim(item) === Trim(storeModuleCompare)) {
			newContentArray.push(spaceFront(item)+storeModuleReplace);
			newContentArray.push(item);
		} else {
			newContentArray.push(item);
		}
	});
	contentArray = newContentArray;
	return contentArray;
};

const scssLightInsert = (fileName) => {
	//scss
	const scssLightCompare = `@import '../../../main/styles/light/index';`;
	const scssLightReplace = `@import '../../../submodule/${fileName}/styles/light/index';`;
	const newContentArray = [];
	contentArray.forEach((item)=> {
		if (Trim(item) === Trim(scssLightCompare)) {
			newContentArray.push(item);
			newContentArray.push(scssLightReplace);
			return;
		}
		newContentArray.push(item);
	});
	contentArray = newContentArray;
	return contentArray;
};

const scssDarkInsert = (fileName) => {
	//scss
	const scssDarkCompare = `@import '../../../main/styles/dark/index';`;
	const scssDarkReplace = `@import '../../../submodule/${fileName}/styles/dark/index';`;
	const newContentArray = [];
	contentArray.forEach((item)=> {
		if (Trim(item) === Trim(scssDarkCompare)) {
			newContentArray.push(item);
			newContentArray.push(scssDarkReplace);
		} else {
			newContentArray.push(item);
		}
	});
	contentArray = newContentArray;
	return contentArray;
};

// fReadNameType
const fReadNameType = type => {
	const  ReadNameType = {
		'router': routerUrl,
		'store': storeUrl,
		'scssLight': scssLightUrl,
		'scssDark': scssDarkUrl,
		'main': mainUrl
	};
	return ReadNameType[type];
};

//按类型替换匹配参数做判断
const replaceType = (type, fileName) => {
	const  typeReplace = {
		'router': [`import ${toCamel(fileName)}Router from 'submodule/${fileName}/router';`, `routers.push(...${toCamel(fileName)}Router(LayoutH));`, `routers.push(...${toCamel(fileName)}Router(LayoutV));`],
		'store': [`import ${toCamel(fileName)}Store from 'submodule/${fileName}/store';`, `${toCamel(fileName)}Store,`],
		'scssLight': [`@import '../../../submodule/${fileName}/styles/light/index';`],
		'scssDark': [`@import '../../../submodule/${fileName}/styles/dark/index';`],
		'main': [`import 'submodule/${fileName}/main.js';`]
	};
	return typeReplace[type];
};

//node参数验证
//action不能为空值只能是 import remove,action = import 导入子模块相关依赖， action = remove 删除相关依赖 并且删除子模块依赖
const nodeArgumentsTest = () => {
	if(!action) {
		console.log('请输入操作 import/remove!');
		return;
	}
	hasAction = ['import', 'remove'].some((item) => {
		return item === action;
	});
	if(!hasAction){
		console.log(`${action}操作不存在！`);
		console.log('请输入操作 import/remove!');
		return;
	}
	if(target === '*'){
		for(let i=0; i<childModuleFiles.length;i++){
			let fileName = childModuleFiles[i];
			if(fs.lstatSync(`./submodule/${fileName}`).isDirectory()){
				actionType(fileName);
			}
		}
	} else {
		let fileName = target;
		// fileName不能为空
		if(!fileName) {
			console.log('引入子模块的文件名不能为空！');
			return;
		};
// 获取子模块的文件名
		childModuleFiles.forEach((item) => {
			let stat = fs.lstatSync("./submodule/" + item);
			if (stat.isDirectory() === true) {
				childModules.push(item)
			}
		});
		if(childModules.length === 0){
			console.log(`请先导入${fileName}子模块`);
			return;
		}
		hasChild = childModules.some((item) => {
			return item === fileName;
		});
//键入的文件名是否是子模块
		if(!hasChild){
			console.log(`${fileName}子模块不存在！`);
			console.log(`该项目的子模块是：${childModules}`);
			return;
		}
		actionType(fileName);
	}
};

//按类型插入操作做判断
const readFileType = (type, fileName) => {
	switch (type) {
		case 'router':
			routerInsert(fileName);
			break;
		case 'store':
			storeInsert(fileName);
			break;
		case 'scssLight':
			scssLightInsert(fileName);
			break;
		case 'scssDark':
			scssDarkInsert(fileName);
			break;
		case 'main':
			mainInsert(fileName);
			break;
	}
};

//删除文件夹以及内容
const deleteFolder = url => {
	var files = [];
	if( fs.existsSync(url) ) {
		files = fs.readdirSync(url);
		files.forEach(function(file,index){
			var curPath = path.join(url,file);
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolder(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(url);
	}
};

// 添加子模块
const addModule = (type,fileName, callback) => {
	let fReadName = fReadNameType(type);
	let text = fs.readFileSync(fReadName, 'utf8');
	contentArray = new Array();
	// 读取文件并且获取文本
	// 将文件按行拆成数组
	text.split(/\r?\n/).forEach((line)=> {
		contentArray.push(line.replace(/\'/g,'"'));
	});
	// 数组中不管是否存在某一行都删除
	let mainReplace = replaceType(type,fileName);
	contentArray.forEach((item,index)=> {
		// 寻找该type中将要删除的行
		mainReplace.forEach((val) => {
			if(Trim(item) === Trim(val)){
				contentArray.splice(index, 1);
			}
			return;
		});
	});
	callback(type,fileName);
	let err = fs.writeFileSync(fReadName, contentArray.join('\n').replace(/\\/g,"").replace(/\"/g,"'"));
	if(err) console.log('引入操作失败');
	else console.log(`${fReadName}引入${fileName}子模块成功`);
};

// 添加Package.json
const addPackage = (fileName) => {
	let toText = fs.readFileSync( `package.json`, 'utf8');
	let toJson = JSON.parse(toText);

	try {
		let fromText =  fs.readFileSync( `submodule/${fileName}/package.json`, 'utf8');
		let fromJson = JSON.parse(fromText);
		let devDependencies = fromJson['devDependencies'];
		let num = 0;
		for(let key in devDependencies){
			let found = false;
			if(toJson['dependencies'][key] || toJson['devDependencies'][key]){
				found = true;
			}
			if(!found){
				num++;
				toJson['devDependencies'][key] = devDependencies[key];
			}
		}
		if(num > 0){
			let err = fs.writeFileSync(`package.json`, JSON.stringify(toJson));
			if(err) console.log('package.Json引入操作失败');
			else console.log(`package.Json引入${fileName}子模块${num}个依赖`);
		}
	}catch (e) {
		console.log('package.Json引入操作失败',e);
	}
};

// 删除子模块
const deleteModule = (type, fileName) => {
	let fReadName = fReadNameType(type);
	let text = fs.readFileSync(fReadName, 'utf8');
	contentArray = new Array();
	deleteFolder(`submodule/${fileName}`);
	fs.readFile(fReadName, 'utf8', (err, file) => {
		if (err) {
			console.log('读取文件失败');
			return
		}
		contentArray = [];
		text.split(/\r?\n/).forEach((line)=> {
			contentArray.push(line.replace(/\'/g,'"'));
		});
		let firstArrLength = contentArray.length;
		let mainReplace = replaceType(type,fileName);
		contentArray.forEach((item,index)=> {
			// 寻找该type中将要删除的行
			mainReplace.forEach((val) => {
				if(Trim(item) === Trim(val)){
					contentArray.splice(index, 1);
				}
				return;
			});
		});
		if(contentArray.length < firstArrLength){
			let err  = fs.writeFileSync(fReadName, contentArray.join('\n').replace(/\\/g,"").replace(/\"/g,"'"));
			console.log(`${fReadName}中清除依赖成功！`);
		}else{
			console.log(`${fReadName}中已清除依赖！`);
		}
	})
};

const actionType = (fileName) => {
	if(action === 'import'){
		console.log('正在插入子模块！'+fileName);
		// main.js
		addModule('main',fileName, readFileType);
		//router
		addModule('router',fileName, readFileType);
		//store
		addModule('store',fileName, readFileType);
		//scss
		addModule('scssLight',fileName, readFileType);
		addModule('scssDark',fileName, readFileType);
		addPackage(fileName);
	}else{
		console.log('正在清除子模块！'+fileName);
		deleteModule('main', fileName);
		deleteModule('store', fileName);
		deleteModule('router', fileName);
		deleteModule('scssLight', fileName);
		deleteModule('scssDark', fileName);
	}
};

nodeArgumentsTest(target);
