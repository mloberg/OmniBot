exports.help = {};

exports.register = function(command, help) {
	this.help[command] = help;
};

exports.listen = function(robot) {
	robot.hear(/(me) help ?(.*)/, function(match, room, from) {
		var help = robot.help.help,
			command = match[1];
		if (!command) {
			robot.say(room, "I respond to the following commands:");
			for (var command in help) {
				robot.say(room, " * " + command);
			}
			robot.say(room, "For more information on a command type '" + robot.name + "' help [command]");
		} else if (help[command]) {
			robot.say(room, help[command]);
		} else {
			robot.say(room, "No information for '" + command + "'.");
		}
	});
};
