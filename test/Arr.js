import {makeTest} from './utils'
import Arr from '../src/Arr'

const test = makeTest('Arr')

test('of', 1, t => {
  t.deepEqual(Arr.of(1), [1])
})
