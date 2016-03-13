import {curryAll} from './utils'
import {deriveAll} from './derive'

const Id = deriveAll(curryAll({

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
    return Id.of(fn(idX))
  },

}))

export default Id
