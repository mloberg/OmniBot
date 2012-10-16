module.exports = function(robot) {
	robot.help("test", "module test", "Help description.");
	robot.hear(/^module test/, function(match, room, from) {
		return true;
	});
};
