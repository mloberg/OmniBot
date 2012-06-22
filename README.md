# OmniBot

OmniBot is a simple chat bot.

## Usage

	var OmniBot = require('omnibot');

	var bot = new OmniBot('Bot Name', 'connector', { options: 'connection options' });

	bot.config.option = '';

	bot.boot(function() {
		bot.loadModules('modules');
		bot.listen();
	});
