---
layout: default
---
OmniBot is a simple chat bot written in NodeJS. It was originally written as a company IRC bot, and then rewritten to be more extendable. It only supports IRC, but there are plans to add more connectors.

### Installing

OmniBot is on the npm registry, so installing it is as simple as:

	npm install omnibot

### Usage

Create a basic bot with two lines.

{% highlight javascript %}
var OmniBot = require('omnibot'),
	bot = new OmniBot.Bot('Bot Name', 'connector', { options: 'connection options' });
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

I'd love to include your contributions for OmniBot. Fork [OmniBot](https://github.com/mloberg/OmniBot), run `npm install`, and add your changes. Please make sure all existing tests pass (`make test`), and write tests for the new things you've added/changed ([Mocha](https://github.com/visionmedia/mocha)/[Should](https://github.com/visionmedia/should.js)). Once all your tests pass, open up a pull request.

You can also contribute by [reporting](https://github.com/mloberg/OmniBot/issues) any bugs you find.
