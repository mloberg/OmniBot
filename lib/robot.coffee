Path = require 'path'
irc = require 'irc'
winston = require 'winston'
httpClient = require 'scoped-http-client'

{TextListener} = require './listener'
{Response} = require './response'

class Robot
  # Create a new chat robot
  #
  # name   - A String of the NICK of the robot
  # server - A String of the irc server address
  # config - An Object of irc server connection options
  constructor: (@name, server, config) ->
    self = @
    config.autoConnect = false
    @connection = new irc.Client server, @name, config
    @listeners = []
    @Response = Response
    @connection.connect 3, ->
      self._listen()

  # Public: Shutdown the chat bot
  # 
  # callback - A Function to call once disconnected
  # 
  # Returns nothing.
  shutdown: (callback) ->
    @connection.disconnect '', callback

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
      winston.warn "Anchors don't work well with respond. Try using 'hear' instead."
    pattern = re.join('/')
    regex = new RegExp("^#{@name}[:,]?\\s*(?:#{pattern})", modifiers);
    @listeners.push new TextListener(@, regex, callback)
    winston.debug "#{regex.toString()}"

  hear: (regex, callback) ->
    @listeners.push new TextListener(@, regex, callback)
    winston.debug "#{regex.toString()}"

  http: (url) ->
    httpClient.create(url)

  _listen: ->
    self = @
    @connection.addListener 'message', (nick, to, text, message) ->
      winston.info "#{nick} -> #{to}: #{text}"
      # Private Message
      if to is @name
        text = "#{@name} #{text}"
        to = null
      for listener in self.listeners
        listener.call nick, to, text

module.exports = Robot
