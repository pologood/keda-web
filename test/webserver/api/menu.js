const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = module.exports = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/cloud-rbac/resource/tree/local', (req, res) => {
	console.info('req.params>>>', req.query);
	let jsonObj = JSON.parse(fs.readFileSync(process.cwd() + '/test/webserver/api/menu.json', 'utf8'));
	res.status(200).json(jsonObj);
});
