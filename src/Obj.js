import {curryAll, mapObj, flow} from './utils'
import Pair from './Pair'
import Arr from './Arr'
import {deriveAll} from './derive'

const Obj = deriveAll(curryAll({

  map: mapObj,

  equals(objA, objB) {
    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)
    if (keysA.length !== keysB.length) {
      return false
    }
    for (let i = 0; i < keysA.length; i++) {
      const key = keysA[i]
      if (keysB.indexOf(key) === -1) {
        return false
      }
      if (objA[key] !== objB[key]) {
        return false
      }
    }
    return true
  },

  empty() {
    return {}
  },

  concat(objA, objB) {
    return {...objA, ...objB}
  },

  toArray(objX) {
    return Object.keys(objX).map(key => objX[key])
  },

  sequence(T, objT) {
    return flow(objT,
      Obj.toPairs,
      Arr.map(Pair.sequence(T)),
      Arr.sequence(T),
      T.map(Obj.fromPairs)
    )
  },

  ap(objF, objX) {
    const applyX = pair => Pair.map(fn => fn(objX[Pair.second(pair)]), pair)
    return flow(objF,
      Obj.toPairs,
      Arr.map(applyX),
      Obj.fromPairs
    )
  },

  toPairs(objX) {
    return Object.keys(objX).map(key => Pair.create(objX[key], key))
  },

  fromPairs(pairs) {
    const result = {}
    pairs.forEach(pair => {
      result[Pair.second(pair)] = Pair.first(pair)
    })
    return result
  },

}))

export default Obj
