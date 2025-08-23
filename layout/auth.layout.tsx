'use client'

import { SessionProvider } from 'next-auth/react'
import MotionContainer from '@/containers/motion.container'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotionContainer>
      <SessionProvider>{children}</SessionProvider>
    </MotionContainer>
  )
}
