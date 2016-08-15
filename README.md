# Static Land

Specification for common algebraic types in JavaScript
based on [Fantasy Land](https://github.com/fantasyland/fantasy-land).

* [Specification](docs/spec.md)

### Difference from Fantasy Land

Fantasy Land uses methods as a base for types. A type instance in Fantasy Land
is an object with certain methods. For example a Functor type instance must be an object
that has `.map()` method.

In Static Land a type is just a collection of static functions, and instances
of a type can be any values, including primitives (Number, Boolean etc.)

For example we can implement an Addition type, that uses numbers as it's instances,
and satisfies the Monoid laws:

```js
const Addition = {

  empty() {
    return 0
  },

  concat(a, b) {
    return a + b
  },

}
```

#### Pros

  - No name clashes. Since a type is just a collection of functions that don't
    share any namespace we don't have problems with name clashes.
  - We can implement many types for same values. For example we can implemet
    two Monoids for numbers — Addition and Multiplication.
  - We can implement types with primitives (Number, Boolean etc.) as values.
  - We can implemet seamless types. For example we can make a type with
    arrays as values, and user won't have to wrap/unwrap values to some
    wrapper class with Fantasy Land methods.

#### Cons

  - We have to pass around types more often.
    In Fantasy Land some generic code can be written using only methods,
    we have to pass types only for `of` and `empty`. In Static Land we have
    to pass types for any generic code.

### How to add compatibility with Static Land to your library

All you need to do is to expose some [Type Object](docs/spec.md#type) that can work with types that your library provides or with any other types, e.g. you can build a library that provides Static Land compatibility for another library or for native types like Array.

Type Object doesn't have to be simple JavaScript object, but can as well be a constructor of your type for instance. The only two requirements are:

- this object contains some static methods from Static Land,
- and if it contains a method with one of the names that Static Land reserves, that method must be a Static Land method (obey laws etc.)

#### Example 1. Static Land type for Array

```js
const SArray = {

  of(x) {
    return [x]
  },

  map(fn, arr) {
    return arr.map(fn)
  },

  chain(fn, arr) {
    // ...
  },

}

export {SArray}
```

#### Example 2. Static Land type as a Class

```js
class MyType = {

  constructor() {
    // ...
  }

  someInstanceMethod() {
    // ...
  }

  static someNonStaticLandStaticMethod() {
    // ...
  }


  // Static Land methods

  static of(x) {
    // ...
  }

  static map(fn, value) {
    // ...
  }

}

export {MyType}
```



## Utils [![Build Status](https://travis-ci.org/rpominov/static-land.svg?branch=master)](https://travis-ci.org/rpominov/static-land) [![Coverage Status](https://coveralls.io/repos/github/rpominov/static-land/badge.svg?branch=master)](https://coveralls.io/github/rpominov/static-land?branch=master)

We also have `static-land` package on NPM that provides some useful utilities (not many at the moment).

* [API reference](docs/API.md)

### Installation

```sh
npm install static-land
```

```js
// modern JavaScritp
import {fromFLType} from 'static-land'

// classic JavaScript
var fromFLType = require('static-land').fromFLType
```

Or using CDN:

```html
<script src="https://npmcdn.com/static-land/umd/staticLand.js"></script>
<script>
  var fromFLType = window.StaticLand.fromFLType
</script>
```

### Development

```
npm run lobot -- --help
```

Run [lobot](https://github.com/rpominov/lobot) commands as `npm run lobot -- args...`
