var http = require('http');
var express = require('express');
var cors = require('cors');
var httpRequest = require('./utils/http-request');
var port = 3000;
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var issue2options = {
	origin: true,
	methods: ['POST', 'GET'],
	credentials: true,
	maxAge: 3600
};
app.use(cors(issue2options));

process.title = 'Test Web Server';

console.log(`__dirname>>>${__dirname}`);
console.log('process.cwd()' + process.cwd())
app.use('/', express.static(process.cwd() + '/dist'));
const apiList = [
	{
		url: '/cloud-rbac/resource/tree/local',
		api: './api/menu'
	}
];

app.use(function (req, res, next) {
	console.log(`path=${req.path},method=${req.method}`);
	let path = req.path;
	let found = false;
	for (let i = 0; i < apiList.length; i++) {
		if (path.indexOf(apiList[i].url) === 0) {
			found = true;
			break;
		}
	}
	if (found) {
		next();
	} else {
		if (req.method.toLowerCase() === 'get') {
			httpRequest.getJson(path, req.headers, req.query, function (ret) {
				res.send(ret);
			});
		} else if (req.method.toLowerCase() === 'delete') {
			httpRequest.deleteJson(path, req.headers, req.body, function (ret) {
				res.send(ret);
			});
		} else if (req.method.toLowerCase() === 'put') {
			httpRequest.putJson(path, req.headers, req.body, function (ret) {
				res.send(ret);
			});
		} else {
			httpRequest.postJson(path, req.headers, req.body, function (ret) {
				res.send(ret);
			});
		}
	}
});
for (let i = 0; i < apiList.length; i++) {
	app.use('', require(apiList[i].api));
}

var server = http.createServer(app);
process.on('uncaughtException', function (err) {
	console.log('uncaughtException ' + err);
	console.log('uncaughtException ' + err.stack);
});
server.listen(port, function () {
	console.log('Server listen on port ', {port: port});
});
