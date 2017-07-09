var Duplexify = require('duplexify')
var PostMessageStream = require('post-message-stream')

/*

  IframeStream starts corked until it gets a message from the iframe
  ParentStream starts uncorked

*/

module.exports = {
  IframeStream: IframeStream,
  ParentStream: ParentStream,
}


function IframeStream(iframe) {
  if (this instanceof IframeStream) throw Error('IframeStream - Dont construct via the "new" keyword.')
  var duplexStream = Duplexify.obj()
  iframe.addEventListener('load', function(){
    var postMessageStream = new PostMessageStream({
      name: 'iframe-parent',
      target: 'iframe-child',
      targetWindow: iframe.contentWindow,
    })
    duplexStream.setWritable(postMessageStream)
    duplexStream.setReadable(postMessageStream)
  })
  return duplexStream
}

//
// Parent Stream
//


function ParentStream() {
  if (this instanceof ParentStream) throw Error('ParentStream - Dont construct via the "new" keyword.')
  return new PostMessageStream({
    name: 'iframe-child',
    target: 'iframe-parent',
    targetWindow: frames.parent,
  })
}
