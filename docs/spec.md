# Static Land Specification

This specification describes JavaScript interfaces and laws
of algebras that are common in functional languages like Haskell.


## Module

Module is a JavaScript object, that contains some static functions and values.
Static means that functions don't use `this`, and when detached from the object work in the same way.
Here is an example:

```js
const FooModule = {
  foo: 1,            // a value
  bar: (x) => x + 1, // a function
}
```

Note that this has nothing to do with JavaScript module systems like ES6 modules,
in this specification a module is just an object.


## Module Signature

Module signature describes an interface that a module can match. The syntax is very similar to
that of Flow or TypeScript. Here is an example of a signature that the `FooModule` above matches:

```js
Foo {
  foo: number,
  bar: (number) => number
}
```

A signature can be parameterized by a type, which looks like this:

```js
ParameterizedFoo<T> {
  foo: T,
  bar: (T) => T
}
```

A module matches a parameterized signature, if there is some concrete type such that if we
substitute all occurrences of `T` in the signature with that type,
the module will match resulting signature.
For example if we substitute `T` in `ParameterizedFoo` with `number` we get a signature
that `FooModule` matches, therefore `FooModule` matches `ParameterizedFoo`.

Also functions in a signature can have type variables.
Any single lower-case letter in a function type is a type variable. For instance:

```js
Bar<T> {
  baz: (a) => T<a>
}
```

Notice that `T` can be a parameterized type as well.
The number of type variabless of `T` becomes obvious when `T` is used inside the signature.

Also notice that signature level type variables are fixed for a module,
while a function level variable can be substituted with
a different concrete type in each function application.
In other words we must choose what `T` stands for when we create a module,
and we must choose what `a` stands for only when we apply `baz` to some value.

A type signature may be a part of another type signature,
which means that we should pass a module that matches that signature in that place.
For example:

```js
Baz {
  compute: (a, ParameterizedFoo<a>) => a
}
```

The above means that when we apply `compute` to say `number` we must pass
as the second argument a module that matches `ParameterizedFoo` with `T=number`, like so:

```js
someBaz.compute(10, FooModule)
```

## Equivalence

An appropriate definition of equivalence for the given value should ensure
that the two values can be safely swapped out in a program that respects abstractions.

For example:

 - Two lists are equivalent if they are equivalent at all indices.
 - Two plain old JavaScript objects, interpreted as dictionaries,
   are equivalent when they are equivalent for all keys.
 - Two promises are equivalent when they yield equivalent values.
 - Two functions are equivalent if they yield equivalent outputs for equivalent inputs.

Note that these examples are not universal, in some cases different
definitions of equivalense for that types might be more appropriate.
It depends on which exact abstractions you choose to use in a program.

We use `≡` symbol in laws to denote equivalence.


## Parametricity

