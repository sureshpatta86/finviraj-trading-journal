'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  X,
  BarChart3,
  Calendar,
  Wallet,
  TrendingUp,
  Brain,
  User,
  Settings,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Home,
} from 'lucide-react'

interface DashboardSidebarProps {
  isOpen: boolean
  onCloseAction: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigationSections: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Overview',
        href: '/dashboard',
        icon: Home,
      },
    ],
  },
  {
    title: 'Trading',
    items: [
      {
        title: 'Trade Log',
        href: '/dashboard/trades',
        icon: BarChart3,
      },
      {
        title: 'Trade Calendar',
        href: '/dashboard/calendar',
        icon: Calendar,
      },
      {
        title: 'Fund Manager',
        href: '/dashboard/funds',
        icon: Wallet,
      },
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: TrendingUp,
      },
      {
        title: 'AI Insights',
        href: '/dashboard/ai-insights',
        icon: Brain,
        badge: 'New',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'User Profile',
        href: '/dashboard/profile',
        icon: User,
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        title: 'Help & FAQ',
        href: '/dashboard/help',
        icon: HelpCircle,
      },
      {
        title: 'Feedback',
        href: '/dashboard/feedback',
        icon: MessageSquare,
      },
    ],
  },
]

export function DashboardSidebar({ isOpen, onCloseAction }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard', 'Trading'])

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(s => s !== title)
        : [...prev, title]
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FT</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Journal
          </h2>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCloseAction}
          className="lg:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <span>{section.title}</span>
              {expandedSections.includes(section.title) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.includes(section.title) && (
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        // Close sidebar on mobile when navigating
                        if (window.innerWidth < 1024) {
                          onCloseAction()
                        }
                      }}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors group',
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      )}
                    >
                      <div className="flex items-center">
                        <Icon
                          className={cn(
                            'mr-3 h-5 w-5 transition-colors',
                            isActive
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                          )}
                        />
                        {item.title}
                      </div>
                      {item.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>© 2025 Finviraj Trading Journal</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onCloseAction}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  )
}
