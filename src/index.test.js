import {flatten, Interpolated} from './index'

describe('filtrex-interpolated', () => {
  it('should export flatten and Interpolated', () => {
    const scope = flatten({a: {b: 'ab'}})
    expect(scope).toEqual({'a.b': 'ab'})
    expect(new Interpolated('value: {a.b}')(scope)).toBe('value: ab')
  })
})