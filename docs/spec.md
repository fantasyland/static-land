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

## Type

A type in Static Land is a JavaScript object with static functions as values.
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

## Type signatures

Each method in this spec comes with a type signature, that looks like the following.

```
map :: Functor f => (a → b) → f a → f b
```

We use syntax similar to Haskell's. You can learn about it from
[Hindley-Milner and Me](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html)
chapter of a briliant book "Professor Frisby's Mostly Adequate Guide to Functional Programming"
by [@DrBoolean](https://github.com/DrBoolean).

In short the declaration above consist of the followind parts:

 - `map` — function name.
 - `::` — a separator.
 - `Functor f` — a constraint saying that the type `f` (used in the following parts)
   must be a `Functor`.
 - `=>` — a separator.
 - `(a → b) → f a → f b` — the actual type of the function.
   It says that the function takes two arguments of types `a → b` and `f a`,
   and returns a value of type `f b`.
 - `a`, `b` — some arbitrary types.
 - `a → b` — a funtion of one argument that takes a value of type `a`
   and returns a value of type `b`.
 - `f a`, `f b` — this means '`f` of `a`'. For example if `f` is `Array` and `a`
   is `Number` it reads as 'array of numbers'.

If a method called with incorrect types the behaviour is undefined,
the recommended behaviour is to throw a `TypeError`.

## Equivalence

An appropriate definition of equivalence for the given value should ensure
that the two values can be safely swapped out in a program that respects abstractions.

For example:

 - Two lists are equivalent if they are equivalent at all indices.
 - Two plain old JavaScript objects, interpreted as dictionaries,
   are equivalent when they are equivalent for all keys.
 - Two promises are equivalent when they yield equivalent values.
 - Two functions are equivalent if they yield equivalent outputs for equivalent inputs.

We use `≡` symbol in laws to denote equivalence.


## Algebras

An algebra is a set of values (type instances), a set of operators (type methods) that it is closed under
and some laws it must obey.

Each Static Land algebra is a separate specification.
An algebra may have dependencies on other algebras which must be implemented.
An algebra may also state other algebra methods which do not need
to be implemented and how they can be derived from new methods.

* [Setoid](#setoid)
* [Semigroup](#semigroup)
* [Monoid](#monoid)
* [Functor](#functor)
* [Apply](#apply)
* [Applicative](#applicative)
* [Foldable](#foldable)
* [Traversable](#traversable)
* [Chain](#chain)
* [Monad](#monad)
* [Extend](#extend)
* [Comonad](#comonad)


## Setoid

#### Methods

  1. `equals :: Setoid s => s → s → Boolean`

#### Laws

  1. Reflexivity: `S.equals(a, a) === true`
  1. Symmetry: `S.equals(a, b) === S.equals(b, a)`
  1. Transitivity: if `S.equals(a, b)` and `S.equals(b, c)`, then `S.equals(a, c)`



## Semigroup

#### Methods

  1. `concat :: Semigroup s => s → s → s`

#### Laws

  1. Associativity: `S.concat(S.concat(a, b), c) ≡ S.concat(a, S.concat(b, c))`



## Monoid

Dependencies: Semigroup

#### Methods

  1. `empty :: Monoid m => () → m`

#### Laws

  1. Right identity: `M.concat(a, M.empty()) ≡ a`
  1. Left identity: `M.concat(M.empty(), a) ≡ a`



## Functor

#### Methods

  1. `map :: Functor f => (a → b) → f a → f b`

#### Laws

  1. Identity: `F.map(x => x, a) ≡ a`
  1. Composition: `F.map(x => f(g(x)), a) ≡ F.map(f, F.map(g, a))`
