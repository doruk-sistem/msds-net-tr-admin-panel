export default function generateRandomPassword() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 12 }, () =>
    charset.charAt(Math.floor(Math.random() * charset.length)),
  ).join('')
}
