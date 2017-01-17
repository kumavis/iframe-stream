const test = require('tape')
const Iframe = require('iframe')
const from = require('from')
const pipe = require('mississippi').pipe
const IframeStream = require('../').IframeStream
const rebundle = require('./rebundle')
const htmlWrap = require('./htmlWrap')
const iframeContent = htmlWrap(rebundle(require('./frame')))



// setup iframe
var iframe = Iframe({
  body: iframeContent,
  container: document.body,
}).iframe
var iframeStream = IframeStream(iframe)


test(function(t) {
  var data = [1, 2, 3, 4, 50, 1000, 256, 19, 12]

  t.plan(data.length)

  pipe(
    from(data),
    iframeStream
  )

  // create a test for each datum
  // this is because these streams never close
  eachOutput(iframeStream, data.map(function(datum){
    return function onResult(result){ t.equal(result, datum * 2, 'datum was doubled correctly') }
  }), function onDone(){
    t.end()
  })

})

function eachOutput(stream, handlers, cb) {
  var index = 0
  if (!handlers.length) return cb()
  stream.once('data', handleChunk)
  function handleChunk(data){
    var fn = handlers[index]
    fn(data)
    index++
    if (!handlers[index]) return cb()
    stream.once('data', handleChunk)
  }
}
