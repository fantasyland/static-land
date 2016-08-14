### `fromFLType`

`(FLType[, listOfMethodsThatShouldBeGenerated]) → TypeObject`

Given a Fantasy Land compatible type creates a Static Land type for it.

```js
import {fromFLType} from 'static-land'
import IdFL from 'fantasy-land/id'

const Id = fromFLType(IdFL)

Id.map(x => x + 41, Id.of(1)) // IdFL(42)
```


### `runGenerator`

`(TypeObject, generator) → typeValue`

This is something like [Haskell's do notation](https://en.wikibooks.org/wiki/Haskell/do_notation)
for Static Land monads based on
[generators](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Iterators_and_Generators).

`TypeObject` must contain the [chain](./spec.md#chain) method. The `generator`
function must `yield` and `return` values that `TypeObject` uses as it's values.

```js
import {runGenerator} from 'static-land'

const List = {

  of(x) {
    return [x]
  },

  chain(f, list) {
    return list.reduce((acc, input) => acc.concat(f(input)), [])
  },

}

runGenerator(List, function*() {
  const x = yield [1, 2]
  const y = yield [3, 4]
  return [x * y]
}) // -> [3, 4, 6, 8]

runGenerator(List, function*() {
  const x = yield [1, -2, 3]
  return return x > 0 ? [x * 2] : []
}) // -> [2, 6]
```

Keep in mind that for monads that represent several values (like List or Observable)
the `generator` function may be executed several times, so make sure it's pure.
For one-or-less-value Monads (like Future or Maybe) it's safe to assume that `generator` function
executed only once.
