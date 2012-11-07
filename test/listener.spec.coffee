{Listener,TextListener} = require '../lib/listener'
helper = require './helper'

describe 'Listener', ->
  it 'should respond', ->
    matcher = (message) ->
      return true if message is 'foo'
    listener = new Listener null, matcher
    expect(listener.call(null, null, 'foo')).toBeTruthy()

  it 'should not respond', ->
    matcher = -> return false
    listener = new Listener null, matcher
    expect(listener.call(null, null, 'foo')).toBeFalsy()

  it 'should run callback', (done) ->
    matcher = -> return true
    listener = new Listener helper.mockRobot, matcher, ->
      done()
    listener.call(null, null, 'foo')

describe 'TextListener', ->
  it 'should respond', ->
    listener = new TextListener null, /^foo$/
    expect(listener.call(null, null, 'foo')).toBeTruthy()

  it 'should not respond', ->
    listener = new TextListener null, /^Hello World$/
    expect(listener.call(null, null, 'foo')).toBeFalsy()
