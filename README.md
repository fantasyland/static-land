# Static Land

Specification for common algebraic types in JavaScript
based on [Fantasy Land](https://github.com/fantasyland/fantasy-land).

 * [Specification](docs/spec.md)

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
