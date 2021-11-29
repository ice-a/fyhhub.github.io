function generatorToAsync(generatorFn) {
  return function() {
    const gen = generatorFn.apply(this, arguments)
    return Promise((resolve, reject) => {
      function go(key, arg) {
        let res
        try {
          res = gen[key](arg)
        } catch (e) {
          return reject(e)
        }

        const { value, done } = res
        if (done) {
          return resolve(value)
        } else {
          return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
        }
      }
      go('next')
    })
  }
}
