// function debounce(fn, wait) {
//   let timer
//   return function() {
//     const args = arguments
//     clearTimeout(timer)
//     timer = setTimeout(() => {
//       fn.apply(this, args)
//     }, wait)
//   }
// }

// function throttle(fn, wait) {
//   let pre = 0
//   return function() {
//     let now = Date.now()
//     if (now - pre > wait) {
//       fn.apply(this, arguments)
//       pre = now
//     }
//   }
// }

function throttle(fn, wait) {
  let pre = 0;
  return function() {
    const now = Date.now()
    if (now - pre > wait) {
      fn.apply(this, arguments)
      pre = now
    }
  }
}

function debounce(fn, wait) {
  let timer = null;
  return function() {
    if (timer) clearTimeout(timer)
    const args = arguments
    setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}