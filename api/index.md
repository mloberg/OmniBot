---
layout: default
title: API
---
### API

#### OmniBot

##### new OmniBot(nick, connector, options)

Create a new bot.

###### IRC

{% highlight javascript %}
var bot = new OmniBot('Bot', 'irc', {
	channels: [ '#channel' ]
});
{% endhighlight %}

##### bot.boot(callback)

Start the bot.

{% highlight javascript %}
bot.boot(function() {
	// do stuff once while the bot is connected
});
{% endhighlight %}

##### bot.say(to, msg)

Say something.

{% highlight javascript %}
bot.say('#irc_channel', "Message to a channel.");
bot.say('user', "Private message to a user.");
{% endhighlight %}

##### bot.hear(regex, callback)

Run a callback when a regex is matched to something a user says.

{% highlight javascript %}
bot.hear(/foobar/, function(match, room, from) {
	// 
});
{% endhighlight %}

There is a special regex `(me)` which is replaced with the bot's Nickname.

{% highlight javascript %}
bot.hear(/(me) hi/, function(match, room, from) {
	bot.say(room, "Hi " + from);
});
{% endhighlight %}

##### bot.loadModules(directory)

Load all modules from a directory.

{% highlight javascript %}
bot.loadModules('modules');
{% endhighlight %}

##### bot.loadFile(file)

Load a module.

{% highlight javascript %}
bot.loadFile('./modules/aws');
{% endhighlight %}

##### bot.listen()

Start listening to the chatter and matching regexes.

{% highlight javascript %}
bot.listen();
{% endhighlight %}

##### bot.name

Get the bot's nickname.

{% highlight javascript %}
bot.name;
{% endhighlight %}

##### bot.config

Add a config item for a module.

{% highlight javascript %}
bot.config.configItem = 'config value';
{% endhighlight %}

##### bot.connection

Return the connector.

{% highlight javascript %}
bot.connection;
{% endhighlight %}

##### bot.helpers

Return the helpers class, which right now is a wrapper for the http and https node modules.

{% highlight javascript %}
bot.helpers;
{% endhighlight %}

#### helpers

##### helpers.request(opts)

Request a web page.

{% highlight javascript %}
helpers.request({
	method: 'GET', // GET or POST, default GET
	url: 'http://example.com/', // the request url
	data: { }, // any data
	type: 'text', // text or json
	onFailure: function(err) {
		// called when the request fails
	},
	onSuccess: function(body, res) {
		// called when the request is successful
	}
});
{% endhighlight %}

##### helpers.get(opts)

Make a GET request.

{% highlight javascript %}
helpers.get({
	url: 'http://example.com/',
	onSuccess: function(body, res) { }
});
{% endhighlight %}

##### helpers.post(opts)

Make a POST request.

{% highlight javascript %}
helpers.post({
	url: 'http://example.com/',
	onSuccess: function(body, res) { }
});
{% endhighlight %}

##### helpers.getJSON(opts)

Make a GET request where the content is JSON encoded.

{% highlight javascript %}
helpers.getJSON({
	url: 'http://example.com/',
	onSuccess: function(obj, res) { }
});
{% endhighlight %}
