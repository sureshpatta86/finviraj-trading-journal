'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { TrendingUp, User, LogOut } from 'lucide-react'

export function DashboardNav() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6" />
          <span className="font-bold text-xl">Trading Journal</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {session ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{session.user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn('google')}>
              Sign In with Google
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