All methods' implementations should only use type information about arguments that is known from the signatures.
It's not allowed to inspect arguments or values that they produce
or contain to get more information about their types. In other words methods
should be [parametrically polymorphic](https://en.wikipedia.org/wiki/Parametric_polymorphism).


## Algebra

Algebra is a set of requirements for modules, like to match some signature and to obey some laws.
If a module satisfies all requirements of an algebra it supports that algebra.
An algebra may require to support other algebras.

An algebra may also state other algebra methods which can be derived from new methods.
If a module provides a method which could be derived, its behaviour must be
equivalent to that of the derivation (or derivations).

* [Setoid](#setoid)
* [Semigroup](#semigroup)
* [Monoid](#monoid)
* [Functor](#functor)
* [Bifunctor](#bifunctor)
* [Contravariant](#contravariant)
* [Profunctor](#profunctor)
* [Apply](#apply)
* [Applicative](#applicative)
* [Alt](#alt)
* [Plus](#plus)
* [Alternative](#alternative)
* [Chain](#chain)
* [ChainRec](#chainrec)
* [Monad](#monad)
* [Foldable](#foldable)
* [Extend](#extend)
* [Comonad](#comonad)
* [Traversable](#traversable)


### Setoid

```js
Setoid<T> {
  equals: (T, T) => boolean
}
```

Module must match the `Setoid` signature for some type `T`, and obey following laws:

  1. Reflexivity: `S.equals(a, a) === true`
  1. Symmetry: `S.equals(a, b) === S.equals(b, a)`
  1. Transitivity: if `S.equals(a, b)` and `S.equals(b, c)`, then `S.equals(a, c)`


### Semigroup

```js
Semigroup<T> {
  concat: (T, T) => T
}
```

Module must match the `Semigroup` signature for some type `T`, and obey following laws:

  1. Associativity: `S.concat(S.concat(a, b), c) ≡ S.concat(a, S.concat(b, c))`


### Monoid

```js
Monoid<T> {
  empty: () => T
}
```

Module must match the `Monoid` signature for some type `T`,
support `Semigroup` algebra for the same `T`, and obey following laws:

  1. Right identity: `M.concat(a, M.empty()) ≡ a`
  1. Left identity: `M.concat(M.empty(), a) ≡ a`


### Functor

```js
Functor<T> {
  map: (a => b, T<a>) => T<b>
}
```

Module must match the `Functor` signature for some type `T`, and obey following laws:

  1. Identity: `F.map(x => x, a) ≡ a`
  1. Composition: `F.map(x => f(g(x)), a) ≡ F.map(f, F.map(g, a))`



### Bifunctor

```js
Bifunctor<T> {
  bimap: (a => b, c => d, T<a, c>) => T<b, d>
}
```

Module must match the `Bifunctor` signature for some type `T`,
support `Functor` algebra for all types `U` created by setting the first parameter of `T`
to an arbitrary concrete type (for example `type U<a> = T<number, a>`),
and obey following laws:

  1. Identity: `B.bimap(x => x, x => x, a) ≡ a`
  1. Composition: `B.bimap(x => f(g(x)), x => h(i(x)), a) ≡ B.bimap(f, h, B.bimap(g, i, a))`

#### Can be derived

  1. Functor's map: `A.map = (f, u) => A.bimap(x => x, f, u)`



### Contravariant

```js
Contravariant<T> {
  contramap: (a => b, T<b>) => T<a>
}
```

Module must match the `Contravariant` signature for some type `T`, and obey following laws:

  1. Identity: `F.contramap(x => x, a) ≡ a`
  1. Composition: `F.contramap(x => f(g(x)), a) ≡ F.contramap(g, F.contramap(f, a))`


### Profunctor

```js
Profunctor {
  promap: (a => b, c => d, T<b, c>) => T<a, d>
}
```

Module must match the `Profunctor` signature for some type `T`,
support `Functor` algebra for all types `U` created by setting the first parameter of `T`
to an arbitrary concrete type (for example `type U<a> = T<number, a>`),
and obey following laws:

  1. Identity: `P.promap(x => x, x => x, a) ≡ a`
  1. Composition: `P.promap(x => f(g(x)), x => h(i(x)), a) ≡ P.promap(g, h, P.promap(f, i, a))`

#### Can be derived

  1. Functor's map: `A.map = (f, u) => A.promap(x => x, f, u)`



### Apply

```js
Apply<T> {
  ap: (T<a => b>, T<a>) => T<b>
}
```

Module must match the `Apply` signature for some type `T`,
support `Functor` algebra for the same `T`, and obey following laws:

  1. Composition: `A.ap(A.ap(A.map(f => g => x => f(g(x)), a), u), v) ≡ A.ap(a, A.ap(u, v))`



### Applicative

```js
Applicative<T> {
  of: (a) => T<a>
}
```

Module must match the `Applicative` signature for some type `T`,
support `Apply` algebra for the same `T`, and obey following laws:

  1. Identity: `A.ap(A.of(x => x), v) ≡ v`
  1. Homomorphism: `A.ap(A.of(f), A.of(x)) ≡ A.of(f(x))`
  1. Interchange: `A.ap(u, A.of(y)) ≡ A.ap(A.of(f => f(y)), u)`

#### Can be derived

  1. Functor's map: `A.map = (f, u) => A.ap(A.of(f), u)`



### Alt

```js
Alt<T> {
  alt: (T<a>, T<a>) => T<a>
}
```

Module must match the `Alt` signature for some type `T`,
support `Functor` algebra for the same `T`, and obey following laws:

  1. Associativity: `A.alt(A.alt(a, b), c) ≡ A.alt(a, A.alt(b, c))`
  2. Distributivity: `A.map(f, A.alt(a, b)) ≡ A.alt(A.map(f, a), A.map(f, b))`



### Plus

```js
Plus<T> {
  zero: () => T<a>
}
```

Module must match the `Plus` signature for some type `T`,
support `Alt` algebra for the same `T`, and obey following laws:

  1. Right identity: `P.alt(a, P.zero()) ≡ a`
  2. Left identity: `P.alt(P.zero(), a) ≡ a`
  3. Annihilation: `P.map(f, P.zero()) ≡ P.zero()`



### Alternative

Module must support `Applicative` and `Plus` algebras for a same `T`,
and obey following laws:

  1. Distributivity: `A.ap(A.alt(a, b), c) ≡ A.alt(A.ap(a, c), A.ap(b, c))`
  2. Annihilation: `A.ap(A.zero(), a) ≡ A.zero()`



### Chain

```js
Chain<T> {
  chain: (a => T<b>, T<a>) => T<b>
}
```

Module must match the `Chain` signature for some type `T`,
support `Apply` algebra for the same `T`, and obey following laws:

  1. Associativity: `M.chain(g, M.chain(f, u)) ≡ M.chain(x => M.chain(g, f(x)), u)`

#### Can be derived

  1. Apply's ap: `A.ap = (uf, ux) => A.chain(f => A.map(f, ux), uf)`



### ChainRec

```js
ChainRec<T> {
  chainRec: ((a => c, b => c, a) => T<c>, a) => T<b>
}
```

Module must match the `ChainRec` signature for some type `T`,
support `Chain` algebra for the same `T`, and obey following laws:

  1. Equivalence: `C.chainRec((next, done, v) => p(v) ? C.map(done, d(v)) : C.map(next, n(v)), i) ≡ (function step(v) { return p(v) ? d(v) : C.chain(step, n(v)) }(i))`
  2. Stack usage of `C.chainRec(f, i)` must be at most a constant multiple of the stack usage of `f` itself.



### Monad

Module must support `Applicative` and `Chain` algebras for a same `T`,
and obey following laws:

  1. Left identity: `M.chain(f, M.of(a)) ≡ f(a)`
  1. Right identity: `M.chain(M.of, u) ≡ u`

#### Can be derived

  1. Functor's map: `A.map = (f, u) => A.chain(x => A.of(f(x)), u)`



### Foldable

```js
Foldable<T> {
  reduce: ((a, b) => a, a, T<b>) => a
}
```

Module must match the `Foldable` signature for some type `T`,
and obey following laws:

  1. `F.reduce ≡ (f, x, u) => F.reduce((acc, y) => acc.concat([y]), [], u).reduce(f, x)`



### Extend

```js
Extend<T> {
  extend: (T<a> => b, T<a>) => T<b>
}
```

Module must match the `Extend` signature for some type `T`,
and obey following laws:

  1. Associativity: `E.extend(f, E.extend(g, w)) ≡ E.extend(_w => f(E.extend(g, _w)), w)`



### Comonad

```js
Comonad<T> {
  extract: (T<a>) => a
}
```

Module must match the `Comonad` signature for some type `T`,
support `Functor` and `Extend` algebras for the same `T`, and obey following laws:

#### Laws

  1. `C.extend(C.extract, w) ≡ w`
  1. `C.extract(C.extend(f, w)) ≡ f(w)`
  1. `C.extend(f, w) ≡ C.map(f, C.extend(x => x, w))`



### Traversable

In the following signature `Applicative<U>` means that a value must
not only match `Applicative` signature, but also fully support `Applicative` algebra.

```js
Traversable<T> {
  traverse: (Applicative<U>, a => U<b>, T<a>) => U<T<b>>
}
```

Module must match the `Traversable` signature for some type `T`,
support `Functor` and `Foldable` algebras for the same `T`, and obey following laws:

  1. Naturality: `f(T.traverse(A, x => x, u)) ≡ T.traverse(B, f, u)` for any `f` such that `B.map(g, f(a)) ≡ f(A.map(g, a))`
  2. Identity: `T.traverse(F, F.of, u) ≡ F.of(u)` for any Applicative `F`
  3. Composition: `T.traverse(ComposeAB, x => x, u) ≡ A.map(v => T.traverse(B, x => x, v), T.traverse(A, x => x, u))` for `ComposeAB` defined bellow and for any Applicatives `A` and `B`

```js
const ComposeAB = {

  of(x) {
    return A.of(B.of(x))
  },

  ap(a1, a2) {
    return A.ap(A.map(b1 => b2 => B.ap(b1, b2), a1), a2)
  },

  map(f, a) {
    return A.map(b => B.map(f, b), a)
  },

}
```

#### Can be derived

  1. Foldable's reduce:

    ```js
    F.reduce = (f, acc, u) => {
      const of = () => acc
      const map = (_, x) => x
      const ap = f
      return F.traverse({of, map, ap}, x => x, u)
    }
    ```

  2. Functor's map:

    ```js
    F.map = (f, u) => {
      const of = (x) => x
      const map = (f, a) => f(a)
      const ap = (f, a) => f(a)
      return F.traverse({of, map, ap}, f, u)
    }
    ```
