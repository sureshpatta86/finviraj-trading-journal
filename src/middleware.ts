import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
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
