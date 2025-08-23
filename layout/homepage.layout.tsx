'use client'

import { SessionProvider } from 'next-auth/react'
import NavbarMenu from '@/components/section/navbar-menu'
import MotionContainer from '@/containers/motion.container'

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotionContainer>
      <SessionProvider>
        <div className="flex flex-col min-h-screen">
          <NavbarMenu />
          <main className="p-4">{children}</main>
        </div>
      </SessionProvider>
    </MotionContainer>
  )
}
