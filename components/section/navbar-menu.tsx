'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  BriefcaseBusiness,
  LogIn,
  ChevronDown,
  Gauge,
  LogOut,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'

export default function NavbarMenu() {
  const { data, status } = useSession()
  const dashboardUrl = data?.user.role === 'admin' ? '/dashboard' : '/applicant'

  return (
    <header className="bg-primary text-white sticky top-0">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          href="#"
          target="_top"
          className="flex font-semibold bg-white text-gray-700 p-2 rounded-xl"
        >
          <BriefcaseBusiness className="mr-2" />
          JOB SEEKER
        </Link>
        {status === 'loading' && <Skeleton className="h-4 w-[100px]" />}
        {status === 'unauthenticated' && (
          <Link href="/sign-in">
            <Button variant="secondary">
              SIGN IN <LogIn />
            </Button>
          </Link>
        )}
        {status === 'authenticated' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                My Profile <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel className="text-gray-400">
                Account
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>{data.user.email}</DropdownMenuItem>
                <Link href={dashboardUrl}>
                  <DropdownMenuItem>
                    Visit Dashboard
                    <DropdownMenuShortcut>
                      <Gauge />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    signOut({
                      callbackUrl: process.env.NEXT_PUBLIC_URL_DOMAIN,
                    })
                  }
                >
                  Sign out
                  <DropdownMenuShortcut>
                    <LogOut />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
