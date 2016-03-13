import {curry} from './utils'

export const map2 = curry(
  (T, fn, t1, t2) => T.ap(T.map(x1 => x2 => fn(x1, x2), t1), t2)
)

export const ap = curry(
  (T, tf, tx) => T.chain(f => T.map(f, tx), tf)
)
