import { AuthProviderClientContext, UseAuth } from '@/providers/AuthProvider/AuthProviderClient'
import { useContext } from 'react'

const useAuth = (): UseAuth => useContext(AuthProviderClientContext) as any

export default useAuth
