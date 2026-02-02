
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const {auth} = NextAuth(authConfig);

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from '@/routes';

//must import a middleware 

const middleware =  auth((req)=>{
   const {nextUrl} = req;
   const isLoggedIn = !!req.auth;

   const isItApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

   const isItPublicRoute = publicRoutes.includes(nextUrl.pathname);

   const isItAuthRoute = authRoutes.includes(nextUrl.pathname);

   if(isItApiAuthRoute) return null;

   if(isItAuthRoute){
    if(isLoggedIn){
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
   }

   if(!isLoggedIn && !isItPublicRoute){
    let callbackUrl = nextUrl.pathname;
    if(nextUrl.search){
        callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
        return Response.redirect(new URL(`/auth/login?callbackUrl${encodedCallbackUrl}`, nextUrl))
   }

   return null;

});
export default middleware;






// all routes that runs this middleware
export const config = {
    matcher: [ '/((?!$|login|register|about|contact|api/public|_next/static|_next/image|favicon.ico).*)',]
}