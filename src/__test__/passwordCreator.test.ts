import { expect, it } from 'vitest'
import passwordCreator from '../utils/passwordCreator'

const testParams = Array.from({ length: 16 }, (_, mask) => ({
  numbers: Boolean(mask & 1),
  symbols: Boolean(mask & 2),
  upper: Boolean(mask & 4),
  lower: Boolean(mask & 8),
}))

for (const params of testParams) {
  it(`Respects parameters: ${JSON.stringify(params)}`, () => {
    const password = passwordCreator({ length: 20, ...params })

    const selectedParams = [
      params.numbers ? '0123456789' : '',
      params.symbols ? '!@#$%^&*()-_=+[]{};:,.<>/?~' : '',
      params.upper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
      params.lower ? 'abcdefghijklmnopqrstuvwxyz' : '',
    ].join('')

    expect([...password].every((char) => selectedParams.includes(char))).toBe(
      true,
    )

    if (selectedParams.length === 0) {
      expect(password).toBe('')
    } else {
      expect(password).toHaveLength(20)
    }
  })
}
