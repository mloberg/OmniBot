var connectors = require('./connectors'),
	fs = require("fs"),
	Path = require("path"),
	helpers = require('./helpers');

module.exports = OmniBot;

function OmniBot(name, connector, connection) {
	var self = this;
	this.name = name || "OmniOmniBot";
	connection.name = this.name;
	switch (connector) {
		case "irc":
			self.connection = new connectors.IRC(connection);
			break;
		default:
			// 
	}
}

OmniBot.prototype.helpers = helpers;
OmniBot.prototype.name = "OmniOmniBot";
OmniBot.prototype.connection = null;
OmniBot.prototype.listeners = [];
OmniBot.prototype.config = {};

function waitForConnection(ms, con, callback) {
	if (con.connected) {
		callback();
		return;
	}
	setTimeout(function() {
		waitForConnection(ms, con, callback);
	}, ms);
}

OmniBot.prototype.boot = function(callback) {
	var con = this.connection;
	con.connect();
	waitForConnection(1000, con, callback);
};

OmniBot.prototype.say = function(room, msg) {
	this.connection.say(room, msg);
};

OmniBot.prototype.loadModules = function(path) {
	path = Path.resolve(path);
	var self = this,
		files = fs.readdirSync(path),
		results = [];
	for (var i = 0; i < files.length; i++) {
		results.push(self.loadFile(path + "/" + files[i]));
	}
	return results;
};

OmniBot.prototype.loadFile = function(file) {
	var robot = this;
	return require(file)(robot);
};

OmniBot.prototype.hear = function(regex, callback) {
	if (typeof regex !== "string") {
		regex = regex.toString();
		regex = regex.slice(1, regex.length - 1);
	}
	regex = new RegExp(regex.replace('(me)', this.name + ':?'), 'i');
	this.listeners.push({regex: regex, callback: callback});
};

OmniBot.prototype.listen = function() {
	var listeners = this.listeners;
	this.connection.client.addListener('message', function(from, room, text, message) {
		for (var i = listeners.length - 1; i >= 0; i--) {
			var match = text.match(listeners[i].regex);
			if (match) {
				listeners[i].callback(match, room, from);
			}
		};
	});
};
