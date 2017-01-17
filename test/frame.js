const BrowserStdout = require('browser-stdout')
const ParentStream = require('../index.js').ParentStream
const transform = require('mississippi').through
const pipe = require('mississippi').pipe

module.exports = setupStream


setupStream()

function setupStream(opts) {
  var iframeStream = ParentStream()
  pipe(
    iframeStream,
    transform({ objectMode: true }, doubleIt),
    iframeStream
  )
}

function doubleIt(chunk, encoding, cb){
  cb(null, chunk * 2)
}
