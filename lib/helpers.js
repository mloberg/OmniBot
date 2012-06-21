var	QueryString = require("querystring"),
	Url         = require("url"),
	Http        = require("http"),
	Https       = require("https");

/*
rest.request({
	method: '',
	url: '',
	data: {},
	type: 'text/json',
	onFailure: function() {},
	onSuccess: function() {}
});
*/

exports.request = function(options) {
	var protocol, req, onSuccess, onFailure, url, returnType;

	// callback
	onSuccess = options.onSuccess;
	delete options.onSuccess;
	onFailure = options.onFailure;
	delete options.onFailure;
	returnType = options.type ? options.type : 'text';
	delete options.type;

	// request info
	if(options.method)
		options.method = options.method.toUpperCase();
	url = Url.parse(options.url);
	delete options.url;
	options.host = url.host;
	options.path = url.path;
	if(options.data) {
		if(typeof options.data === 'object') {
			options.data = QueryString.stringify(options.data);
		}
		if(options.path.indexOf('?') === -1) {
			options.path += '?';
		} else {
			options.path += '&';
		}
		options.path += options.data;
		delete options.data;
	}

	protocol = url.protocol == 'https:' ? Https : Http;

	req = protocol.request(options, function(res) {
		var output = '';
		res.setEncoding('utf8');

		res.on('data', function(chunk) {
			output += chunk;
		});

		res.on('end', function() {
			if(returnType.toLowerCase() === 'json') {
				output = JSON.parse(output);
			}
			if(onSuccess) {
				onSuccess(output, res);
			}
		});
	});
	req.on('error', function(e) {
		if(onFailure) {
			onFailure(e);
		}
	});
	req.end();
};

exports.get = function(options) {
	return this.request(options);
};

exports.post = function(options) {
	options.method = 'POST';
	return this.request(options);
};

exports.getJSON = function(options) {
	options.type = 'json';
	return this.request(options);
};
