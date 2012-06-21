var connectors = require('./connectors'),
	fs = require("fs"),
	Path = require("path"),
	helpers = require('./helpers');

module.exports = Robot;

function Robot(name, connector, connection) {
	var self = this;
	this.name = name || "OmniBot";
	connection.name = this.name;
	switch (connector) {
		case "irc":
			self.connection = new connectors.IRC(connection);
			break;
		default:
			// 
	}
}

Robot.prototype.helpers = helpers;
Robot.prototype.name = "OmniBot";
Robot.prototype.connection = null;
Robot.prototype.listeners = [];

function waitForConnection(ms, con, callback) {
	if (con.connected) {
		callback();
		return;
	}
	setTimeout(function() {
		waitForConnection(ms, con, callback);
	}, ms);
}

Robot.prototype.boot = function(callback) {
	var con = this.connection;
	con.connect();
	waitForConnection(1000, con, callback);
};

Robot.prototype.say = function(room, msg) {
	this.connection.say(room, msg);
};

Robot.prototype.loadModules = function(path) {
	path = Path.resolve(path);
	var self = this,
		files = fs.readdirSync(path),
		results = [];
	for (var i = 0; i < files.length; i++) {
		results.push(self.loadFile(path + "/" + files[i]));
	}
	return results;
};

Robot.prototype.loadFile = function(file) {
	var robot = this;
	return require(file)(robot);
};

Robot.prototype.hear = function(regex, callback) {
	if (typeof regex !== "string") {
		console.log(regex);
		regex = regex.toString();
		regex = regex.slice(1, regex.length - 1);
	}
	regex = new RegExp("^" + regex.replace('(me)', this.name + ':?'));
	this.listeners.push({regex: regex, callback: callback});
};

Robot.prototype.listen = function() {
	var listeners = this.listeners;
	console.log(listeners);
	this.connection.client.addListener('message', function(from, room, text, message) {
		for (var i = listeners.length - 1; i >= 0; i--) {
			var match = text.match(listeners[i].regex);
			if (match) {
				listeners[i].callback(match, room, from);
			}
		};
	});
};
