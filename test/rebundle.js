// 
// Extraced from WebWorkify
// https://github.com/substack/webworkify/blob/master/index.js
// 

var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];

var stringify = JSON.stringify;

module.exports = function (fn, options) {
  var wkey;
  var cacheKeys = Object.keys(cache);

  for (var i = 0, l = cacheKeys.length; i < l; i++) {
      var key = cacheKeys[i];
      var exp = cache[key].exports;
      // Using babel as a transpiler to use esmodule, the export will always
      // be an object with the default export as a property of it. To ensure
      // the existing api and babel esmodule exports are both supported we
      // check for both
      if (exp === fn || exp && exp.default === fn) {
          wkey = key;
          break;
      }
  }

  if (!wkey) {
      wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
      var wcache = {};
      for (var i = 0, l = cacheKeys.length; i < l; i++) {
          var key = cacheKeys[i];
          wcache[key] = key;
      }
      sources[wkey] = [
          Function(['require','module','exports'], '(' + fn + ')(self)'),
          wcache
      ];
  }
  var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);

  var scache = {}; scache[wkey] = wkey;
  sources[skey] = [
      Function(['require'], (
          // try to call default if defined to also support babel esmodule
          // exports
          'var f = require(' + stringify(wkey) + ');' +
          '(f.default ? f.default : f)(self);'
      )),
      scache
  ];

  var workerSources = {};
  resolveSources(skey);

  function resolveSources(key) {
      workerSources[key] = true;

      for (var depPath in sources[key][1]) {
          var depKey = sources[key][1][depPath];
          if (!workerSources[depKey]) {
              resolveSources(depKey);
          }
      }
  }

  var src = '(' + bundleFn + ')({'
      + Object.keys(workerSources).map(function (key) {
          return stringify(key) + ':['
              + sources[key][0]
              + ',' + stringify(sources[key][1]) + ']'
          ;
      }).join(',')
      + '},{},[' + stringify(skey) + '])'
  ;

  return src
}