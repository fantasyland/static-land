export function applyAll(value, ...fns) {
  return fns.reduce((x, fn) => fn(x), value)
}

function _curry(length, received, fn) {
  return (...args) => {
    const all = received.concat(args)
    return all.length >= length ? fn(...all) : _curry(length, all, fn)
  }
}

export function curry(fn) {
  return _curry(fn.length, [], fn)
}

export const mapObj = curry(
  (fn, obj) => {
    const result = {}
    Object.keys(obj).forEach(key => {
      result[key] = fn(obj[key])
    })
    return result
  }
)

export const curryAll = mapObj(curry)
