import flatten from './flatten'

describe('flatten', () => {
  it('should flatten nested object', () => {
    const dst = flatten({
      a: {
        b: 'b'
      },
      c: 'c'
    })
    expect(dst).toEqual({
      'a.b': 'b',
      c: 'c'
    })
  })
  it('should flatten nested array', () => {
    const dst = flatten({
      a: ['b'],
      c: 'c'
    })
    expect(dst).toEqual({
      'a.0': 'b',
      c: 'c'
    })
  })
  it('should flatten nested objects and arrays', () => {
    const dst = flatten({
      a: {
        b: 'b',
        c: ['c', {
          d: 'd'
        }]
      },
      e: 'e'
    })
    expect(dst).toEqual({
      'a.b': 'b',
      'a.c.0': 'c',
      'a.c.1.d': 'd',
      e: 'e'
    })
  })
})