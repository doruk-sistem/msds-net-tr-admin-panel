const formatDate = (
  date: string,
  locale?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
) => {
  if (!date || typeof date !== 'string') {
    return ''
  }

  return new Date(date).toLocaleDateString(locale, options)
}

export default formatDate
