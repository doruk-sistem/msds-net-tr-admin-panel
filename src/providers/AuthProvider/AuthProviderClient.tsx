'use client'

import { Company } from '@/payload-types'
import { Session } from 'next-auth'
import {
  getSession,
  type SessionContextValue,
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from 'next-auth/react'
import { PaginatedDocs } from 'payload'
import React, { createContext, useEffect, useMemo } from 'react'

export type UseAuth = {
  session: SessionContextValue['data']
  updateAuth: SessionContextValue['update']
  status: SessionContextValue['status']
  user?: Session['user']
  userCompany: PaginatedDocs<Company>['docs'][0] | null
}

export const AuthProviderClientContext = createContext<null | UseAuth>(null)

interface ServerSideData {
  serverSideData: {
    userCompany: PaginatedDocs<Company>['docs'][0] | null
  }
}

export default function AuthProviderClient({
  children,
  session,
  ...rest
}: { children: React.ReactNode; session: Session | null } & ServerSideData) {
  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      <AuthInit {...rest}>{children}</AuthInit>
    </SessionProvider>
  )
}

function AuthInit({ children, serverSideData }: { children: React.ReactNode } & ServerSideData) {
  const sessionData = useSession()
  const { data: session, status, update } = sessionData

  const user = session?.user
  const { userCompany } = serverSideData

  const value = useMemo(
    () => ({
      user,
      userCompany,
      session,
      status,
      updateAuth: update,
    }),
    [session, status, update, user, userCompany],
  )

  useEffect(() => {
    if (session?.error === 'RefreshTokenExpired') {
      alert('Your session is expired. Please sign in again.')
      signOut()
    }
    if (session?.error === 'RefreshTokenError') {
      alert('Your session could not be verified.')
      signOut()
    }
  }, [session?.error])

  return (
    <AuthProviderClientContext.Provider value={value}>
      {children}
    </AuthProviderClientContext.Provider>
  )
}
