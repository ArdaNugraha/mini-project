import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      applicant_id?: string
      email: string
      role: string
      token: string
    }
  }

  interface User {
    id: string
    applicant_id?: string
    email: string
    role: string
    token: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    applicant_id?: string
    email: string
    role: string
    token: string
    expires: number
  }
}
