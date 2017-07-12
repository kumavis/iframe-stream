const Duplexify = require('duplexify')
const PostMessageStream = require('post-message-stream')

/*

  IframeStream starts corked until it gets a message from the iframe
  ParentStream starts uncorked

*/

module.exports = {
  IframeStream: IframeStream,
  ParentStream: ParentStream
}

function IframeStream (iframe) {
  if (this instanceof IframeStream) throw Error('IframeStream - Dont construct via the "new" keyword.')
  const duplexStream = Duplexify.obj()
  iframe.addEventListener('load', () => {
    const postMessageStream = new PostMessageStream({
      name: 'iframe-parent',
      target: 'iframe-child',
      targetWindow: iframe.contentWindow
    })
    postMessageStream.write('init')

    duplexStream.setWritable(postMessageStream)
    duplexStream.setReadable(postMessageStream)
  })
  return duplexStream
}

//
// Parent Stream
//
function ParentStream () {
  if (this instanceof ParentStream) throw Error('ParentStream - Dont construct via the "new" keyword.')
  const postMessageStream = new PostMessageStream({
    name: 'iframe-child',
    target: 'iframe-parent',
    targetWindow: frames.parent
  })

  const duplexStream = Duplexify.obj()
  postMessageStream.once('data', data => {
    postMessageStream.pipe(duplexStream)
    duplexStream.setWritable(postMessageStream)
  })
  return duplexStream
}
