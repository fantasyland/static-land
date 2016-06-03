# Utils

### `fromFLType`

`(FLType[, listOfMethodsThatShouldBeGenerated]) → TypeObject`

Given a Fantasy Land compatible type creates a Static Land type for it.

```js
import {fromFLType} from 'static-land'
import IdFL from 'fantasy-land/id'

const Id = fromFLType(IdFL)

Id.map(x => x + 41, Id.of(1)) // IdFL(42)
```


### `flow`

`(a, a → b, b → c, ..., e → f) → f`

Applies functions to a value sequentially.

```js
import {flow} from 'static-land'

flow(1,
  x => x + 1,
  x => x === 2 ? 'two' : 'one',
  x => x.toUpperCase()
) // 'TWO'
```




### `derive.deriveAll`

`TypeObject → TypeObject`

Creates a new type object with additional methods that can be derived from existing ones.

```js
import {derive} from 'static-land'

const obj = derive.deriveAll({
  of(x) {...},
  chain(fn, t) {...},
})

obj.map(fn, t) // works
```


### `derive.*`

TODO


# Types

### SArray

TODO

### SObject

TODO

### SId

TODO
