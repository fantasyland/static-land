# <img width="80" height="50" src="./logo/logo.png" /> Static Land

This is a specification for common algebraic structures in JavaScript
based on [Fantasy Land](https://github.com/fantasyland/fantasy-land).

* [Specification](docs/spec.md)

### Difference from Fantasy Land

Fantasy Land uses methods to define interfaces that a type must implement in
order to support a particular Algebra. For example values of a type that
implements the Monoid algebra must have `fantasy-land/empty` and
`fantasy-land/concat` methods on them.

Static Land takes a different approach. Instead of methods, we use static
functions, that are grouped together in [modules](docs/spec.md#module).

For example, here is an Addition module that uses numbers as values and
satisfies the Monoid algebra requirements:

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

  - No name clashes. Since a module is just a collection of functions that don't
    share any namespace we don't have problems with name clashes.
  - We can implement many modules for one type, therefore we can have more than
    one instance of the same Algebra for a single type. For example, we can
    implement two Monoids for numbers: Addition and Multiplication.
  - We can implement modules that work with built-in types as values (Number,
    Boolean, Array, etc).

#### Cons

  - We have to pass around modules when we write generic code. In Fantasy Land
    most of generic code can be written using only methods, only if we need
    methods like `of` or `empty` we might need to pass the type representative.
    ([This can be fixed!](https://github.com/rpominov/static-land/issues/45))

### How to add compatibility with Static Land to your library

Simply expose a [module](docs/spec.md#module) that works with types that your
library provides or with types defined in another library or with native types
like Array.

Modules don't have to be simple JavaScript objects; they can also be
constructors if desired. The only requirements are:

- this object contains some static methods from Static Land; and
- if it contains a method with one of the names that Static Land reserves, that
  method must be the Static Land method (obey laws etc).

#### Example 1. Static Land module for Array

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

#### Example 2. Static Land module as a Class

```js
class MyType {

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


#### Example 3. Static Land module as ECMAScript modules

```js
// mytype.js

// Static Land methods

export function of(x) {
  // ...
}

export function map(fn, value) {
  // ...
}
```

Import as

```js
import * as MyType from "./mytype" // MyType is now a Static Land module
```

### Compatible libraries

We have a list in the wiki. Feel free to add your library there.

- [Compatible libraries](https://github.com/rpominov/static-land/wiki/Compatible-libraries)
