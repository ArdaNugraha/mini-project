'use client'

import { SessionProvider } from 'next-auth/react'
import { SidebarProvider } from '@/components/ui/sidebar'
import MenuDashboard from '@/components/section/menu-dashboard'
import MotionContainer from '@/containers/motion.container'
import { Gauge, User } from 'lucide-react'
import React from 'react'

const menuItems = [
  {
    title: 'Dashboard',
    url: '/applicant',
    icon: Gauge,
  },
  {
    title: 'Profile',
    url: '/applicant/profile',
    icon: User,
  },
]

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotionContainer>
      <SessionProvider>
        <SidebarProvider>
          <MenuDashboard items={menuItems}>{children}</MenuDashboard>
        </SidebarProvider>
      </SessionProvider>
    </MotionContainer>
  )
}
