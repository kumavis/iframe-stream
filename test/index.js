const Iframe = require('iframe')
const from = require('from')
const IframeStream = require('../index.js').IframeStream
const meowserify = require('meowserify')
// const preambleSrc = "console.log('sandbox ready')"
const preambleSrc = meowserify(__dirname+'/frame.js')
const preambleBody = '<'+'script type="text/javascript"'+'>'+preambleSrc+'<'+'/script'+'>'

injectIframe()

function injectIframe(opts) {
  var iframeConfig = {
    body: preambleBody,
    container: document.body,
  }
  var frame = Iframe(iframeConfig)
  var iframe = frame.iframe
  var iframeStream = new IframeStream(frame.iframe)
  iframe.addEventListener('load', function(){
    from(['after hours',{snakes: true}]).pipe(iframeStream)
  })
}
