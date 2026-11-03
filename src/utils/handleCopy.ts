export default async function handleCopy(password: string): Promise<boolean> {
  if (!password) {
    return false
  }

  try {
    await navigator.clipboard.writeText(password)
    return true
  } catch (e) {
    console.error('Could not copy password: ', e)
    return false
  }
}
