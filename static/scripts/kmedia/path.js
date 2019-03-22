function getLocalPath (dir) {
	return document.location.protocol + '//' + document.location.host + (dir || '/kmedia2');
}