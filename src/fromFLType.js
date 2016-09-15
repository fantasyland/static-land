import $ from 'fantasy-land'

function defAvailableMethods(Constructor) {
  const result = []
  if (Constructor[$.of]) result.push('of')
  if (Constructor[$.empty]) result.push('empty')
  if (Constructor[$.chainRec]) result.push('chainRec')
  if (Constructor.prototype[$.equals]) result.push('equals')
  if (Constructor.prototype[$.map]) result.push('map')
  if (Constructor.prototype[$.bimap]) result.push('bimap')
  if (Constructor.prototype[$.promap]) result.push('promap')
  if (Constructor.prototype[$.concat]) result.push('concat')
  if (Constructor.prototype[$.ap]) result.push('ap')
  if (Constructor.prototype[$.reduce]) result.push('reduce')
  if (Constructor.prototype[$.traverse]) result.push('traverse')
  if (Constructor.prototype[$.chain]) result.push('chain')
  if (Constructor.prototype[$.extend]) result.push('extend')
  if (Constructor.prototype[$.extract]) result.push('extract')
  return result
}

// Creates a FL Applicative from a SL Applicative
function fromSL(T) {
  function Adapter(slValue) {
    this._slValue = slValue
  }
  Adapter[$.of] = x => new Adapter(T.of(x))
  Adapter.prototype[$.of] = Adapter[$.of]
  Adapter.prototype[$.map] = function(f) { return new Adapter(T.map(f, this.unwrap())) }
  Adapter.prototype[$.ap] = function(f) { return new Adapter(T.ap(f.unwrap(), this.unwrap())) }
  Adapter.prototype.unwrap = function() { return this._slValue }
  return Adapter
}

const map = (fn, tx) => tx[$.map](fn)
const bimap = (fa, fb, t) => t[$.bimap](fa, fb)
const promap = (fa, fb, t) => t[$.promap](fa, fb)
const equals = (ta, tb) => ta[$.equals](tb)
const concat = (ta, tb) => ta[$.concat](tb)
const ap = (tf, tx) => tx[$.ap](tf)
const reduce = (fn, seed, tx) => tx[$.reduce](fn, seed)
const chain = (fn, tx) => tx[$.chain](fn)
const extend = (fn, tx) => tx[$.extend](fn)
const extract = (tx) => tx[$.extract]()
const traverse = (Inner, f, ti) => {
  const Adapter = fromSL(Inner)
  return ti[$.traverse](x => new Adapter(f(x)), Adapter[$.of]).unwrap()
}

export default function fromFLType(Constructor, availableMethods = defAvailableMethods(Constructor)) {

  function available(method) {
    return availableMethods.indexOf(method) !== -1
  }

  const Type = {}

  if (available('map')) Type.map = map
  if (available('bimap')) Type.bimap = bimap
  if (available('promap')) Type.promap = promap
  if (available('equals')) Type.equals = equals
  if (available('concat')) Type.concat = concat
  if (available('ap')) Type.ap = ap
  if (available('reduce')) Type.reduce = reduce
  if (available('traverse')) Type.traverse = traverse
  if (available('chain')) Type.chain = chain
  if (available('extend')) Type.extend = extend
  if (available('extract')) Type.extract = extract
  if (available('of')) Type.of = Constructor[$.of]
  if (available('empty')) Type.empty = Constructor[$.empty]
  if (available('chainRec')) Type.chainRec = Constructor[$.chainRec]

  return Type

}
