# <img width="80" height="50" src="./logo/logo.png" /> Static Land

Specification for common algebraic structures in JavaScript
based on [fantasy-land](https://github.com/fantasyland/fantasy-land).

* [Specification](docs/spec.md)

### Difference from fantasy-land

Fantasy-land uses methods as a base for types. A type instance in fantasy-land
is an object with certain methods. For example a Functor type instance must be an object
that has a `fantasy-land/map` method.

In static-land we use static functions, and instances
of a type can be any values, including primitives (Number, Boolean, etc.)

For example we can implement an Addition module that uses numbers as values
and satisfies the Monoid algebra laws:

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
  - We can implement many types for same values. For example we can implement
    two Monoids for numbers: Addition and Multiplication.
  - We can implement modules that work with primitives (Number, Boolean, etc.) as values.

#### Cons

  - We have to pass around modules more often.
    In fantasy-land most of generic code can be written using only methods,
    we have to pass types representatives only for `of` and `empty`. In static-land we have
    to pass around modules for any generic code.

### How to add compatibility with static-land to your library

Simply expose some [module](docs/spec.md#module) that work with types that your library provides or with types defined in another library or with native types like Array.

Modules don't have to be simple JavaScript objects; they can also be constructors if desired. The only requirements are:

- this object contains some static methods from static-land; and
- if it contains a method with one of the names that static-land reserves, that method must be a static-land method (obey laws etc.).

#### Example 1. static-land module for Array

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

#### Example 2. static-land module as a Class

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


  // static-land methods

  static of(x) {
    // ...
  }

  static map(fn, value) {
    // ...
  }

}

export {MyType}
```

### Compatible libraries

We have a list in the wiki. Feel free to add your library there.

- [Compatible libraries](https://github.com/rpominov/static-land/wiki/Compatible-libraries)
