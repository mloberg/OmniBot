---
layout: default
title: API
---
### API Reference

#### Robot(name, config, httpd)

Create a new Robot.

{% highlight coffeescript %}
Robot = require 'omnibot'

config =
  server: 'irc.example.com'
  channels: [ '#list', '#of', '#channels' ]
  port: 6667
  password: 'server-password'

httpd =
  port: 8080
  user: 'username'
  password: 'password'

bot = new Robot 'Name', config, httpd
{% endhighlight %}

##### bot.start(callback)

Start the bot and connect to IRC.

{% highlight coffeescript %}
bot.start ->
  # Say hi or load modules
{% endhighlight %}

##### bot.shutdown(callback)

Close the IRC connection.

{% highlight coffeescript %}
bot.shutdown ->
  # Do some cleanup
{% endhighlight %}

##### bot.say(to, message)

Send a message to a channel or user.

{% highlight coffeescript %}
bot.say '#channel', 'Message to the channel'
bot.say 'Nick', 'Private message'
{% endhighlight %}

##### bot.respond(regex, callback)

Respond to a message aimed at the bot. Callback recieves a new [Response](response.html) instance.

{% highlight coffeescript %}
bot.respond /foo/, (resp) ->
  resp.send 'bar'
{% endhighlight %}

##### bot.hear(regex, callback)

Respond to a message. Callback recieves a new [Response](response.html) instance.

{% highlight coffeescript %}
bot.hear /hello/, (resp) ->
  resp.send 'hello'
{% endhighlight %}


##### bot.load(path)

Load a directory of modules.

{% highlight coffeescript %}
bot.load './modules'
{% endhighlight %}

##### bot.loadModules(modules)

Load a list of [OmniBot-Modules](/modules/).

{% highlight coffeescript %}
modules = [ 'joke', 'join', 'weather' ]
bot.loadModules modules
{% endhighlight %}

##### bot.loadFile(path, file)

Load a single module.

{% highlight coffeescript %}
bot.load './modules', 'foo'
{% endhighlight %}

##### bot.http(url)

Return a new [Scoped HTTP Client](https://github.com/technoweenie/node-scoped-http-client).

{% highlight coffeescript %}
bot.http("https://github.com/mloberg/OmniBot")
  .get() (err, res, body) ->
    console.log body
{% endhighlight %}

##### bot.set(name, value)

Set a config item's value.

{% highlight coffeescript %}
bot.set 'foo', 'bar'
{% endhighlight %}

##### bot.get(name)

Get a config item's value.

{% highlight coffeescript %}
bot.get 'foo' # => bar
{% endhighlight %}

##### bot.router

The bot includes a Connect httpd server if a third option was passed when creating the bot.

{% highlight coffeescript %}
bot.router.get '/info', (req, res) ->
  res.end "OmniBot info"
{% endhighlight %}

##### bot.connection

The [IRC adapter](https://node-irc.readthedocs.org/en/latest/API.html).

#### Response

The Response class is used when making a callback using the `Robot.respond` or `Robot.hear` methods.

##### response.from

The Nick of the user that sent the message.

##### response.to

Where the message was recieved. If a private message, it will be null.

##### response.message

The message text.

##### response.match

An array of matches from the message.

##### response.send(message)

Send a response back. Will be sent to `resp.to` if not null, otherwise `resp.from`.

##### response.random(items)

Select a random item from an array of items.

##### response.http(url)

Return a [Scoped HTTP Client](https://github.com/technoweenie/node-scoped-http-client).
