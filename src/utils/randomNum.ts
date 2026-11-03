export default function randomNum(selectionLength: number): number {
  if (
    !Number.isSafeInteger(selectionLength) ||
    selectionLength <= 0 ||
    selectionLength > 0x100000000
  ) {
    throw new RangeError(
      'Length must be a positive integer no greater than 2^32.',
    )
  }

  const randomValues = new Uint32Array(1)
  const range = 0x100000000
  const limit = range - (range % selectionLength)

  let randomValue: number

  do {
    crypto.getRandomValues(randomValues)
    randomValue = randomValues[0]
  } while (randomValue >= limit)

  return randomValue % selectionLength
}
