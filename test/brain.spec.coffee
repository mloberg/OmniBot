Brain = require '../lib/brain'

describe 'Brain', ->
  brain = null

  beforeEach ->
    brain = new Brain

  afterEach (done) ->
    brain.on 'close', done
    brain.close()

  it 'can store data', (done) ->
    brain.on 'save', (data) ->
      expect(data.abc).toEqual(1)
      done()

    brain.data.abc = 1
    brain.resetSaveInterval 0.1

  it 'can load data', (done) ->
    brain.on 'loaded', (data) ->
      expect(data.foo).toEqual('bar')
      done()

    brain.mergeData { foo: 'bar' }
