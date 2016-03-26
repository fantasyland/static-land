import fromIncomplete from './fromIncomplete'

const Arr = fromIncomplete({

  equals(a, b) {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
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

  sequence(T, arr) {
    return arr.reduce(T.map2((r, i) => r.concat([i])), T.of([]))
  },

  toArray(arr) {
    return arr
  },

  chain(fn, arr) {
    return Arr.reduce(Arr.concat, Arr.empty(), arr.map(fn))
  },

})

export default Arr
