import authHelper from '@/utilities/authHelper'
import { NextResponse } from 'next/server'

export async function POST() {
  const response = new NextResponse(null, { status: 200 })
  authHelper.clearSessionFromResponse(response)

  return response
}
