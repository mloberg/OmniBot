var irc = require("irc");

function mergeObjects(obj1, obj2) {
	var obj = {};
	for (var attrname in obj1) { obj[attrname] = obj1[attrname]; }
	for (var attrname in obj2) { obj[attrname] = obj2[attrname]; }
	return obj;
}

exports.IRC = IRC;

function IRC(details) {
	var opts = details,
		server = opts.server,
		name = opts.name;
	details.autoConnect = false;
	delete opts.server;
	delete opts.name;
	this.client = new irc.Client(server, name, opts);
}

IRC.prototype.client = null;
IRC.prototype.connected = false;

IRC.prototype.connect = function() {
	var self = this;
	this.client.connect();
	this.client.addListener('registered', function(msg) {
		self.connected = true;
	});
};

IRC.prototype.say = function(room, msg) {
	this.client.say(room, msg);
};
