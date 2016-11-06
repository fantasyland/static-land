import makeTest from 'lobot/test'
import {fromFLType} from '../src'

const test = makeTest.wrap('fromFLType')

class Sum {

  constructor(x) {
    this.x = x
  }

  static 'fantasy-land/empty'() {
    return new Sum(0)
  }

  'fantasy-land/concat'(b) {
    return new Sum(this.x + b.x)
  }

}

class Pair {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  'fantasy-land/bimap'(f, g) {
    return new Pair(f(this.x), g(this.y))
  }
}

class Fn {
  constructor(f) {
    this.f = f
  }
  'fantasy-land/promap'(f, g) {
    return new Fn(x => g(this.f(f(x))))
  }
}

class Id {

  constructor(x) {
    this.x = x
  }

  static 'fantasy-land/of'(x) {
    return new Id(x)
  }

  'fantasy-land/equals'(a) {
    return this.x === a.x
  }

  'fantasy-land/map'(f) {
    return new Id(f(this.x))
  }

  'fantasy-land/ap'(f) {
    return new Id(f.x(this.x))
  }

  'fantasy-land/chain'(f) {
    return f(this.x)
  }

  static 'fantasy-land/chainRec'(f, i) {
    const next = v => ({done: false, value: v})
    const done = v => ({done: true, value: v})
    let state = {done: false, value: i}
    while (state.done === false) {
      state = f(next, done, state.value).x
    }
    return new Id(state.value)
  }

  'fantasy-land/reduce'(f, x) {
    return f(x, this.x)
  }

  'fantasy-land/extend'(f) {
    return new Id(f(this))
  }

  'fantasy-land/extract'() {
    return this.x
  }

  'fantasy-land/traverse'(f /* , of */) {
    return f(this.x)['fantasy-land/map'](Id['fantasy-land/of'])
  }

}


class List {

  constructor(arr) {
    this.arr = arr
  }

  static 'fantasy-land/of'(x) {
    return new List([x])
  }

  static 'fantasy-land/zero'() {
    return new List([])
  }

  'fantasy-land/map'(f) {
    return new List(this.arr.map(f))
  }

  'fantasy-land/ap'(f) {
    return new List(f.arr.map(f => this.arr.map(f)).reduce((r, i) => r.concat(i), []))
  }

  'fantasy-land/alt'(b) {
    return new List(this.arr.concat(b.arr))
  }

}


const SId = fromFLType(Id)
const SSum = fromFLType(Sum)
const SPair = fromFLType(Pair)
const SFn = fromFLType(Fn)
const SList = fromFLType(List)

test('auto detection of available methods', 14 * 2 + 2 + 5, t => {
  t.equals(typeof SId.of, 'function')
  t.equals(typeof SId.equals, 'function')
  t.equals(typeof SId.map, 'function')
  t.equals(typeof SId.ap, 'function')
  t.equals(typeof SId.chain, 'function')
  t.equals(typeof SId.chainRec, 'function')
  t.equals(typeof SId.reduce, 'function')
  t.equals(typeof SId.extend, 'function')
  t.equals(typeof SId.extract, 'function')
  t.equals(typeof SId.empty, 'undefined')
  t.equals(typeof SId.concat, 'undefined')
  t.equals(typeof SId.bimap, 'undefined')
  t.equals(typeof SId.promap, 'undefined')
  t.equals(typeof SId.traverse, 'function')

  t.equals(typeof SSum.of, 'undefined')
  t.equals(typeof SSum.equals, 'undefined')
  t.equals(typeof SSum.map, 'undefined')
  t.equals(typeof SSum.ap, 'undefined')
  t.equals(typeof SSum.chain, 'undefined')
  t.equals(typeof SSum.chainRec, 'undefined')
  t.equals(typeof SSum.reduce, 'undefined')
  t.equals(typeof SSum.extend, 'undefined')
  t.equals(typeof SSum.extract, 'undefined')
  t.equals(typeof SSum.empty, 'function')
  t.equals(typeof SSum.concat, 'function')
  t.equals(typeof SSum.bimap, 'undefined')
  t.equals(typeof SSum.promap, 'undefined')
  t.equals(typeof SSum.traverse, 'undefined')

  t.equals(typeof SPair.bimap, 'function')
  t.equals(typeof SFn.promap, 'function')

  t.equals(typeof SList.of, 'function')
  t.equals(typeof SList.map, 'function')
  t.equals(typeof SList.ap, 'function')
  t.equals(typeof SList.alt, 'function')
  t.equals(typeof SList.zero, 'function')
})

test('manual avalible methods', 12, t => {
  const LimitedSId = fromFLType(Id, ['of', 'map'])
  t.equals(typeof LimitedSId.of, 'function')
  t.equals(typeof LimitedSId.equals, 'undefined')
  t.equals(typeof LimitedSId.map, 'function')
  t.equals(typeof LimitedSId.ap, 'undefined')
  t.equals(typeof LimitedSId.chain, 'undefined')
  t.equals(typeof LimitedSId.reduce, 'undefined')
  t.equals(typeof LimitedSId.extend, 'undefined')
  t.equals(typeof LimitedSId.extract, 'undefined')
  t.equals(typeof LimitedSId.empty, 'undefined')
  t.equals(typeof LimitedSId.concat, 'undefined')
  t.equals(typeof LimitedSId.bimap, 'undefined')
  t.equals(typeof LimitedSId.promap, 'undefined')
})

test('of', 1, t => {
  t.equals(SId.of(2).x, 2)
})

test('equals', 1, t => {
  t.ok(SId.equals(SId.of(2), SId.of(2)))
})

test('map', 1, t => {
  t.equals(SId.map(x => x * 3, SId.of(2)).x, 6)
})

test('ap', 1, t => {
  t.equals(SId.ap(SId.of(x => x * 3), SId.of(2)).x, 6)
})

test('alt', 1, t => {
  t.deepEqual(SList.alt(SList.of(1), SList.of(2)).arr, [1, 2])
})

test('zero', 1, t => {
  t.deepEqual(SList.zero().arr, [])
})

test('chain', 1, t => {
  t.equals(SId.chain(x => SId.of(x * 3), SId.of(2)).x, 6)
})

test('chainRec', 1, t => {
  t.equals(SId.chainRec((n, d, x) => x > 0 ? SId.of(n(x - 1)) : SId.of(d(x)), 3).x, 0)
})

test('reduce', 1, t => {
  t.equals(SId.reduce((a, b) => a * b, 3, SId.of(2)), 6)
})

test('extend', 1, t => {
  t.equals(SId.extend(a => a.x * 3, SId.of(2)).x, 6)
})

test('extract', 1, t => {
  t.equals(SId.extract(SId.of(2)), 2)
})

test('empty', 1, t => {
  t.equals(SSum.empty().x, 0)
})

test('concat', 1, t => {
  t.equals(SSum.concat(new Sum(1), new Sum(2)).x, 3)
})

test('bimap', 2, t => {
  t.equals(SPair.bimap(x => x * 3, y => y, new Pair(2, 0)).x, 6)
  t.equals(SPair.bimap(x => x, y => y * 3, new Pair(0, 2)).y, 6)
})

test('promap', 1, t => {
  t.equals(SFn.promap(parseInt, x => x.toString(), new Fn(x => x * 3)).f('2'), '6')
})

test('traverse', 1, t => {
  const A = {
    of(a) {
      return {a}
    },
    map(f, a) {
      return A.of(f(a.a))
    },
    ap(af, ax) {
      return A.of(af.a(ax.a))
    },
  }
  t.equals(SId.traverse(A, A.of, SId.of(2)).a.x, 2)
})
