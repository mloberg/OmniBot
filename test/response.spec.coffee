Response = require '../lib/response'
helper = require './helper'
httpClient = require 'scoped-http-client'

describe 'Response', ->
  it 'will send message', (done) ->
    robot =
      say: (target, msg) ->
        if target is '#channel' and msg is 'foobar'
          done()
    resp = new Response robot, 'Nick', '#channel', 'Full message'
    resp.send "foobar"

  it 'will send pm if no channel', (done) ->
    robot =
      say: (target, msg) ->
        if target is 'Nick' and msg is 'foobar'
          done()
    resp = new Response robot, 'Nick', null, 'message'
    resp.send "foobar"

  it 'will select random', ->
    rand = [ 1, 2, 3, 4 ]
    resp = new Response
    expect(resp.random(rand)).toBeTruthy()
