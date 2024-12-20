import axios from 'axios'

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
}

const authService = new AuthService()

export default authService
