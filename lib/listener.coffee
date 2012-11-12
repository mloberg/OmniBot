class Listener
  # Listeners recieve every message and decide if they want to act
  # on it.
  # 
  # robot    - A Robot instance
  # matcher  - A Function that determines if this Listener should tigger
  #            the callback.
  # callback - A Function that is triggered if the incoming message
  #            matches.
  constructor: (@robot, @matcher, @callback) ->

  # Public: Determine if the listener will respond to the message.
  # If it will, a Response is built from the message information
  # and passed to the callback.
  # 
  # from    - A String of the Nick sending the message
  # to      - A String of where the message was recieved
  # message - A String of the message
  # 
  # Returns Boolean if the matcher matched.
  call: (from, to, message) ->
    if match = @matcher message
      if @callback
        @callback new @robot.Response(@robot, from, to, message, match)
      true
    else
      false

class TextListener extends Listener
  # A TextListener is a Listener that uses a Regex to determine if they
  # want to act on it.
  # 
  # robot    - A Robot instance
  # regex    - A Regex that determines if this Listener should trigger
  #            the callback.
  # callback - A Function that is triggered if the incoming message
  #            matches.
  constructor: (@robot, @regex, @callback) ->
    @matcher = (message) ->
      message.match @regex

exports.Listener     = Listener
exports.TextListener = TextListener
