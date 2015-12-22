var DuplexStream = require('readable-stream/duplex')
var inherits = require('util').inherits

/*

  IframeStream starts corked until it gets a message from the iframe
  ParentStream starts uncorked

*/

module.exports.IframeStream = IframeStream
module.exports.ParentStream = ParentStream


inherits(IframeStream, DuplexStream)

function IframeStream(iframe) {
  DuplexStream.call(this, {
    objectMode: true,
  })
  this._setupListener()
  this._initialize(iframe)
}

IframeStream.prototype._initialize = function(iframe) {
  this.targetWindow = iframe.contentWindow
  this.ready = false
  this.cork()
  iframe.addEventListener('load', this._setReady.bind(this))
}

IframeStream.prototype._setReady = function(e) {
  console.log('uncorking stream!')
  this.ready = true
  this.uncork()
}

IframeStream.prototype._setupListener = function(e) {
  window.addEventListener('message', this._onIframeMessage.bind(this), false)
}

IframeStream.prototype._onIframeMessage = function(event) {
  // only process messages from the iframe
  if (event.source !== this.targetWindow) return
  // uncork if not ready
  // take in data
  this.push(event.data)
}

IframeStream.prototype._write = function(data, encoding, cb) {
  console.log('emitting message:', data)
  this.targetWindow.postMessage(data, '*')
  cb()
}

IframeStream.prototype._read = noop

//
// Parent Stream
//

inherits(ParentStream, IframeStream)

function ParentStream() {
  IframeStream.call(this)
}

ParentStream.prototype._initialize = function(){
  this.targetWindow = frames.parent
  this.ready = true
}

// util

function noop(){}

