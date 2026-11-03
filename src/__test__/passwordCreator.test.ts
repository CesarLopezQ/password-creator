import { describe, expect, it } from 'vitest'
import passwordCreator from '../utils/passwordCreator'

const testParams = Array.from({ length: 16 }, (_, mask) => ({
  numbers: Boolean(mask & 1),
  symbols: Boolean(mask & 2),
  upper: Boolean(mask & 4),
  lower: Boolean(mask & 8),
})).filter((params) => Object.values(params).some(Boolean))

const characterGroups = {
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>/?~',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
}

const validationParams = {
  length: 10,
  numbers: true,
  symbols: true,
  upper: true,
  lower: true,
}

describe('passwordCreator', () => {
  for (const params of testParams) {
    it(`Respects parameters: ${JSON.stringify(params)}`, () => {
      const password = passwordCreator({ length: 20, ...params })

      const selectedCharacters = Object.entries(params)
        .filter(([, enabled]) => enabled)
        .map(([key]) => characterGroups[key as keyof typeof characterGroups])

      const allowedCharacters = selectedCharacters.join('')

      expect(password).toHaveLength(20)

      expect(
        [...password].every((char) => allowedCharacters.includes(char)),
      ).toBe(true)

      for (const group of selectedCharacters) {
        expect([...password].some((char) => group.includes(char))).toBe(true)
      }
    })
  }

  it('tests all 15 valid checkbox combinations', () => {
    expect(testParams).toHaveLength(15)
  })
})

describe('Password validation rejects', () => {
  it('password lengths under 0', () => {
    expect(() => {
      passwordCreator({ ...validationParams, length: -1 })
    }).toThrow(RangeError)
  })

  it('password lengths equal to 0', () => {
    expect(() => {
      passwordCreator({ ...validationParams, length: 0 })
    }).toThrow(RangeError)
  })

  it('password lengths over 100', () => {
    expect(() => {
      passwordCreator({ ...validationParams, length: 101 })
    }).toThrow(RangeError)
  })

  it.each([0, -1, 1.5, NaN, Infinity, -Infinity, 0x100000001])(
    'invalid selection length: %s',
    (length) => {
      expect(() => {
        passwordCreator({ ...validationParams, length: length })
      }).toThrow(RangeError)
    },
  )

  it('configurations without selected categories', () => {
    expect(() => {
      passwordCreator({
        ...validationParams,
        numbers: false,
        symbols: false,
        upper: false,
        lower: false,
      })
    }).toThrow(RangeError)
  })

  it('lengths smaller than selected categories', () => {
    expect(() => {
      passwordCreator({ ...validationParams, length: 3 })
    }).toThrow(RangeError)
  })

  it('unsafe integer lengths', () => {
    expect(() => {
      passwordCreator({
        ...validationParams,
        length: Number.MAX_SAFE_INTEGER + 1,
      })
    }).toThrow(RangeError)
  })
})

describe('Password validation accepts', () => {
  it('lengths equal to selected categories', () => {
    expect(passwordCreator({ ...validationParams, length: 4 })).toHaveLength(4)
  })
})
