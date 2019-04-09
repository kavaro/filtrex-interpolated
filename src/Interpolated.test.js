import Interpolated from './Interpolated'

describe('Interpolated', () => {
  it('should return string when there is no interpolation', () => {
    const interpolated = new Interpolated('Hello')()
    expect(interpolated).toBe('Hello')
  })
  it('should return expression result when complete string a expression', () => {
    const interpolated = new Interpolated('{age}')({age: 52})
    expect(interpolated).toBe(52)
  })
  it('should return the interpolated string when expression is predeced by string', () => {
    const interpolated = new Interpolated('I am {age}')({age: 52})
    expect(interpolated).toBe('I am 52')
  })
  it('should return the interpolated string when expression is followed by string', () => {
    const interpolated = new Interpolated('{age} years')({age: 52})
    expect(interpolated).toBe('52 years')
  })
  it('should return the interpolated string when there is more then 1 expression', () => {
    const interpolated = new Interpolated('{message}{age}')({age: 52, message: 'I am '})
    expect(interpolated).toBe('I am 52')
  })
  it('should return the interpolated string when there is more then 1 expression interleaved with strings', () => {
    const interpolated = new Interpolated('{pre} am {age} years {post}')({pre: 'I', age: 52, post: 'old'})
    expect(interpolated).toBe('I am 52 years old')
  })
})