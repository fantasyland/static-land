import {curryAll} from './utils'
import * as derive from './derive'

const Arr = curryAll({

  equals(a, b) {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      // here we could use Inner.equals, but we need Inner...
      if (a[i] !== b[i]) {
        return false
      }
    }
    return true
  },

  of(x) {
    return [x]
  },

  empty() {
    return []
  },

  concat(a, b) {
    return a.concat(b)
  },

  map(fn, arr) {
    return arr.map(x => fn(x))
  },

  reduce(fn, seed, arr) {
    // how does it work when seed===undefined?
    return arr.reduce(fn, seed)
  },

  chain(fn, arr) {
    return arr.map(fn).reduce(Arr.concat, [])
  },

  sequence(T, arr) {
    const map2 = T.map2 || derive.map2(T)
    const append = map2((r, i) => r.concat([i]))
    return arr.reduce(append, T.of([]))
  },

})

Arr.map2 = derive.map2(Arr)
Arr.ap = derive.ap(Arr)

export default Arr
