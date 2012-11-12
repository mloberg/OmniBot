class Response
  # Response holds all the information from a message that was matched.
  # 
  # robot   - A Robot instance
  # from    - A String of Nick who sent the message
  # to      - A String of where the message was recieved
  # message - A String of the message
  # match   - A Match object from Listener
  constructor: (@robot, @from, @to, @message, @match) ->

  # Public: Send a message where the message originated from.
  # 
  # msg - A String of the message to send
  # 
  # Returns nothing.
  send: (msg) ->
    target = @to or @from
    @robot.say target, msg

  # Public: Return a random item from an array.
  # 
  # items - An Array of items.
  # 
  # Returns random item.
  random: (items) ->
    items[Math.floor(Math.random() * items.length)]

  # Public: Create a scoped http client instance.
  # 
  # url - A String
  # 
  # Returns a ScopedClient instance.
  http: (url) ->
    @robot.http(url)

module.exports = Response
