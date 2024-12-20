import axios from 'axios'

import authService from '@/services/auth.service'

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
      const tokens = await authService.refreshToken()

      originalRequest.headers.Authorization = tokens?.accessToken

      return api(originalRequest)
    }

    return Promise.reject(error)
  },
)

export default api
