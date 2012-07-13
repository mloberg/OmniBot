# OmniBot

OmniBot is a simple chat bot written in NodeJS. It only supports IRC at this time.

## Installing

	npm install omnibot

## Usage

	var OmniBot = require('omnibot');

	var bot = new OmniBot.Bot('Bot Name', 'connector', { options: 'connection options' });

	bot.config.option = '';

	bot.boot(function() {
		bot.loadModules('modules');
		bot.listen();
	});

## Modules

Modules are ways of extending OmniBot without editing OmniBot's source code. There is a set of [modules](https://github.com/mloberg/OmniBot-Modules) I have written, or you can also write your own.

## Contributing

I'd love to include your contributions for OmniBot. Fork this repository, run `npm install`, and add your changes. Please make sure all existing tests pass (`make test`), and write tests for the new things you've added/changed ([Mocha](https://github.com/visionmedia/mocha)/[Should](https://github.com/visionmedia/should.js)). Once all your tests pass, open up a pull request.
