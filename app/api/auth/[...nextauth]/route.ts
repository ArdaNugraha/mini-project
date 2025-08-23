import NextAuth from 'next-auth'
import { authOptions } from './authOptions'

const auth = NextAuth(authOptions)

export { auth as GET, auth as POST }
