// require OmniBot
var OmniBot = require('omnibot');

// create a new bot
var bot = new OmniBot.Bot('Bot Name', 'irc', { server: 'irc.example.com', channels: [ '#omnibot' ] });

// any config options from modules can be add here
bot.config.wordnikApiKey = 'your-wordnik-api-key';

// boot up the bot, and run the callback once he is connected
bot.boot(function() {
	// load modules from directory
	bot.loadModules('modules');
	// start listening
	bot.listen();
	// say something
	bot.say('#omnibot', 'Hello world!');
});
