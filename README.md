# iframe-stream

Create a stream around an iframe via [post-message-stream](https://github.com/kumavis/post-message-stream)

```js
const IframeStream = require('iframe-stream').IframeStream

var iframe = createIframe()
var iframeStream = IframeStream(iframe)
```

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