import Interpolated, { tag, validate } from '.'
import { get } from 'lodash/object'
import flat from 'flat'

describe('Interpolated', () => {
  it('should return string when there is no interpolation', () => {
    const interpolated = new Interpolated('Hello')()
    expect(interpolated).toBe('Hello')
  })
  it('should return expression result when complete string a expression', () => {
    const interpolated = new Interpolated('{age}')({ age: 52 })
    expect(interpolated).toBe(52)
  })
  it('should return the interpolated string when expression is predeced by string', () => {
    const interpolated = new Interpolated('I am {age}')({ age: 52 })
    expect(interpolated).toBe('I am 52')
  })
  it('should return the interpolated string when expression is followed by string', () => {
    const interpolated = new Interpolated('{age} years')({ age: 52 })
    expect(interpolated).toBe('52 years')
  })
  it('should return the interpolated string when there is more then 1 expression', () => {
    const interpolated = new Interpolated('{message}{age}')({ age: 52, message: 'I am ' })
    expect(interpolated).toBe('I am 52')
  })
  it('should return the interpolated string when there is more then 1 expression interleaved with strings', () => {
    const interpolated = new Interpolated('{pre} am {age} years {post}')({ pre: 'I', age: 52, post: 'old' })
    expect(interpolated).toBe('I am 52 years old')
  })
  it('should support custom expressions', () => {
    const scope = {
      users: [
        { name: 'U0' },
        { name: 'U1' },
        { name: 'U2' }
      ],
      userIndex: 1
    }
    const compiled = new Interpolated('Welcome {get(users, userIndex, "name")}', {
      custom: {
        get: (src, ...path) => get(src, path)
      }
    })
    expect(compiled(scope)).toBe('Welcome U1')
  })
  it('should allow object path as identifier', () => {
    const interpolated = new Interpolated('{a.b}')(flat({ a: { b: 'ab' } }))
    expect(interpolated).toBe('ab')
  })
  it('should allow array path as identifier', () => {
    const interpolated = new Interpolated('{a.1.c}')(flat({ a: [{ b: 'ab' }, { c: 'ac' }, { d: 'ad' }] }))
    expect(interpolated).toBe('ac')
  })
  it('should access object key using of operator', () => {
    const interpolated = new Interpolated('{(first of name) + " " + (last of name)}')({ name: { first: 'Carla', last: 'Cornelis' } })
    expect(interpolated).toBe('Carla Cornelis')
  })
  it('should not throw when object key does not exist', () => {
    const interpolated1 = new Interpolated(
      'collection/{id of doc}',
      {
        tag: (strings, ...values) => tag(strings, ...values)
      }
    )({})
    expect(interpolated1).toBe('collection/')
    const interpolated2 = new Interpolated(
      'collection/{id of doc}',
      {
        tag: validate(value => [value !== undefined, undefined])
      }
    )({})
    expect(interpolated2).toBe(undefined)
    const interpolated3 = new Interpolated(
      'collection/{id of doc}',
      {
        tag: validate(value => [value !== undefined, undefined])
      }
    )({
      doc: {
        id: 'my-id'
      }
    })
    expect(interpolated3).toBe('collection/my-id')
  })
  it('should create array', () => {
    const interpolated = new Interpolated("{(first of name, last of name)}")({ name: { first: 'Carla', last: 'Cornelis' } })
    expect(interpolated).toEqual(['Carla', 'Cornelis'])
  })
  it('should create object', () => {
    const interpolated = new Interpolated(
      '{object( ("a", "A"), ("b", "B") )}',
      {
        custom: {
          object: function (...args) {
            return args.reduce((obj, [key, value]) => { obj[key] = value; return obj }, {})
          }
        }
      }
    )()
    expect(interpolated).toEqual({ a: 'A', b: 'B' })
  })
  it('should use Interpolated.INTERPOLATE_REGEXP', () => {
    Interpolated.INTERPOLATE_REGEXP = /\$\{([^\}]+)\}/g
    const interpolated = new Interpolated('${age}')({ age: 52 })
    expect(interpolated).toBe(52)
  })
})