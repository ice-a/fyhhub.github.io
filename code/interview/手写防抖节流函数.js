// function debounce(fn, wait) {
//   let timer
//   return function() {
//     const args = arguments
//     clearTimeout(timer)
//     setTimeout(() => {
//       fn.apply(this, args)
//     }, wait)
//   }
// }

// function throttle(fn, wait) {
//   let pre = 0
//   return function() {
//     const now = Date.now()
//     if (now - pre > wait) {
//       pre = now
//       fn.apply(this, arguments)
//     }
//   }
// }

// function throttle1(fn, wait) {
//   let timer
//   return function() {
//     if (!timer) {
//       timer = setTimeout(() => {
//         clearTimeout(timer)
//         timer = null
//         fn.apply(this, arguments)
//       }, wait)
//     }
//   }
// }

function debounce(fn, wait) {
  let timer
  return function() {
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}

function throttle(fn, wait) {
  let pre = 0
  return function() {
    let now = Date.now()
    if (now - pre > wait) {
      fn.apply(this, arguments)
      pre = now
    }
  }
}