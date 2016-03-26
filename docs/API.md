# Utils

### `fromIncomplete`

Makes methods curried and adds methods that can be derived from existing ones.

```js
import {fromIncomplete} from 'static-land'

const Type = fromIncomplete({

  of(x) {
    ...
  },

  chain(fn, t) {
    ...
  },

})

// Derived methods for free
Type.map
Type.ap

// All methods are curried
Type.chain(fn)(t)
Type.map(fn)(t)
```

### `fromFLType`

Given a Fantasy Land compatible type creates a Static Land type for it.

```js
import {fromFLType} from 'static-land'
import IdFL from 'fantasy-land/id'

const Id = fromFLType(IdFL)

Id.map(x => x + 41, Id.of(1)) // IdFL(42)
```


### `flow`

TODO

### `curry`

TODO

### `curryAll`

TODO

### `derive.deriveAll`

TODO

### `derive.*`

TODO


# Types

### Arr

TODO

### Obj

TODO

### Id
