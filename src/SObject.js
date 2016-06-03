import {mapObj, flow} from './utils'
import SPair from './SPair'
import SArray from './SArray'
import {deriveAll} from './derive'

const SObject = deriveAll({

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

  reduce(reducer, seed, obj) {
    return Object.keys(obj).map(key => obj[key])
      .reduce((acc, input) => reducer(acc, input), seed)
  },

  sequence(T, objT) {
    return flow(objT,
      SObject.toPairs,
      SArray.map(SPair.sequence(T)),
      SArray.sequence(T),
      T.map(SObject.fromPairs)
    )
  },

  ap(objF, objX) {
    const applyX = pair => SPair.map(fn => fn(objX[SPair.second(pair)]), pair)
    return flow(objF,
      SObject.toPairs,
      SArray.map(applyX),
      SObject.fromPairs
    )
  },

  toPairs(objX) {
    return Object.keys(objX).map(key => SPair.create(objX[key], key))
  },

  fromPairs(pairs) {
    const result = {}
    pairs.forEach(pair => {
      result[SPair.second(pair)] = SPair.first(pair)
    })
    return result
  },

})

export default SObject
