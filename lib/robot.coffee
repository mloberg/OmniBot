Path = require 'path'
irc = require 'irc'
httpClient = require 'scoped-http-client'

{TextListener} = require './listener'
{Response} = require './response'

class Robot
  # Create a new chat robot
  #
  # name   - A String of the NICK of the robot
  # config - An Object of irc server connection options
  # httpd  - An object of httpd server options
  constructor: (@name, config, httpd) ->
    config.autoConnect = false
    server = config.server
    @connection = new irc.Client server, @name, config
    @listeners = []
    @Response = Response
    @setupExpress(httpd) if httpd

  # Public: Start the chat bot
  # 
  # callback - A Function to run once started
  # 
  # Returns nothing.
  start: (callback) ->
    @connection.connect 3, =>
      callback() if callback
      @_listen()

  # Public: Shutdown the chat bot
  # 
  # callback - A Function to call once disconnected
  # 
  # Returns nothing.
  shutdown: (callback) ->
    @connection.disconnect '', callback
    @server.close() if @httpd

  # Public: Say something.
  # 
  # to  - A String of the target (room or nick)
  # msg - A String of the message to send
  # 
  # Returns nothing.
  say: (to, msg) ->
    @connection.say to, msg

  # Public: Respond to a message directed at the bot.
  # 
  # regex    - A Regex to match message
  # callback - A Function to call if matched
  # 
  # Returns nothing.
  respond: (regex, callback) ->
    re = regex.toString().split('/')
    re.shift() # remove empty first item
    modifiers = re.pop() # pop off modifiers

    if re[0] and re[0][0] is '^'
      console.log "WARNING: Anchors don't work well with respond. Try using 'hear' instead."

    pattern = re.join('/')
    regex = new RegExp("^#{@name}[:,]?\\s*(?:#{pattern})", modifiers);

    @listeners.push new TextListener(@, regex, callback)

  # Public: Respond to any message.
  # 
  # regex    - A Regex to match message
  # callback - A Function to call if matched
  # 
  # Returns nothing.
  hear: (regex, callback) ->
    @listeners.push new TextListener(@, regex, callback)

  # Public: Creates a scoped http client
  # 
  # url - String URL to access
  # 
  # Examples:
  #   res.http("http://example.com")
  #     # set a single header
  #     .header('Authorization', 'bearer abcdef')
  #     # set multiple headers
  #     .headers(Authorization: 'bearer abcdef', Accept: 'application/json')
  #     # add URI query parameters
  #     .query(a: 1, b: 'foo & bar')
  #     # make the actual request
  #     .get() (err, res, body) ->
  #       console.log body
  #     # or, you can post data
  #     .post(data) (err, res, body) ->
  #       console.log body
  # 
  # Returns a ScopedClient instance.
  http: (url) ->
    httpClient.create(url)

  # Create the event listeners in irc.
  # 
  # Returns nothing
  _listen: ->
    @connection.addListener 'message', (nick, to, text, message) =>
      # Private Message
      if to is @name
        text = "#{@name} #{text}"
        to = null
      for listener in @listeners
        listener.call nick, to, text

  # Public: Setup the Express httpd server.
  # 
  # opts - An Object of server options
  # 
  # Returns nothing.
  setupExpress: (opts) ->
    user = opts.user
    pass = opts.pass

    Express = require 'express'

    @httpd = Express()

    @httpd.use Express.basicAuth(user, pass) if user and pass
    @httpd.use Express.methodOverride()
    @httpd.use Express.bodyParser()
    @httpd.use @httpd.router

    @server = @httpd.listen opts.port or 8080

module.exports = Robot
