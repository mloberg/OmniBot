module.exports = function(robot) {
	robot.hear(/^module test/, function(match, room, from) {
		return true;
	});
};
