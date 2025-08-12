'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
  isActive?: boolean
}

const pathToLabel: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/trades': 'Trade Log',
  '/dashboard/calendar': 'Trade Calendar',
  '/dashboard/funds': 'Funds',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/ai-insights': 'AI Insights',
  '/dashboard/profile': 'Profile',
  '/dashboard/settings': 'Settings',
  '/dashboard/help': 'Help & FAQ',
  '/dashboard/feedback': 'Feedback',
}

export function Breadcrumb() {
  const pathname = usePathname()
  
  // Generate breadcrumb items
  const items: BreadcrumbItem[] = []
  
  // Always start with Dashboard Home
  items.push({
    label: 'Dashboard',
    href: '/dashboard',
    isActive: pathname === '/dashboard'
  })
  
  // Add current page if it's not the dashboard home
  if (pathname !== '/dashboard') {
    const currentLabel = pathToLabel[pathname] || 'Page'
    items.push({
      label: currentLabel,
      href: pathname,
      isActive: true
    })
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground px-6 py-3 border-b border-border bg-muted/30">
      <Home className="h-4 w-4" />
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.isActive ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
