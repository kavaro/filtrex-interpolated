# Filtrex-interpolated

Interpolate string with filtrex expressions

# Examples

## Interpolation

```js
import {Interpolated} from 'filtrex-interpolated'
const interpolated = new Interpolated('I am {age} years old')
expect(interpolated({age: 52})).toBe('I am 52 years old')
```

## Expression

```js
import {Interpolated} from 'filtrex-interpolated'
const interpolated = new Interpolated('{age + 1}')
expect(interpolated({age: 52})).toBe(53) // NOTE: a number and not a string
```

