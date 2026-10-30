export default async function handleCopy(password: string) {
  if (!password) return

  try {
    await navigator.clipboard.writeText(password)
  } catch (e) {
    console.error('Could not copy password: ', e)
  }
}
