Path       = require 'path'
Fs         = require 'fs'
irc        = require 'irc'
httpClient = require 'scoped-http-client'
winston    = require 'winston'

Brain          = require './brain'
Response       = require './response'
{TextListener} = require './listener'

class Robot
  # Create a new chat robot.
  #
  # name   - A String of the NICK of the robot
  # config - An Object of irc server connection options
  # httpd  - A Boolean or An object of httpd server options
  constructor: (@name, config, httpd) ->
    @brain     = new Brain
    @config    = {}
    @listeners = []
    @Response  = Response
    @logger    = new (winston.Logger) {
      transports: [
        new (winston.transports.Console)()
      ]
    }

    @setupIRC config
    @setupConnect(httpd) if httpd

  # Public: Connect the bot to the server.
  # 
  # callback - A Function to run once started
  # 
  # Returns nothing.
  start: (callback) ->
    @connection.connect =>
      @logger.info "Connected to the server"
      callback() if callback

  # Public: Shutdown the chat bot.
  # 
  # callback - A Function to call once disconnected
  # 
  # Returns nothing.
  shutdown: (callback) ->
    @connection.disconnect =>
      @logger.info "Disconnected from server"
      callback() if callback
      @server.close() if @server
      @brain.close()

  # Public: Set a config item.
  # 
  # name  - A String of the config item name
  # value - A Mixed of the config item value
  # 
  # Returns nothing.
  set: (name, value) ->
    @config[name] = value

  # Public: Get a config item.
  # 
  # name - A String of the config item name
  # 
  # Returns Mixed item value
  get: (name) ->
    @config[name]

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
    @logger.debug regex.toString()

  # Public: Respond to any message.
  # 
  # regex    - A Regex to match message
  # callback - A Function to call if matched
  # 
  # Returns nothing.
  hear: (regex, callback) ->
    @listeners.push new TextListener(@, regex, callback)
    @logger.debug regex.toString()

  # Public: Load a path of modules into the bot
  # 
  # path - A String of the path to load
  # 
  # Returns nothing.
  load: (path) ->
    if Fs.existsSync path
      for file in Fs.readdirSync path
        @loadFile path, file

  # Public: Load modules from omnibot-modules
  # 
  # modules - An array of modules to load
  # 
  # Returns nothing.
  loadModules: (modules) ->
    path = './node_modules/omnibot-modules/src/modules'
    for module in modules
      @loadFile path, "#{module}.coffee"

  # Load a file into the bot.
  # 
  # path - A String of the path
  # file - A String of the file name to load
  # 
  # Returns nothing.
  loadFile: (path, file) ->
    ext = Path.extname file
    full = Path.join path, Path.basename(file, ext)
    if ext is '.coffee' or ext is '.js'
      try
        require(Path.resolve(full))(@)
      catch err
        @logger.error "Unable to load #{full}", err

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

  # Setup the IRC client.
  # 
  # config - An Object of IRC connection options.
  # 
  # Returns nothing.
  setupIRC: (config) ->
    config.autoConnect = false # Don't connect until start() is called
    server = config.server
    @connection = new irc.Client server, @name, config

    @connection.addListener 'message', (nick, to, text, raw) =>
      if to is @name
        text = "#{@name} #{text}"
        to = null
      for listener in @listeners
        listener.call nick, to, text

  # Setup the Connect httpd server.
  # 
  # opts - An Object of server options
  # 
  # Returns nothing.
  setupConnect: (opts) ->
    user = opts.user
    pass = opts.pass

    Connect = require 'connect'
    Connect.router = require 'connect_router'

    @connect = Connect()

    @connect.use Connect.basicAuth(user, pass) if user and pass
    @connect.use Connect.bodyParser()
    @connect.use Connect.router (app) =>
      @router =
        get: (route, callback) =>
          @logger.debug "Registered route: GET #{route}"
          app.get route, callback
        post: (route, callback) =>
          @logger.debug "Registered route: POST #{route}"
          app.get route, callback
        put: (route, callback) =>
          @logger.debug "Registered route: PUT #{route}"
          app.put route, callback
        delete: (route, callback) =>
          @logger.debug "Registered route: DELETE #{route}"
          app.delete route, callback

    @server = @connect.listen opts.port or 8080

module.exports = Robot
