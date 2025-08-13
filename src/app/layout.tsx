import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as HotToaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trading Journal',
  description: 'Track and analyze your trading performance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
        <HotToaster 
          position="top-right"
          gutter={12}
          containerStyle={{
            top: 20,
            right: 20,
          }}
          toastOptions={{
            className: '',
            duration: 4000,
            style: {
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              zIndex: 9999,
              maxWidth: '350px',
            },
            success: {
              style: {
                background: '#059669',
                color: 'white',
                border: '1px solid #047857',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#059669',
              },
            },
            error: {
              style: {
                background: '#DC2626', 
                color: 'white',
                border: '1px solid #B91C1C',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#DC2626',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
