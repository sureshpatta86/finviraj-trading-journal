import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // If no token and trying to access dashboard, redirect to signin
    if (pathname.startsWith('/dashboard') && !token) {
      const signInUrl = new URL('/auth/signin', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Allow the request to continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages without authentication
        const { pathname } = req.nextUrl
        
        // Public routes that don't require authentication
        const publicRoutes = ['/', '/about', '/feedback']
        
        if (publicRoutes.includes(pathname)) {
          return true
        }
        
        // Auth routes - allow access if not authenticated
        if (pathname.startsWith('/auth/')) {
          return true
        }
        
        // Dashboard routes require authentication
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        // For all other routes, require authentication
        return !!token
      }
    },
  }
)

export const config = {
  matcher: [
    // Protect all routes except auth pages and public assets
    '/((?!auth|api/auth|_next/static|_next/image|favicon.ico|sw.js).*)',
  ]
}
