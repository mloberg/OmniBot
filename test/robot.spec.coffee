http = require 'http'
Robot = require '../lib/robot'
helper = require './helper'

port = 6662

describe 'Robot', ->
  bot = null
  listener = null
  server = null

  beforeEach (done) ->
    server = helper.server port, ->
      config =
        server: 'localhost'
        port: port
        channels: [ '#bot' ]
      bot = new Robot 'OmniBot', config, true
      listener = helper.listener port, ->
        bot.start done

  afterEach (done) ->
    bot.shutdown ->
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

  it 'will respond', (done) ->
    bot.respond /foobar/, ->
      done()
    listener.say '#bot', 'OmniBot foobar'

  it 'will hear', (done) ->
    bot.hear /^foo$/, ->
      done()
    listener.say '#bot', 'foo'

  it 'responds to http requests', (done) ->
    bot.httpd.get '/foo', (req, res) ->
      res.end "bar"
    bot.http("http://localhost:8080/foo")
    .get() (err, res, body) ->
      expect(body).toEqual('bar')
      done()

  it 'will load modules', (done) ->
    bot.load 'test/modules'
    listener.addListener 'message#bot', (nick, text, msg) ->
      if nick is 'OmniBot' and text is 'baz'
        done()
    listener.say '#bot', 'OmniBot bar'
