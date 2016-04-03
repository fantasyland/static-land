import makeTest from 'lobot/test'
import Arr from '../src/Arr'

const test = makeTest.wrap('Arr')

test('of', 1, t => {
  t.deepEqual(Arr.of(1), [1])
})
