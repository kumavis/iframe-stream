# iframe-stream

[![Greenkeeper badge](https://badges.greenkeeper.io/kumavis/iframe-stream.svg)](https://greenkeeper.io/)

Create a stream around an iframe via [post-message-stream](https://github.com/kumavis/post-message-stream)

```js
const IframeStream = require('iframe-stream').IframeStream

var iframe = createIframe()
var iframeStream = IframeStream(iframe)
```

### Note

* Setup the stream immediately, so we don't miss the iframe's `load` event.
* The IframeStream will buffer all input until the childstream is ready.
* This is an object stream, and buffers will not be handled gracefully.

### Example

Here is an example using [dnode](https://github.com/substack/dnode) to create a callback based API with a javascript context inside an iframe.

Parent:
```js
const IframeStream = require('iframe-stream').IframeStream
const Dnode = require('dnode')

var iframe = createIframe()
var iframeStream = IframeStream(iframe)
var dnode = Dnode()
dnode.on('remote', function(child){
  child.doAsyncSomething(function(){
    console.log('child finished doing the thing!')
  })
})

dnode.pipe(iframeStream).pipe(dnode)
```

Child:
```js
const ParentStream = require('iframe-stream').ParentStream
const Dnode = require('dnode')

var parentStream = ParentStream(iframe)
var dnode = Dnode({
  doAsyncSomething: function (cb) {
    console.log('doing something async...')
    cb()
  }
})

dnode.pipe(parentStream).pipe(dnode)
```