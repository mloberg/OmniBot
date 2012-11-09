# OmniBot

[![Build Status](https://secure.travis-ci.org/mloberg/OmniBot.png?branch=master)](https://travis-ci.org/mloberg/OmniBot)

OmniBot is a simple IRC chat bot written in NodeJS and CoffeeScript.

## Installing

	npm install omnibot

## Usage

	Robot = require 'omnibot'

	ircSettings = {
		server: 'irc.example.com',
		channels: [ '#channel' ]
	}

	bot = new Robot 'BotName', ircSettings

	bot.start

## Modules

Modules are ways of extending OmniBot without editing OmniBot's source code. There is a set of [modules](https://github.com/mloberg/OmniBot-Modules) I have written, or you can also write your own. Some Hubot scripts may also be compatible with OmniBot.

## Contributing

OmniBot is Open Source. If you have something that you would like to add to OmniBot, please open a pull request. Please note that changes without passing tests will not be accepted.
