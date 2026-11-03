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
