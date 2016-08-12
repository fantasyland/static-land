### `fromFLType`

`(FLType[, listOfMethodsThatShouldBeGenerated]) → TypeObject`

Given a Fantasy Land compatible type creates a Static Land type for it.

```js
import {fromFLType} from 'static-land'
import IdFL from 'fantasy-land/id'

const Id = fromFLType(IdFL)

Id.map(x => x + 41, Id.of(1)) // IdFL(42)
```
