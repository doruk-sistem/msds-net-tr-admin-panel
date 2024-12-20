import { AuthProviderClientContext, UseAuth } from '@/providers/AuthProvider/AuthProviderClient'
import { use } from 'react'

const useAuth = (): UseAuth => use(AuthProviderClientContext) as any

export default useAuth
