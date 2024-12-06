import qs from 'qs'

const stringifiedQuery = (query: { [key: string]: any }) =>
  qs.stringify(query, { addQueryPrefix: true })

export default stringifiedQuery
