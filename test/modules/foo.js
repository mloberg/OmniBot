module.exports = function(robot) {
	robot.hear(/foo/, function(match, room, from) {
		robot.say(room, "bar");
	});
};
