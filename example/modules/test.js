var traps = [
	"http://dayofthejedi.com/wp-content/uploads/2011/03/171.jpg",
	"http://dayofthejedi.com/wp-content/uploads/2011/03/152.jpg",
	"http://farm4.static.flickr.com/3572/3637082894_e23313f6fb_o.jpg",
	"http://www.youtube.com/watch?v=dddAi8FF3F4",
	"http://6.asset.soup.io/asset/0610/8774_242b_500.jpeg",
	"http://files.g4tv.com/ImageDb3/279875_S/steampunk-ackbar.jpg",
	"http://farm6.staticflickr.com/5126/5725607070_b80e61b4b3_z.jpg",
	"http://www.x929.ca/shows/newsboy/wp-content/uploads/admiral-ackbar-mouse-trap.jpg",
	"http://farm6.static.flickr.com/5291/5542027315_ba79daabfb.jpg",
	"http://farm5.staticflickr.com/4074/4751546688_5c76b0e308_z.jpg",
	"http://farm6.staticflickr.com/5250/5216539895_09f963f448_z.jpg"
];
var alots = [
	"http://4.bp.blogspot.com/_D_Z-D2tzi14/S8TRIo4br3I/AAAAAAAACv4/Zh7_GcMlRKo/s400/ALOT.png",
	"http://3.bp.blogspot.com/_D_Z-D2tzi14/S8TTPQCPA6I/AAAAAAAACwA/ZHZH-Bi8OmI/s1600/ALOT2.png",
	"http://2.bp.blogspot.com/_D_Z-D2tzi14/S8TiTtIFjpI/AAAAAAAACxQ/HXLdiZZ0goU/s320/ALOT14.png",
	"http://fc02.deviantart.net/fs70/f/2010/210/1/9/Alot_by_chrispygraphics.jpg"
];

module.exports = function(robot) {
	robot.hear(/trap/, function(match, room, from) {
		var trap = traps[Math.floor(Math.random() * traps.length)];
		robot.say(room, trap);
	});
	robot.hear("alot", function(match, room, from) {
		var alot = alots[Math.floor(Math.random() * alots.length)];
		robot.say(room, alot);
	});
	robot.hear(/chuck norris/, function(match, room, from) {
		robot.helpers.getJSON({
			url: 'http://api.icndb.com/jokes/random',
			onSuccess: function(result) {
				robot.say(room, result.value.joke);
			}
		});
	});
};
