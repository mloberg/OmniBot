class Listener
  constructor: (@robot, @matcher, @callback) ->

  call: (from, to, message) ->
    if match = @matcher message
      if @callback
        @callback new @robot.Response(@robot, from, to, message, match)
      true
    else
      false

class TextListener extends Listener
  constructor: (@robot, @regex, @callback) ->
    @matcher = (message) ->
      message.match @regex

exports.Listener = Listener
exports.TextListener = TextListener
