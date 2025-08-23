import { errorResponse } from '@/utils'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function verifyToken(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
  })

  if (!session) return errorResponse({ message: 'Unauthorized', status: 401 })
  return { session }
}
