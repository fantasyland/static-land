# Static Land Specification

This is a specification for common algebraic types in JavaScript based on
[Fantasy Land Specification](https://github.com/fantasyland/fantasy-land).

## Difference from Fantasy Land

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

### Pros and cons compared to Fantasy Land.

#### Pros

  - No name clashes. Since a type is just a collection of functions that don't
    share any namespace we don't have problems with name clashes.
  - We can implement many types for same values. For example we can implemet
    two Functors for numbers — Addition and Multiplication.
  - We can implement types with primitives (Number, Boolean etc.) as values.
  - We can implemet seamless types. For example we can make a type with
    arrays as values, and user won't have to wrap/unwrap values to some
    wrapper class with Fantasy Land methods.

#### Cons

  - We have to pass around types more often.
    In Fantasy Land some generic code can be written using only methods,
    we have to pass types only for `of` and `empty`. In Static Land we have
    to pass types for any generic code.

## Terminology

### Type

A Static Land type is a JavaScript object with static functions as values.
'Static' means that functions don't use `this`,
they are not methods and can be detached from the type object.
The object is just a container for functions.

```js
const map = MyType.map
const of = MyType.of

// This should work
map(x => x + 1, of(41)) // MyType(42)
```

Each function of a type must be curried — if it's called with not enough
arguments, it must return a function that expects missing arguments.
(Don't worry `static-land` package has utils for converting normal functions to curried)

```js
const incLifted = MyType.map(x => x + 1)
incLifted(MyType.of(41)) // MyType(42)
```

### Equivalent

An appropriate definition of equivalence for the given value.
The definition should ensure that the two values can be safely swapped out in
a program that respects abstractions.

For example:

 - Two lists are equivalent if they are equivalent at all indices.
 - Two plain old JavaScript objects, interpreted as dictionaries,
   are equivalent when they are equivalent for all keys.
 - Two promises are equivalent when they yield equivalent values.
 - Two functions are equivalent if they yield equivalent outputs for equivalent inputs.

### Algebra

An algebra is a set of values (type instances), a set of operators (type methods) that it is closed under
and some laws it must obey.

Each Static Land algebra is a separate specification.
An algebra may have dependencies on other algebras which must be implemented.
An algebra may also state other algebra methods which do not need
to be implemented and how they can be derived from new methods.



## Setoid

#### Methods

  1. `equals :: Setoid s => s → s → Boolean`

#### Lasw

  1. `S.equals(a, a) === true` (reflexivity)
  1. `S.equals(a, b) === S.equals(b, a)` (symmetry)
  1. If `S.equals(a, b)` and `S.equals(b, c)`, then `S.equals(a, c)` (transitivity)



## Semigroup

#### Methods

  1. `concat :: Semigroup s => s → s → s`

#### Lasw

  1. `S.concat(S.concat(a, b), c)` is equivalent to `S.concat(a, S.concat(b, c))` (associativity)



## Monoid

Dependencies: Semigroup

#### Methods

  1. `empty :: Monoid m => () → m`

#### Laws

  1. `M.concat(a, M.empty())` is equivalent to `a` (right identity)
  1. `M.concat(M.empty(), a)` is equivalent to `a` (left identity)



## Functor

#### Methods

  1. `map :: Functor f => (a → b) → f a → f b`

#### Laws

  1. `F.map(x => x, a)` is equivalent to `a` (identity)
  1. `F.map(x => f(g(x)), a)` is equivalent to `F.map(f, F.map(g, a))` (composition)
