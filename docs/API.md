# Utils

### `fromIncomplete`

`IncompleteTypeObject → TypeObject`

Makes methods curried and adds methods that can be derived from existing ones.
Uses [curryAll](#curryall) and [derive.deriveAll](#derivederiveall) under the hood,
you can use these function if you want only curry or only derived methods.

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


### `curry`

`((a, b, ...) → c) → a → b → ... → c`

Makes a function curried.

```js
import {curry} from 'static-land'

const fn = curry((a, b, c) => a + b + c)

fn(1)(2)(3) // 6
fn(1, 2)(3) // 6
fn(1)(2, 3) // 6
fn(1, 2, 3) // 6
```


### `curryAll`

`{k: (a, b, ...) → c} → {k: a → b → ... → c}`

Makes all functions in an object curried.

```js
import {curryAll} from 'static-land'

const obj = curryAll({
  foo(a, b, c) {
    return a + b + c
  },
})

obj.foo(1)(2)(3) // 6
```





### `derive.deriveAll`

`TypeObject → TypeObject`

Creates a new type object with additional methods that can be derived from existing ones.

Note: all methods in the given object must be curried
[as spec requires](https://github.com/rpominov/static-land/blob/master/docs/spec.md#type),
which is why we use `curryAll` in the example.

```js
import {derive} from 'static-land'
import {curryAll} from 'static-land'

const obj = derive.deriveAll(curryAll({
  of(x) {...},
  chain(fn, t) {...},
}))

obj.map(fn, t) // works
```


### `derive.*`

TODO


# Types

### Arr

TODO

### Obj

TODO

### Id

TODO

