# Static Land

Specification for common algebraic types in JavaScript
based on [Fantasy Land](https://github.com/fantasyland/fantasy-land).

* [Specification](docs/spec.md)

### How to add compatibility with Static Land to you library

All you need to do is to expose some [Type Object](docs/spec.md#type) that can work with types that your library provides or with any other types, e.g. you can build a library that provides Static Land compatibility for another library or for native types like Array.

Type Object doesn't have to be simple JavaScript object, but can as well be a constructor of your type for instance. The only two requirements that:

- this object contains some static methods from Static Land,
- and if it contain a method with one of the names that Static Land reserves, that method must be a Static Land method (obey laws etc.)

#### Example 1. Static Land type for Array

```js
const SArray = {
  
  map(fn, arr) {
    return arr.map(fn)
  },
  
  ap(arr1, arr2) {
    // ...
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



## Utils

We also have `static-land` package on NPM that provides some useful utilities (not much at the moment).

* [API reference](docs/API.md)

### Installation

```sh
npm install fun-task
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
