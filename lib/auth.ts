// lib/auth.ts
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export interface UserSession {
  id: string
  email: string
  role: 'admin' | 'applicant'
}

export async function getCurrentUser(
  req: NextRequest,
): Promise<UserSession | null> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) return null

  return {
    id: token.id as string,
    email: token.email as string,
    role: token.role as 'admin' | 'applicant',
  }
}
