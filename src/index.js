const { compileExpression } = require('filtrex')
const INTERPOLATE_REGEXP = /\{([^\}]+)\}/g

export default function Interpolated(interpolated, customExpressions) {
  const strings = []
  const expressions = []
  interpolated
    .split(Interpolated.INTERPOLATE_REGEXP)
    .map((term, index) => {
      if (index % 2 === 0) {
        strings.push(term)
      } else {
        expressions.push(compileExpression(term, customExpressions))
      }
    })
  const lastString = strings.pop()
  if (!strings.length) {
    return () => lastString
  }
  if (expressions.length === 1 && !lastString && !strings[0]) {
    const lastExpression = expressions[0]
    return scope => lastExpression(scope)
  }
  return scope => {
    const result = []
    strings.forEach((string, index) => result.push(string, expressions[index](scope)))
    result.push(lastString)
    return result.join('')
  }
}

Interpolated.INTERPOLATE_REGEXP = INTERPOLATE_REGEXP
