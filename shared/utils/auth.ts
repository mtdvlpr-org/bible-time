export const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]!))
  } catch (error) {
    console.error('Invalid JWT token', error)
    return null
  }
}
