'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { PaginatedDocs } from 'payload'
import React, { createContext, useState } from 'react'

import { Company } from '@/payload-types'
import authHelper from '@/utilities/authHelper'
import getMe from '@/utilities/getMe'

interface ServerSideData {
  serverSideData: {
    userCompany: PaginatedDocs<Company>['docs'][0] | null
    user: Awaited<ReturnType<typeof getMe>> | null | undefined
    tokens: Awaited<ReturnType<typeof authHelper.getTokens>> | null | undefined
  }
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type UseAuth = {
  user?: ServerSideData['serverSideData']['user']
  userCompany: ServerSideData['serverSideData']['userCompany']
  tokens?: ServerSideData['serverSideData']['tokens']
  setUser: SetState<UseAuth['user']>
  setUserCompany: SetState<UseAuth['userCompany']>
  setTokens: SetState<UseAuth['tokens']>
}

export const AuthProviderClientContext = createContext<null | UseAuth>(null)

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

export function AuthInit({
  children,
  serverSideData,
}: { children: React.ReactNode } & ServerSideData) {
  const [user, setUser] = useState(serverSideData.user)
  const [userCompany, setUserCompany] = useState(serverSideData.userCompany)
  const [tokens, setTokens] = useState(serverSideData.tokens)

  return (
    <AuthProviderClientContext
      value={{ user, userCompany, tokens, setUser, setUserCompany, setTokens }}
    >
      {children}
    </AuthProviderClientContext>
  )
}
