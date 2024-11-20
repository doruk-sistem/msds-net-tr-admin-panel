'use client'

import { Session } from 'next-auth'
import { type SessionContextValue, SessionProvider, useSession } from 'next-auth/react'
import React, { createContext, useMemo } from 'react'

export type UseAuth = {
  session: SessionContextValue['data']
  updateAuth: SessionContextValue['update']
  status: SessionContextValue['status']
  user?: Session['user']
}

export const AuthProviderClientContext = createContext<null | UseAuth>(null)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AuthInit>{children}</AuthInit>
    </SessionProvider>
  )
}

function AuthInit({ children }: { children: React.ReactNode }) {
  const sessionData = useSession()
  const { data: session, status, update } = sessionData

  const user = session?.user

  const value = useMemo(
    () => ({
      user,
      session,
      status,
      updateAuth: update,
    }),
    [session, status, update, user],
  )

  return (
    <AuthProviderClientContext.Provider value={value}>
      {children}
    </AuthProviderClientContext.Provider>
  )
}
