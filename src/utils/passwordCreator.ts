import randomNum from './randomNum'

export interface PasswordParams {
  length: number
  numbers: boolean
  symbols: boolean
  upper: boolean
  lower: boolean
}

export default function passwordCreator({
  length,
  numbers,
  symbols,
  upper,
  lower,
}: PasswordParams) {
  //Character definition
  const numberValues = '0123456789'
  const symbolValues = '!@#$%^&*()-_=+[]{};:,.<>/?~'
  const upperValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerValues = 'abcdefghijklmnopqrstuvwxyz'

  //Characters to use
  const selectedCharacters: string[] = []

  //Character selection
  if (numbers) selectedCharacters.push(numberValues)
  if (symbols) selectedCharacters.push(symbolValues)
  if (upper) selectedCharacters.push(upperValues)
  if (lower) selectedCharacters.push(lowerValues)

  //Select a random character of each selected group
  const password = selectedCharacters.map(
    (group) => group[randomNum(group.length)],
  )

  //Combine groups
  const allCharacters = selectedCharacters.join('')

  //Fill in remaining password slots
  while (password.length < length) {
    password.push(allCharacters[randomNum(allCharacters.length)])
  }

  //Shuffle characters
  for (let i = password.length - 1; i > 0; i--) {
    const x = randomNum(i + 1)
    ;[password[i], password[x]] = [password[x], password[i]]
  }

  return password.join('')
}
