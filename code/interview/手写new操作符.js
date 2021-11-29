// function New() {
//   const Ctor = [].shift.call(arguments)
//   const args = [].slice.call(arguments, 1)
//   const obj = new Object()
//   obj.__proto__ = Ctor.prototype
//   const res = Ctor.apply(obj, args)
//   return typeof res === 'object' ? res : obj
// }

function New() {
  const Ctor = [].shift.call(arguments)
  const args = [].slice.call(arguments, 1)
  const obj = new Object()
  obj.__proto__ = Ctor.prototype
  const res = Ctor.apply(obj, args)
  return typeof res === 'object' ? res : obj
}