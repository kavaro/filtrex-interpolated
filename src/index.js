const { compileExpression } = require('filtrex')
const INTERPOLATE_REGEXP = /\{([^\}]+)\}/g

export function tag(strings, ...values) {
  if (!strings.length) {
    return values[0]
  }
  const result = []
  values.forEach((value, index) => {
    result.push(strings[index], value)
  })
  result.push(strings[strings.length - 1])
  return result.join('')
}

export const validate = fn => (strings, ...values) => {
  for (let i = 0, l = values.length; i < l; i++) {
    const [validated, returnValue] = fn(values[i], i, values, strings)
    if (!validated) {
      return returnValue
    }
  }
  return tag(strings, ...values)
}

const defaultTag = tag

export default function Interpolated(interpolated, { custom, getProperty, tag = defaultTag } = {}) {
  const strings = []
  const expressions = []
  interpolated
    .split(Interpolated.INTERPOLATE_REGEXP)
    .map((term, index) => {
      if (index % 2 === 0) {
        strings.push(term)
      } else {
        expressions.push(compileExpression(term, custom, getProperty))
      }
    })
  const lastString = strings.pop()
  if (!strings.length) {
    return () => lastString
  }
  if (expressions.length === 1 && !lastString && !strings[0]) {
    const lastExpression = expressions[0]
    return scope => tag([], lastExpression(scope))
  }
  strings.push(lastString)
  return scope => tag(strings, ...expressions.map(expression => expression(scope)))
}

Interpolated.INTERPOLATE_REGEXP = INTERPOLATE_REGEXP
