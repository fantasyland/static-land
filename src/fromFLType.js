import $ from 'fantasy-land'

function defAvailableMethods(Constructor) {
  const result = Object.keys(Constructor.prototype)
  if (Constructor[$.of] && result.indexOf($.of) === -1) {
    result.push($.of)
  }
  if (Constructor[$.empty] && result.indexOf($.empty) === -1) {
    result.push($.empty)
  }
  return result
}

const map = (fn, tx) => tx[$.map](fn)
const bimap = (fa, fb, t) => t[$.bimap](fa, fb)
const promap = (fa, fb, t) => t[$.promap](fa, fb)
const equals = (ta, tb) => ta[$.equals](tb)
const concat = (ta, tb) => ta[$.concat](tb)
const ap = (tf, tx) => tf[$.ap](tx)
const reduce = (fn, seed, tx) => tx[$.reduce](fn, seed)
const sequence = (Inner, ti) => ti[$.sequence](Inner.of)
const chain = (fn, tx) => tx[$.chain](fn)
const extend = (fn, tx) => tx[$.extend](fn)
const extract = (tx) => tx[$.extract]()

export default function fromFLType(Constructor, availableMethods = defAvailableMethods(Constructor)) {

  function available(method) {
    return availableMethods.indexOf(method) !== -1
  }

  const Type = {}

  if (available($.map)) Type.map = map
  if (available($.bimap)) Type.bimap = bimap
  if (available($.promap)) Type.promap = promap
  if (available($.equals)) Type.equals = equals
  if (available($.concat)) Type.concat = concat
  if (available($.ap)) Type.ap = ap
  if (available($.reduce)) Type.reduce = reduce
  if (available($.sequence)) Type.sequence = sequence
  if (available($.chain)) Type.chain = chain
  if (available($.extend)) Type.extend = extend
  if (available($.extract)) Type.extract = extract

  if (available($.of)) {
    if (Constructor.prototype[$.of]) {
      Type.of = x => Constructor.prototype[$.of](x)
    }

    if (Constructor[$.of]) {
      Type.of = x => Constructor[$.of](x)
    }
  }

  if (available($.empty)) {
    if (Constructor.prototype[$.empty]) {
      Type.empty = () => Constructor.prototype[$.empty]()
    }

    if (Constructor[$.empty]) {
      Type.empty = () => Constructor[$.empty]()
    }
  }

  return Type

}
