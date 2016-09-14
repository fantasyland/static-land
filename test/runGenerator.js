/* eslint-disable require-yield */

import makeTest from 'lobot/test'

import 'babel-polyfill'
import {runGenerator} from '../src'

const test = makeTest.wrap('runGenerator')

const Id = {
  of(x) {
    return {x}
  },
  chain(f, id) {
    return f(id.x)
  },
}


const List = {
  of(x) {
    return [x]
  },
  chain(f, list) {
    return list.reduce((acc, input) => acc.concat(f(input)), [])
  },
}


test('noop (Id)', 1, t => {
  const result = runGenerator(Id, function* () {
    return Id.of(2)
  })
  t.deepEqual(result, Id.of(2))
})

test('one yield (Id)', 1, t => {
  const result = runGenerator(Id, function* () {
    const x = yield Id.of(2)
    return Id.of(x)
  })
  t.deepEqual(result, Id.of(2))
})

test('two yields (Id)', 1, t => {
  const result = runGenerator(Id, function* () {
    const x = yield Id.of(2)
    const y = yield Id.of(3)
    return Id.of(x + y)
  })
  t.deepEqual(result, Id.of(5))
})

test('delegated yield (Id)', 1, t => {
  const sub = function* (x) {
    const y = yield Id.of(3)
    return Id.of(x + y)
  }
  const result = runGenerator(Id, function* () {
    const x = yield Id.of(2)
    const result = yield* sub(x)

    // Not sure I'm hapy with yield* returning M(x) and not x
    // return Id.of(result)
    return result
  })
  t.deepEqual(result, Id.of(5))
})




test('noop (List)', 1, t => {
  const result = runGenerator(List, function* () {
    return [1, 2]
  })
  t.deepEqual(result, [1, 2])
})

test('one yield (List, 1 -> 1)', 2, t => {
  const marker = t.calledOnce()
  const result = runGenerator(List, function* () {
    marker()
    const x = yield List.of(2)
    return List.of(x)
  })
  t.deepEqual(result, List.of(2))
})

test('one yield (List, 2 -> 1)', 3, t => {
  const marker = t.calledWith(1, 1)
  const result = runGenerator(List, function* () {
    marker(1)
    const x = yield [1, 2]
    return List.of(x)
  })
  t.deepEqual(result, [1, 2])
})

test('one yield (List, 2 -> 2)', 3, t => {
  const marker = t.calledWith(1, 1)
  const result = runGenerator(List, function* () {
    marker(1)
    const x = yield [1, 2]
    return [x, x]
  })
  t.deepEqual(result, [1, 1, 2, 2])
})

test('two yields (List, 1 -> 1 -> 1)', 2, t => {
  const marker = t.calledOnce()
  const result = runGenerator(List, function* () {
    marker()
    const x = yield List.of(2)
    const y = yield List.of(3)
    return List.of(x + y)
  })
  t.deepEqual(result, List.of(5))
})

test('two yields (List, 2 -> 2 -> 1)', 4 * 3 + 1, t => {
  const marker = t.calledWith(1, 1, 1, 1)
  const markerX = t.calledWith(10, 10, 20, 20)
  const markerY = t.calledWith(3, 4, 3, 4)
  const result = runGenerator(List, function* () {
    marker(1)
    const x = yield [10, 20]
    markerX(x)
    const y = yield [3, 4]
    markerY(y)
    return List.of(x + y)
  })
  t.deepEqual(result, [13, 14, 23, 24])
})

test('filter and map (List)', 1, t => {
  const result = runGenerator(List, function* () {
    const x = yield [1, -2, 3]
    return x > 0 ? [x * 2] : []
  })
  t.deepEqual(result, [2, 6])
})
