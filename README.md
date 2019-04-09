# Filtrex-interpolated

Interpolate a string with filtrex expressions

# Examples

## String Interpolation

```js
import Interpolated from 'filtrex-interpolated'

const interpolated = new Interpolated('I am {age}')({age: 52})
expect(interpolated).toBe('I am 52')
```

## String expression

```js
import Interpolated from 'filtrex-interpolated'

const interpolated = new Interpolated('{age}')({age: 52})
expect(interpolated).toBe(52) // NOTE: type is Number and not String
```

## Custom expressions

```js
import Interpolated from 'filtrex-interpolated'
import {get} from 'lodash/object'

const scope = {
  users: [
    {name: 'U0'},
    {name: 'U1'},
    {name: 'U2'}
  ],
  userIndex: 1
}
const compiled = new Interpolated('Welcome {get(users, userIndex, "name")}', {
  get: (src, ...path) => get(src, path)
})
expect(compiled(scope)).toBe('Welcome U1') 
```

## Changing interpolation regexp

```js
import Interpolated from 'filtrex-interpolated'
Interpolated.INTERPOLATE_REGEXP = /\$\{([^\}]+)\}/g
const interpolated = new Interpolated('${age}')({age: 52})
expect(interpolated).toBe(52)
```
