import api from '@/utilities/api'
import axios from 'axios'
import { DataFromCollectionSlug } from 'payload'

type UpdateUser = {
  id: string | number
  body: Partial<DataFromCollectionSlug<'companyUsers'>>
}

class AuthService {
  private BASE_PATH = '/api/auth'

  public async login(body: { email: string; password: string }) {
    const res = await axios.post(`${this.BASE_PATH}/login`, body)

    return res.data
  }

  public async logout() {
    const res = await axios.post(`${this.BASE_PATH}/logout`, {})

    return res.data
  }

  public async getMe() {
    const res = await axios.get(`${this.BASE_PATH}/me`)

    return res.data
  }

  public async refreshToken() {
    const res = await axios.post(`${this.BASE_PATH}/refreshToken`, {})

    return res.data
  }

  public async complateRegistration(body: { email: string; password: string }) {
    const res = await axios.post(`${this.BASE_PATH}/complate-registration`, body)

    return res.data
  }

  public async adminResetPassword(body: { token: string; password: string }) {
    const res = await axios.post(`/api/adminUsers/reset-password`, body)

    return res.data
  }

  public async resetPasswordEmail(body: { email: string }) {
    try {
      const res = await axios.post(`${this.BASE_PATH}/reset-password-email`, body)
      return res.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { error: { message: 'User not found' } }
      }
      throw error
    }
  }

  public async resetPassword(body: { password: string; token: string }) {
    const res = await axios.post(`${this.BASE_PATH}/reset-password`, body)

    return res.data
  }

  public async selectCompany(body: { email: string; userId: string }) {
    const res = await axios.post(`${this.BASE_PATH}/select-company`, body)

    return res.data
  }

  public async updateUser({
    body,
    id,
  }: UpdateUser): Promise<DataFromCollectionSlug<'companyUsers'>> {
    const url = `/update-user/${id}`

    const response = await api.patch(url, body)

    return response.data
  }
}

const authService = new AuthService()

export default authService
