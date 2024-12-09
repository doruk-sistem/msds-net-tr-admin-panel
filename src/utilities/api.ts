import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      const session = await getSession()

      originalRequest.headers.Authorization = session?.auth?.accessToken

      return api(originalRequest)
    }

    return Promise.reject(error)
  },
)

export default api
