export function flow(value, ...fns) {
  return fns.reduce((x, fn) => fn(x), value)
}

function _curry(length, received, fn) {
  return (...args) => {
    const all = received.concat(args)
    return all.length >= length ? fn(...all) : _curry(length, all, fn)
  }
}

export function curry(fn) {
  if (fn.__fnatasyLandStaticCurried__) {
    return fn
  }
  const curried = _curry(fn.length, [], fn)
  curried.__fnatasyLandStaticCurried__ = true
  return curried
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
