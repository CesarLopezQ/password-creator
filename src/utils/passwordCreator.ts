import randomNum from './randomNum'

export interface PasswordParams {
  length: number
  numbers: boolean
  symbols: boolean
  upper: boolean
  lower: boolean
}

const characterSets = {
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>/?~',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
}

const maxLength = 100

export default function passwordCreator({
  length,
  numbers,
  symbols,
  upper,
  lower,
}: PasswordParams): string {
  //Password length validation
  if (!Number.isSafeInteger(length) || length < 1 || length > maxLength) {
    throw new RangeError(
      `Password length must be an integer between 1 and ${maxLength}.`,
    )
  }

  //Characters to use
  const selectedGroups: string[] = []

  //Character selection
  if (numbers) selectedGroups.push(characterSets.numbers)
  if (symbols) selectedGroups.push(characterSets.symbols)
  if (upper) selectedGroups.push(characterSets.upper)
  if (lower) selectedGroups.push(characterSets.lower)

  //Character validation
  if (selectedGroups.length === 0) {
    throw new RangeError('At least one character category must be selected.')
  }
  if (length < selectedGroups.length) {
    throw new RangeError(
      'Password length must be at least the number of selected categories.',
    )
  }

  //Select a random character of each selected group
  const password = selectedGroups.map((group) => group[randomNum(group.length)])

  //Combine groups
  const selectedCharacters = selectedGroups.join('')

  //Fill in remaining password slots
  while (password.length < length) {
    password.push(selectedCharacters[randomNum(selectedCharacters.length)])
  }

  //Shuffle characters
  for (let i = password.length - 1; i > 0; i--) {
    const x = randomNum(i + 1)
    ;[password[i], password[x]] = [password[x], password[i]]
  }

  return password.join('')
}
