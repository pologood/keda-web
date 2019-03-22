var request = require('request');
var jsonDB = require('./jsonDB');
const BASE_URL = 'http://192.168.7.107:808';
const BASE_URL_CLOUD_RABC = 'http://dev.ctsp.kedacom.com';
var getJson = function (url, headers, params, callback) {
	console.log('getJson:url>>>', url);
	console.log('getJson:headers>>>', headers);
	console.log('getJson:params>>>', params);
	let filename = encodeURIComponent(url);
	if (url.indexOf('http') < 0) {
		if(url.indexOf('/cloud-rbac') >= 0){
			url = BASE_URL_CLOUD_RABC + url;
		}else{
			url = BASE_URL + url;
		}
	}
	var opts = {
		method: 'GET',
		url: url,
		json: true,
		qs: params,
		timeout: 10000
	};
	if (headers['content-type']) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.headers['content-type'] = headers['content-type'];
	}
	if (headers['jwt-token']) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.headers['jwt-token'] = headers['jwt-token'];
	}
	console.log('get opts>>>', opts);
	let result = jsonDB.getData(filename);
	let callbacked = false;
	if(result.code){
		callbacked = true;
		callback(result);
	}
	request(opts, function (error, ret, body) {
		if (error) {
			console.log('get result:ERROR>>>', error);
			if(!callbacked){
				let result = jsonDB.getData(filename);
				callback(result);
			}
		}
		if (body) {
			console.log('get result:OK>>>', body);
			if(!callbacked){
				callback(body);
			}

			if(body.code == '0'){
				jsonDB.saveData(filename, body);
			}
		}
	});
};
var postJson = function (url, headers, data, callback) {
	console.log('postJson:url>>>', url);
	console.log('postJson:headers>>>', headers);
	console.log('postJson:data>>>', data);
	let filename = encodeURIComponent(url);
	if (url.indexOf('http') < 0) {
		if(url.indexOf('/cloud-rbac') >= 0){
			url = BASE_URL_CLOUD_RABC + url;
		}else{
			url = BASE_URL + url;
		}
	}
	var opts = {
		method: 'POST',
		url: url,
		json: true,
		timeout: 10000
	};
	if (headers['content-type']) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.headers['content-type'] = headers['content-type'];
	}
	if (headers['jwt-token']) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.headers['jwt-token'] = headers['jwt-token'];
	}
	if (headers['content-type'] && headers['content-type'].indexOf('application/x-www-form-urlencoded') >= 0) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.form = data;
	} else {
		opts.body = data;
	}
	console.log('post opts>>>', opts);
	let result = jsonDB.getData(filename);
	let callbacked = false;
	if(result.code){
		callbacked = true;
		callback(result);
	}
	request(opts, function (error, ret, body) {
		if (error) {
			console.log('post result:ERROR>>>', error);
			if(!callbacked){
				let result = jsonDB.getData(filename);
				callback(result);
			}
		}
		if (body) {
			console.log('post result:OK>>>', body);
			if(!callbacked){
				callback(body);
			}
			if(body.code == '0'){
				jsonDB.saveData(filename, body);
			}
		}
	});
};

var deleteJson = function (url, headers, data, callback) {
	console.log('deleteJson:url>>>', url);
	console.log('deleteJson:headers>>>', headers);
	console.log('deleteJson:data>>>', data);
	let filename = encodeURIComponent(url);
	if (url.indexOf('http') < 0) {
		if(url.indexOf('/cloud-rbac') >= 0){
			url = BASE_URL_CLOUD_RABC + url;
		}else{
			url = BASE_URL + url;
		}
	}
	var opts = {
		method: 'DELETE',
		url: url,
		json: true,
		body: data
	};
	if (headers['content-type']) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.headers['content-type'] = headers['content-type'];
	}
	if (headers['jwt-token']) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.headers['jwt-token'] = headers['jwt-token'];
	}
	request(opts, function (error, ret, body) {
		if (error) {
			console.log('delete result:ERROR>>>', error);
			let result = jsonDB.getData(filename);
			callback(result);
		}
		if (body) {
			console.log('delete result:OK>>>', body);
			callback(body);
			jsonDB.saveData(filename, body);
		}
	});
};
var putJson = function (url, headers, data, callback) {
	console.log('putJson:url>>>', url);
	console.log('putJson:headers>>>', headers);
	console.log('putJson:data>>>', data);
	let filename = encodeURIComponent(url);
	if (url.indexOf('http') < 0) {
		if(url.indexOf('/cloud-rbac') >= 0){
			url = BASE_URL_CLOUD_RABC + url;
		}else{
			url = BASE_URL + url;
		}
	}
	var opts = {
		method: 'PUT',
		url: url,
		json: true
	};
	if (headers['content-type']) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.headers['content-type'] = headers['content-type'];
	}
	if (headers['jwt-token']) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.headers['jwt-token'] = headers['jwt-token'];
	}
	if (headers['content-type'] && headers['content-type'].indexOf('application/x-www-form-urlencoded') >= 0) {
		if (!opts.headers) {
			opts.headers = {};
		}
		opts.form = data;
	} else {
		opts.body = data;
	}
	request(opts, function (error, ret, body) {
		if (error) {
			console.log('putJson result:ERROR>>>', error);
			let result = jsonDB.getData(filename);
			callback(result);
		}
		if (body) {
			console.log('putJson result:OK>>>', body);
			callback(body);
			jsonDB.saveData(filename, body);
		}
	});
};
module.exports = {
	getJson: getJson,
	postJson: postJson,
	deleteJson: deleteJson,
	putJson: putJson
};
