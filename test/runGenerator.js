/* eslint-disable require-yield */

import makeTest from 'lobot/test'

import 'babel-polyfill'
import {runGenerator} from '../src'

function computeMaxCallStackSize() {
  try {
    return 1 + computeMaxCallStackSize()
  } catch (e) {
    return 1
  }
}
const MAX_STACK_SIZE = computeMaxCallStackSize()

const test = makeTest.wrap('runGenerator')

const Id = {
  of(x) {
    return {x}
  },
  chain(f, id) {
    return f(id.x)
  },
}

const IdRec = {
  of(x) {
    return {x}
  },
  map(f, id) {
    return IdRec.of(f(id.x))
  },
  chainRec(f, i) {
    const next = v => ({done: false, value: v})
    const done = v => ({done: true, value: v})
    let state = {done: false, value: i}
    while (state.done === false) {
      state = f(next, done, state.value).x
    }
    return IdRec.of(state.value)
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


const ListRec = {
  of(x) {
    return [x]
  },
  map(f, list) {
    return list.map(f)
  },
  chainRec(f, i) {
    const next = v => ({done: false, value: v})
    const done = v => ({done: true, value: v})
    let state = [{done: false, value: i}]
    while (!state.reduce((r, i) => r && i.done, true)) {
      state = state.reduce(
        (r, i) =>
          i.done
            ? r.concat([i])
            : r.concat(f(next, done, i.value))
      , [])
    }
    return state.map(i => i.value)
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


test('max stack size (Id chain)', 1, t => {
  t.throws(() => {
    runGenerator(Id, function* () {
      let i = MAX_STACK_SIZE + 2
      while (i !== 0) {
        i = yield Id.of(i - 1)
      }
      return Id.of(i)
    })
  })
})

test('max stack size (Id chainRec)', 1, t => {
  const result = runGenerator(IdRec, function* () {
    let i = MAX_STACK_SIZE + 2
    while (i !== 0) {
      i = yield IdRec.of(i - 1)
    }
    return IdRec.of(i)
  })
  t.deepEqual(result, IdRec.of(0))
})


test('max stack size (List chain)', 1, t => {
  t.throws(() => {
    runGenerator(List, function* () {
      let i = Math.round(MAX_STACK_SIZE / 5)
      while (i !== 0) {
        const x = yield [i - 1, -1]
        if (x === -1) {
          return []
        }
        i = x
      }
      return [i]
    })
  })
})

test('max stack size (List chainRec)', 1, t => {
  const result = runGenerator(ListRec, function* () {
    let i = Math.round(MAX_STACK_SIZE / 5)
    while (i !== 0) {
      const x = yield [i - 1, -1]
      if (x === -1) {
        return []
      }
      i = x
    }
    return [i]
  })
  t.deepEqual(result, [0])
})
