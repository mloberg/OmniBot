Path = require 'path'
irc = require 'irc'
winston = require 'winston'

{TextListener} = require './listener'
{Response} = require './response'

class Robot
  constructor: (@name, server, config) ->
    self = @
    config.autoConnect = false
    @connection = new irc.Client server, @name, config
    @listeners = []
    @Response = Response
    @connection.connect 3, ->
      self._listen()

  shutdown: (callback) ->
    @connection.disconnect '', callback

  say: (to, msg) ->
    @connection.say to, msg

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
