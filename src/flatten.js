import { isObject, isArray } from 'lodash/lang'

export default function flatten(src, path = [], dst = {}) {
  if (isArray(src)) {
    src.forEach((value, index) => {
      path.push(index)
      flatten(value, path, dst)
      path.pop()
    })
  } else if (isObject(src)) {
    Object.keys(src).forEach(key => {
      path.push(key)
      flatten(src[key], path, dst)
      path.pop()
    })
  } else {
    dst[path.join('.')] = src
  }
  return dst
}