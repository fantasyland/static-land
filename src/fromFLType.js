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

export default function fromFLType(Constructor, availableMethods = defAvailableMethods(Constructor)) {

  function available(method) {
    return availableMethods.indexOf(method) !== -1
  }

  const Type = {}

  if (available($.map)) {
    Type.map = (fn, tx) => tx[$.map](fn)
  }

  if (available($.bimap)) {
    Type.bimap = (fa, fb, t) => t[$.bimap](fa, fb)
  }

  if (available($.promap)) {
    Type.promap = (fa, fb, t) => t[$.promap](fa, fb)
  }

  if (available($.equals)) {
    Type.equals = (ta, tb) => ta[$.equals](tb)
  }

  if (available($.concat)) {
    Type.concat = (ta, tb) => ta[$.concat](tb)
  }

  if (available($.ap)) {
    Type.ap = (tf, tx) => tf[$.ap](tx)
  }

  if (available($.reduce)) {
    Type.reduce = (fn, seed, tx) => tx[$.reduce](fn, seed)
  }

  if (available($.sequence)) {
    Type.sequence = (Inner, ti) => ti[$.sequence](Inner.of)
  }

  if (available($.chain)) {
    Type.chain = (fn, tx) => tx[$.chain](fn)
  }

  if (available($.extend)) {
    Type.extend = (fn, tx) => tx[$.extend](fn)
  }

  if (available($.extract)) {
    Type.extract = (tx) => tx[$.extract]()
  }

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
