'use client'

import { Company } from '@/payload-types'
import { Session } from 'next-auth'
import { type SessionContextValue, SessionProvider, useSession } from 'next-auth/react'
import { PaginatedDocs } from 'payload'
import React, { createContext, useMemo } from 'react'

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
  ...rest
}: { children: React.ReactNode } & ServerSideData) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
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

  return (
    <AuthProviderClientContext.Provider value={value}>
      {children}
    </AuthProviderClientContext.Provider>
  )
}
