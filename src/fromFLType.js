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
  function SL2FLAdapter(x) { this._x = x }
  SL2FLAdapter[$.of] = (x) => { return new SL2FLAdapter(Inner.of(x)) }
  SL2FLAdapter.prototype[$.of] = SL2FLAdapter[$.of]
  SL2FLAdapter.prototype[$.map] = function(f) { return new SL2FLAdapter(Inner.map(f, this._x)) }
  SL2FLAdapter.prototype[$.ap] = function(f) { return new SL2FLAdapter(Inner.ap(f._x, this._x)) }
  return ti[$.traverse](x => new SL2FLAdapter(f(x)), SL2FLAdapter[$.of])._x
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
