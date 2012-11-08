module.exports = (robot) ->
  robot.respond /bar/, (msg) ->
    msg.send "baz"
