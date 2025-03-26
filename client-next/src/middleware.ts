import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// 1. Specify protected and public routes
// const protectedRoutes = ['/dashboard']
const publicRoutes = ['/sign-in', '/sign-up', '/'];

const sessionCookie = 'session';

export default function protectRoutes(req: NextRequest) {
    
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Decrypt the session from the cookie
    const session = req.cookies.get(sessionCookie)?.value || "";

    // 4. Redirect to /login if the user is not authenticated
    if (!isPublicRoute && !session) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
    }

    // 5. Redirect to /dashboard if the user is authenticated
    if (
        isPublicRoute 
        && session 
        // && !req.nextUrl.pathname.startsWith('/dashboard')
    ) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    console.log(session)

    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}