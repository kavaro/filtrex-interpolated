# Filtrex-interpolated

Interpolate a string with filtrex expressions

Supports custom functions, custom getProperty function, custom tag functions and validation function

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

## Custom function (second argument to filtrex)

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
  custom: {
    get: (src, ...path) => get(src, path)
  }
})
expect(compiled(scope)).toBe('Welcome U1') 
```

## Using custom getProperty function (3rd argument to filtrex)

```js
class Name {
  constructor(first, last) {
    this.first = first
    this.last = last
  }

  get full() {
    return this.first + ' ' + this.last
  }
}

function getProperty(propertyName, get, object) {
  return (object instanceof Name) && propertyName === 'full' ? object[propertyName] : get(propertyName)
}
const interpolated4 = new Interpolated('{full of name}', { getProperty })({ name: new Name('FIRST', 'LAST') })
expect(interpolated4).toBe('FIRST LAST')
```

## Using custom tag function

```js
// import tag -> the default tag function
import Interpolated, { tag } from 'filtrex-interpolated' 

const interpolated1 = new Interpolated(
  'collection/{id of doc}',
  {
    tag: (strings, ...values) => tag(strings, ...values)
  }
)({})
expect(interpolated1).toBe('collection/')
```

## Using validation function

```js
// import validate -> a tag factory that takes a custom validation function as argument
// The custom validation function is called for every expression value and must return an array with 2 elements
//  [
//    boolean: true when validation for value was successful, 
//    any: interpolation value to return when validation failed
//  ]
// The validation function receives the following arguments:
//  validate(value, index, values, strings)
//    - value: value of the current expression
//    - index: index of the current expression in values array
//    - values: all expression values
//    - strings: all strings
import Interpolated, { tag, validate } from 'filtrex-interpolated'

const interpolated1 = new Interpolated(
  'collection/{id}',
  {
    tag: validate(value => [value !== undefined, undefined])
  }
)({})
// validation failed -> interpolated value = second element in array returned from validate function
expect(interpolated1).toBe(undefined)  

const interpolated2 = new Interpolated(
  'collection/{id}',
  {
    tag: validate(value => [value !== undefined, undefined]) 
  }
)({
  id: 'my-id'
})
// validation success -> second element in array returned from validate function is ignored
expect(interpolated2).toBe('collection/my-id') 

```

## Changing interpolation regexp

```js
import Interpolated from 'filtrex-interpolated'
Interpolated.INTERPOLATE_REGEXP = /\$\{([^\}]+)\}/g
const interpolated = new Interpolated('${age}')({age: 52})
expect(interpolated).toBe(52)
```
