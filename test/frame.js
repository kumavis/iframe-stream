const BrowserStdout = require('browser-stdout')
const ParentStream = require('../index.js').ParentStream
// const preambleSrc = "console.log('sandbox ready')"

console.log('sandbox bundle ready')
setupStream()

function setupStream(opts) {
  var iframeStream = new ParentStream()
  var stdout = BrowserStdout({
    objectMode: true,
  })
  
  iframeStream.pipe(stdout)
}