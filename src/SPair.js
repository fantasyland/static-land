import {deriveAll} from './derive'

const SPair = deriveAll({

  map(fn, pairX) {
    return SPair.create(fn(pairX.first), pairX.second)
  },

  sequence(T, pairT) {
    return T.map(SPair.createInverse(pairT.second), pairT.first)
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

export default SPair
