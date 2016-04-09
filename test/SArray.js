import makeTest from 'lobot/test'
import SArray from '../src/SArray'

const test = makeTest.wrap('SArray')

test('of', 1, t => {
  t.deepEqual(SArray.of(1), [1])
})
