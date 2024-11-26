import axios from 'axios'

export interface LoginResponse {
  exp: number
  message: string
  token: string
  user: {
    collection: string
    createdAt: string
    email: string
    fullname: string
    id: number
    loginAttempts: number
    personalPhoneNumber: string
    turkishIdentity: number
    updatedAt: string
    company: number
  }
}

export default async function login({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<LoginResponse> {
  const res = await axios.post(`api/companyUsers/login`, {
    email,
    password,
  })

  return res.data
}
