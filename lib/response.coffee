class Response
  constructor: (@robot, @from, @to, @message, @match) ->

  send: (msg) ->
    target = @to or @from
    @robot.say target, msg

  random: (items) ->
    items[Math.floor(Math.random() * items.length)]

  http: (url) ->
    @robot.http(url)

exports.Response = Response
