export function debounce(func,delay) {
  let timer = null
  return function (...args) {
    if(timer) clearTimeout(timer)  //清除定时器
    timer = setTimeout(() => {
      func.apply(this,args)
    },delay)
  }
}