import {deriveAll} from './derive'

const SId = deriveAll({

  equals(idA, idB) {
    return idA === idB
  },

  of(x) {
    return x
  },

  map(fn, idX) {
    return fn(idX)
  },

  reduce(fn, seed, idX) {
    return fn(seed, idX)
  },

  chain(fn, idX) {
    return fn(idX)
  },

  sequence(T, idT) {
    return idT
  },

  extract(idX) {
    return idX
  },

  extend(fn, idX) {
    return SId.of(fn(idX))
  },

})

export default SId
