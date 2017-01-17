module.exports = htmlWrap

function htmlWrap(src){
  return '<'+'script type="text/javascript"'+'>'+src+'<'+'/script'+'>'  
}
