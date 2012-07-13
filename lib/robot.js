var connectors = require('./connectors'),
	fs = require("fs"),
	Path = require("path"),
	helpers = require('./helpers');

exports.Bot = Bot;
exports.helpers = helpers;

function Bot(name, connector, connection) {
	var self = this;
	this.name = name || "OmniBot";
	connection.name = this.name;
	switch (connector) {
		case "irc":
			self.connection = new connectors.IRC(connection);
			break;
		default:
			throw new Error("Unknown connector " + connector);
	}
}

Bot.prototype.helpers = helpers;
Bot.prototype.name = "OmniBot";
Bot.prototype.connection = null;
Bot.prototype.listeners = [];
Bot.prototype.config = {};

function waitForConnection(ms, con, callback) {
	if (con.connected) {
		callback();
		return;
	}
	setTimeout(function() {
		waitForConnection(ms, con, callback);
	}, ms);
}

Bot.prototype.boot = function(callback) {
	var con = this.connection;
	con.connect();
	waitForConnection(1000, con, callback);
};

Bot.prototype.say = function(room, msg) {
	this.connection.say(room, msg);
};

Bot.prototype.loadModules = function(path) {
	path = Path.resolve(path);
	var self = this,
		files = fs.readdirSync(path),
		results = [];
	for (var i = 0; i < files.length; i++) {
		results.push(self.loadFile(path + "/" + files[i]));
	}
	return results;
};

Bot.prototype.loadModule = function(module) {
	this.loadFile(Path.resolve(module));
};

Bot.prototype.loadFile = function(file) {
	var robot = this;
	return require(file)(robot);
};

Bot.prototype.hear = function(regex, callback) {
	if (typeof regex !== "string") {
		regex = regex.toString();
		regex = regex.slice(1, regex.length - 1);
	}
	regex = new RegExp(regex.replace('(me)', this.name + ':?'), 'i');
	this.listeners.push({regex: regex, callback: callback});
};

Bot.prototype.listen = function() {
	var listeners = this.listeners;
	this.connection.client.addListener('message', function(from, room, text, message) {
		for (var i = listeners.length - 1; i >= 0; i--) {
			var match = text.match(listeners[i].regex);
			if (match) {
				return listeners[i].callback(match, room, from);
			}
		}
	});
};

Bot.prototype.respondsTo = function(text) {
	var listeners = this.listeners;
	for (var i = listeners.length - 1; i >= 0; i--) {
		if (text.match(listeners[i].regex)) return true;
	}
	return false;
};
