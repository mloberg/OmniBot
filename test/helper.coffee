irc = require 'irc'
{Server} = require '../node_modules/ircdjs/lib/server'

exports.server = (port, callback) ->
  server = new Server()
  server.showLog = false
  server.config = {
    network: 'ircn',
    hostname: 'localhost',
    serverDescription: 'OmniBot test',
    serverName: 'ircd',
    port: port
  }
  server.start callback
  return server

exports.listener = (port, callback) ->
  listener = new irc.Client 'localhost', 'Listener', {
    autoConnect: false,
    port: port,
    channels: [ '#bot' ]
  }
  listener.connect 3, callback
  return listener

exports.mockRobot = {
  Response: ->
}
