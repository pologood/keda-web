var fs = require('fs');

var saveData = function (filename, data) {
	let path = process.cwd() + '/test/webserver/data/' + filename + '.json';
	fs.writeFile(path, JSON.stringify(data), function (err) {
		console.log(err);
	});
};

var getData = function (filename) {
	try {
		let path = process.cwd() + '/test/webserver/data/' + filename + '.json';
		return JSON.parse(fs.readFileSync(path, 'utf8'));
	} catch (e) {
		return {};
	}
};

module.exports = {
	saveData: saveData,
	getData: getData
};
