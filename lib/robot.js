var connectors = require('./connectors'),
	fs = require("fs"),
	Path = require("path"),
	helpers = require('./helpers');

exports.Bot = Bot;
exports.helpers = helpers;

/**
 * Create a new bot.
 *
 * @param {String} name Bot name
 * @param {String} connector Connector type (irc)
 * @param {Object} connection Connection config 
 * @class Bot
 */
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
// Bot.prototype.name = "OmniBot";
Bot.prototype.connection = null;
Bot.prototype.listeners = [];
Bot.prototype.config = {};
Bot.prototype.commands = {};

/**
 * Run a callback once a connection is established.
 *
 * @param {Integer} ms Time to wait between checks
 * @param {Object} con Connection object
 * @param {Function} callback Callback to run once connected
 */
function waitForConnection(ms, con, callback) {
	if (con.connected) {
		callback();
		return;
	}
	setTimeout(function() {
		waitForConnection(ms, con, callback);
	}, ms);
}

/**
 * Run a callback once the bot is booted and connected.
 *
 * @param {Function} callback Callback to run
 */
Bot.prototype.boot = function(callback) {
	var con = this.connection;
	con.connect();
	waitForConnection(1000, con, callback);
};

/**
 * Say something.
 *
 * @param {String} to Who to say it to
 * @param {String} msg The message
 */
Bot.prototype.say = function(to, msg) {
	this.connection.say(to, msg);
};

/**
 * Load a directory of modules.
 *
 * @param {String} path Path to load
 */
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

/**
 * Load a single module.
 *
 * @param {String} module Module path.
 */
Bot.prototype.loadModule = function(module) {
	this.loadFile(Path.resolve(module));
};

/**
 * Load a module for use with the bot.
 *
 * @param {String} file File location
 */
Bot.prototype.loadFile = function(file) {
	var robot = this;
	return require(file)(robot);
};

/**
 * Listen for something in the channel.
 *
 * @param {String|Regex} hear String/Regex to listen for
 * @param {Function} callback Callback to run
 */
Bot.prototype.hear = function(regex, callback) {
	if (typeof regex !== "string") {
		regex = regex.toString();
		regex = regex.slice(1, regex.length - 1);
	}
	regex = new RegExp(regex.replace('(me)', this.name + ':?'), 'i');
	this.listeners.push({ regex: regex, callback: callback });
};

/**
 * Register help.
 *
 * @param {String} command Short command
 * @param {String} usage Command usage
 * @param {String} description Command description
 */
Bot.prototype.help = function(command, usage, description) {
	this.commands[command] = { usage: usage.replace('(me)', this.name + ':'), description: description };
};

/**
 * Display help for a command.
 *
 * @param {String} command Command to display help for
 * @parma {String} room Room to talk to
 */
Bot.prototype.displayHelp = function(command, room) {
	if (!command) {
		this.say(room, "I respond to the following commands: " + Object.keys(this.commands).join(", ") + ".");
		this.say(room, "For more information on a command type '" + this.name + ": help [command]'");
	} else if (this.commands[command]) {
		var help = this.commands[command];
		this.say(room, command + ": " + help.description);
		this.say(room, "Usage: " + help.usage);
	} else {
		this.say(room, "No help found for '" + command + "'.");
	}
};

/**
 * Listen to the channel.
 */
Bot.prototype.listen = function() {
	var self = this,
		listeners = this.listeners,
		helpRegex = new RegExp(this.name + ':? help ?(.*)?');
	this.connection.client.addListener('message', function(from, room, text, message) {
		if (from === self.name) return;
		// check for help
		var help = text.match(helpRegex);
		if (help) {
			var command = help[1];
			return self.displayHelp(command, room);
		}
		// loop through listeners
		for (var i = listeners.length - 1; i >= 0; i--) {
			var match = text.match(listeners[i].regex);
			if (match) {
				return listeners[i].callback(match, room, from);
			}
		}
	});
};

/**
 * Check if the bot will respond to a command.
 *
 * @param {String} text Text to check
 * @return {Boolean} True if bot will respond to text.
 */
Bot.prototype.respondsTo = function(text) {
	var listeners = this.listeners;
	for (var i = listeners.length - 1; i >= 0; i--) {
		if (text.match(listeners[i].regex)) return true;
	}
	return false;
};
