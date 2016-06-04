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

## Type

A type in Static Land is a dictionary (JavaScript object) with static functions as values.
'Static' means that functions don't use `this`, they can be detached from the type object.
The type object is just a container for functions.

```js
const {of, map} = MyType

// This should work
map(x => x + 1, of(41)) // MyType(42)
```

Functions from type object are often called "methods" of the type.
But keep in mind that they are not "methods" in JS sense (they don't use `this`).

## Type signatures

Each method in this spec comes with a type signature, that looks like the following.

```
map :: Functor f => (a → b, f a) → f b
```

We use syntax similar to Haskell's. You can learn about it from
[Ramda's wiki](https://github.com/ramda/ramda/wiki/Type-Signatures) or from book
["Professor Frisby's Mostly Adequate Guide to Functional Programming"](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html)

This spec uses the followng extensions to the type signature syntax:

  1. `(a, b) → c` denotest a not curried function of 2 arguments. Same for more arguments.
  1. An upper case letter denotes the [type object](#type) of the type denoted by the same
     letter in lower case. For instance a function with type `(F, f) → a`
     can be called as `fn(F, F.of(1))`.

If a method called with incorrect types the behaviour is unspecified.
Also if a method accepts a function it must call the function according to the type
signature (pass arguments of correct types and don't pass less or more arguments that
specified in the signature).

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

An algebra is a set of values (type instances, and other values), a set of operators
(type methods) that it is closed under and some laws it must obey.

Each algebra is a separate specification.
An algebra may have dependencies on other algebras which must be implemented.

An algebra may also state other algebra methods which can be derived from new methods.
If a type provides a method which could be derived, its behaviour must be equivalent
to that of the derivation (or derivations).

* [Setoid](#setoid)
* [Semigroup](#semigroup)
* [Monoid](#monoid)
* [Functor](#functor)
* [Apply](#apply)
* [Applicative](#applicative)
* [Chain](#chain)
* [Monad](#monad)
* [Foldable](#foldable)
* [Extend](#extend)
* [Comonad](#comonad)
* [Traversable](#traversable)



## Setoid

#### Methods

  1. `equals :: Setoid s => (s, s) → Boolean`

#### Laws

  1. Reflexivity: `S.equals(a, a) === true`
  1. Symmetry: `S.equals(a, b) === S.equals(b, a)`
  1. Transitivity: if `S.equals(a, b)` and `S.equals(b, c)`, then `S.equals(a, c)`



## Semigroup

#### Methods

  1. `concat :: Semigroup s => (s, s) → s`

#### Laws

  1. Associativity: `S.concat(S.concat(a, b), c) ≡ S.concat(a, S.concat(b, c))`



## Monoid

#### Dependencies

  1. Semigroup

#### Methods

  1. `empty :: Monoid m => () → m`

#### Laws

  1. Right identity: `M.concat(a, M.empty()) ≡ a`
  1. Left identity: `M.concat(M.empty(), a) ≡ a`



## Functor

#### Methods

  1. `map :: Functor f => (a → b, f a) → f b`

#### Laws

  1. Identity: `F.map(x => x, a) ≡ a`
  1. Composition: `F.map(x => f(g(x)), a) ≡ F.map(f, F.map(g, a))`



## Apply

#### Dependencies

  1. Functor

#### Methods

  1. `ap :: Apply f => (f (a → b), f a) → f b`

#### Laws

  1. Composition: `A.ap(A.ap(A.map(f => g => x => f(g(x)), a), u), v) ≡ A.ap(a, A.ap(u, v))`



## Applicative

#### Dependencies

  1. Apply

#### Methods

  1. `of :: Applicative f => a → f a`

#### Laws

  1. Identity: `A.ap(A.of(x => x), v) ≡ v`
  1. Homomorphism: `A.ap(A.of(f), A.of(x)) ≡ A.of(f(x))`
  1. Interchange: `A.ap(u, A.of(y)) ≡ A.ap(A.of(f => f(y)), u)`

#### Can be derived

  1. Functor's map: `A.map = (f, u) => A.ap(A.of(f), u)`



## Chain

#### Dependencies

  1. Apply

#### Methods

  1. `chain :: Chain m => (a → m b, m a) → m b`

#### Laws

  1. Associativity: `M.chain(g, M.chain(f, u)) ≡ M.chain(x => M.chain(g, f(x)), u)`

#### Can be derived

  1. Apply's ap: `A.ap = (uf, ux) => A.chain(f => A.map(f, ux), uf)`



## Monad

#### Dependencies

  1. Applicative
  1. Chain

#### Laws

  1. Left identity: `M.chain(f, M.of(a)) ≡ f(a)`
  1. Right identity: `M.chain(M.of, u) ≡ u`

#### Can be derived

  1. Functor's map: `A.map = (f, u) => A.chain(x => A.of(f(x)), u)`




## Foldable

#### Methods

  1. `reduce :: Foldable f => ((a, b) → a, a, f b) → a`

#### Laws

  1. `F.reduce ≡ (f, x, u) => F.reduce((acc, y) => acc.concat([y]), [], u).reduce(f, x)`



## Extend

#### Methods

  1. `extend :: Extend e => (e a → b, e a) → e b`

#### Laws

  1. Associativity: `E.extend(f, E.extend(g, w)) ≡ E.extend(_w => f(E.extend(g, _w)), w)`



## Comonad

#### Dependencies

  1. Functor
  1. Extend

#### Methods

  1. `extract :: Comonad c => c a → a`

#### Laws

  1. `C.extend(C.extract, w) ≡ w`
  1. `C.extract(C.extend(f, w)) ≡ f(w)`
  1. `C.extend(f, w) ≡ C.map(f, C.extend(x => x, w))`



## Traversable

#### Methods

  1. `sequence :: (Traversable t, Applicative f) => (F, t (f a)) → f (t a)`

#### Laws

  1. Naturality: `f(T.sequence(A, u)) ≡ T.sequence(B, T.map(f))` for any `f` such that `B.map(g, f(a)) ≡ f(A.map(g, a))`
  2. Identity: `T.sequence(F, T.map(F.of, u)) ≡ F.of(u)` for any Applicative `F`
  3. Composition: `A.sequence(Compose(B, C), a) ≡ B.map(a1 => A.sequence(C, a1), A.sequence(B, a))` for `Compose` defined bellow (TODO: doublecheck)

```js
const Compose = (A, B) => ({

  of(a) {
    return a
  },

  ap(a1, a2) {
    return A.ap(A.map(b1 => b2 => B.ap(b1, b2), a1), a2)
  },

  map(f, a) {
    return A.map(b => B.map(f, b), a)
  },

})
```

#### Can be derived

  1. Foldable's reduce: TODO
