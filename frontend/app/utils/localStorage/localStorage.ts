export const getImageFromLocalStorage = (
  key: string,
  fallback: () => void
): string => {
  const image = localStorage.getItem(key)

  if (!image) {
    fallback()
    return ''
  }

  return image
}
