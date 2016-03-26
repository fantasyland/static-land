import fromIncomplete from './fromIncomplete'

const Pair = fromIncomplete({

  map(fn, pairX) {
    return Pair.create(fn(pairX.first), pairX.second)
  },

  sequence(T, pairT) {
    return T.map(Pair.createInverse(pairT.second), pairT.first)
  },

  create(first, second) {
    return {first, second}
  },

  createInverse(second, first) {
    return {first, second}
  },

  first(pairT) {
    return pairT.first
  },

  second(pairT) {
    return pairT.second
  },

})

export default Pair
