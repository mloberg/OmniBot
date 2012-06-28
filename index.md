---
layout: default
---
OmniBot is a simple chat bot written in NodeJS. It was originally written to be an IRC bot for the company I work for, and then rewritten to be more extenable. It only supports IRC, but there are plans to add more connectors.

### Installing

OmniBot is on the npm registry, so installing it is as simple as:

	npm install omnibot

### Usage

Create a basic bot with two lines.

{% highlight javascript %}
var OmniBot = require('omnibot'),
	bot = new OmniBot('Bot Name', 'connector', { options: 'connection options' });
{% endhighlight %}

You can start the bot with the `boot` method.

{% highlight javascript %}
bot.boot(function() {
	bot.loadModules('modules');
	bot.listen();
});
{% endhighlight %}

There is more details on the [API](/api/) page.

### Modules

Modules are ways of extending OmniBot. There is a set of [default modules](/modules/), but you can always write your own.

### Contributing

OmniBot is an open source project. Please [fork it](https://github.com/mloberg/OmniBot) and make it better. If you find any bugs, please [report them](https://github.com/mloberg/OmniBot/issues).
