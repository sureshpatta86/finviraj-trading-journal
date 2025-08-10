import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // Protect all routes except auth pages and public assets
    '/((?!auth|api/auth|_next/static|_next/image|favicon.ico|sw.js).*)',
  ]
}
