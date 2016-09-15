import makeTest from 'lobot/test'

const test = makeTest.wrap('derivations')

const A = {
  of(a) {
    return {T: 'A', a}
  },
  map(f, a) {
    return A.of(f(a.a))
  },
  ap(af, ax) {
    return A.of(af.a(ax.a))
  },
}

const B = {
  of(b) {
    return {T: 'B', b}
  },
  map(f, a) {
    return B.of(f(a.b))
  },
  ap(af, ax) {
    return B.of(af.b(ax.b))
  },
}

const SArray = {
  equals(a, b) {
    return a.length === b.length && a.reduce((r, x, index) => r && x === b[index], true)
  },
  of(x) {
    return [x]
  },
  map(f, a) {
    return a.map(f)
  },
  ap(f, a) {
    return f.map(f => a.map(f)).reduce((r, i) => r.concat(i), [])
  },
  chain(f, a) {
    return a.map(f).reduce((r, i) => r.concat(i), [])
  },
  reduce(f, seed, a) {
    return a.reduce(f, seed)
  },
  traverse(A, f, a) {
    return a.map(f).reduce((r, i) => A.ap(A.map(a => i => a.concat([i]), r), i), A.of([]))
  },
}

test.wrap('SArray itself', test => {

  test('equals', 5, t => {
    t.ok(SArray.equals([], []))
    t.ok(SArray.equals([1, 2, 3], [1, 2, 3]))
    t.ok(!SArray.equals([1, 3, 3], [1, 2, 3]))
    t.ok(!SArray.equals([1, 2, 3], [1, 2]))
    t.ok(!SArray.equals([1, 2], [1, 2, 3]))
  })

  test('ap', 1, t => {
    t.deepEqual(SArray.ap([x => x + 1, x => x * 2], [2, 3]), [3, 4, 4, 6])
  })

  test('chain', 1, t => {
    t.deepEqual(SArray.chain(x => x === 3 ? [1, 2, 3] : [1, 2], [2, 3]), [1, 2, 1, 2, 3])
  })

  test('traverse', 1, t => {
    t.deepEqual(SArray.traverse(A, A.of, [1, 2, 3]), A.of([1, 2, 3]))
  })

})



// 3. Composition: `T.traverse(ComposeAB, x => x, u) ≡ A.map(v => T.traverse(B, x => x, v), T.traverse(A, x => x, u))` for `ComposeAB` defined bellow and for any Applicatives `A` and `B`

test('Traverse composition', 1, t => {

  const u = [A.of(B.of(1)), A.of(B.of(2))]
  const T = SArray

  const ComposeAB = {
    of(x) {
      return A.of(B.of(x))
    },
    ap(a1, a) {
      return A.ap(A.map(b1 => b2 => B.ap(b1, b2), a1), a)
    },
    map(f, a) {
      return A.map(b => B.map(f, b), a)
    },
  }

  t.deepEqual(
    T.traverse(ComposeAB, x => x, u),
    A.map(v => T.traverse(B, x => x, v), T.traverse(A, x => x, u))
  )

})



test('reduce derived from traverse', 1, t => {

  const F = SArray
  const derivedReduce = (f, acc, u) => {
    const of = () => acc
    const map = (_, x) => x
    const ap = f
    return F.traverse({of, map, ap}, x => x, u)
  }

  t.equals(
    derivedReduce((r, i) => r + i, '', ['a', 'b', 'c']),
    SArray.reduce((r, i) => r + i, '', ['a', 'b', 'c'])
  )

})



test('map derived from traverse', 1, t => {

  const F = SArray
  const derivedMap = (f, u) => {
    const of = (x) => x
    const map = (f, a) => f(a)
    const ap = (f, a) => f(a)
    return F.traverse({of, map, ap}, f, u)
  }

  t.deepEqual(
    derivedMap(x => x * 2, [1, 2, 3]),
    SArray.map(x => x * 2, [1, 2, 3])
  )

})
