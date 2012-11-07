Robot = require '../lib/robot'
helper = require './helper'

port = 6662

describe 'Robot', ->
  bot = null
  listener = null
  server = null

  beforeEach (done) ->
    server = helper.server port, ->
      bot = new Robot 'OmniBot', 'localhost', {
        port: port,
        channels: [ '#bot' ]
      }
      listener = helper.listener port, ->
        bot.boot done

  afterEach (done) ->
    bot.powerOff ->
      listener.disconnect '', ->
        server.close done

  it 'should have same name', ->
    expect(bot.name).toEqual('OmniBot')

  it 'can speak', (done) ->
    message = 'Hello World!'
    listener.addListener 'message#bot', (nick, text, msg) ->
      if nick is 'OmniBot' and text is message
        done()
    bot.say '#bot', message

  it 'can send private messages', (done) ->
    message = 'Hello Listener'
    listener.addListener 'pm', (nick, text, msg) ->
      if nick is 'OmniBot' and text is message
        done()
    bot.say 'Listener', message
