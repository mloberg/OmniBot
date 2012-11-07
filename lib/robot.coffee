Path = require 'path'
irc = require 'irc'
winston = require 'winston'

{TextListener} = require './listener'

class Robot
  constructor: (@name, server, config) ->
    config.autoConnect = false
    @connection = new irc.Client server, @name, config
    @listeners = []

  boot: (callback) ->
    @connection.connect 3, callback

  powerOff: (callback) ->
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
    regex = new RegExp("^#{@name}[:,]?\s*(?:#{pattern})", modifiers);
    @listeners.push new TextListener(@, regex, callback)
    # winston.debug "#{regex.toString().replace '\\', '\\'}"

  hear: (regex, callback) ->
    # 

module.exports = Robot
