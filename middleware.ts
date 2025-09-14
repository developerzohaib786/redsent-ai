import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        
        // If user is trying to access dashboard routes without being authenticated
        if (pathname.startsWith('/dashboard') && !req.nextauth.token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ req, token }) {
                const { pathname } = req.nextUrl;
                
                // Allow access to auth APIs and public pages
                if(
                    pathname.startsWith('/api/auth') ||
                    pathname === '/login' ||
                    pathname === '/signup' ||
                    pathname === '/' ||
                    pathname === '/products' ||
                    pathname.startsWith('/products/') ||
                    pathname.startsWith('/public')
                ){
                    return true;
                }
                
                // Restrict dashboard routes to authenticated users only
                if (pathname.startsWith('/dashboard')) {
                    return !!token; // Only allow if token exists
                }
                
                // For other protected routes, require authentication
                if (token) return true;
                
                // Redirect to login for unauthenticated users
                return false;
            }
        }
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};