/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { usersTable, applicantsTable } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { UserType } from '@/types/common'
import { RequestInternal } from 'next-auth'

const MAX_AGE = 60 * 60 * 24

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: MAX_AGE,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<UserType & { token: string }> {
        const user = (await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials?.email || ''))
          .limit(1)
          .then((res) => res[0])) as UserType

        if (!user) {
          throw new Error('User not registered')
        }

        if (user.role === 'applicant') {
          const [applicant] = await db
            .select()
            .from(applicantsTable)
            .where(eq(applicantsTable.user_id, user.id))
          user.applicant_id = applicant.id
        }

        const isValidPassword = await bcrypt.compare(
          credentials?.password || '',
          user.password,
        )

        if (!isValidPassword) {
          throw new Error('User not valid')
        }

        const token = jwt.sign(
          {
            id: user.id,
            applicant_id: user.applicant_id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET!,
          { expiresIn: '1d' },
        )

        return { ...user, token }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.applicant_id = user.applicant_id
        token.role = user.role
        token.email = user.email
        token.token = user.token
        token.expires = Math.floor(Date.now() / 1000) + MAX_AGE
      }

      if (token.expires && Date.now() / 1000 > Number(token.expires || 0)) {
        return {}
      }

      return token
    },
    async session({ session, token }: any) {
      if (!token.id) {
        return null
      }

      if (session.user) {
        session.user.id = token.id
        session.user.applicant_id = token.applicant_id
        session.user.role = token.role
        session.user.token = token.token
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
