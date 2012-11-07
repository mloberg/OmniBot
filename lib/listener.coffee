class Listener
  constructor: (@robot, @matcher, @callback) ->

  call: (message) ->
    if match = @matcher message
      @callback() if @callback
      true
    else
      false

class TextListener extends Listener
  constructor: (@robot, @regex, @callback) ->
    @matcher = (message) ->
      message.match @regex

exports.Listener = Listener
exports.TextListener = TextListener
