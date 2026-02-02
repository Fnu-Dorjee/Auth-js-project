
/**
 * An array of routes that are accessible to all or public
 * These routes do not need authentication
 */

export const publicRoutes = [
    "/",
    "/auth/new-verification",
   

]

/**
 * An array of routes that are not public 
 * These need authentication
 */

export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/reset-password',
    '/auth/new-password'

]

/**
 * prefix for api authenticaton routes
 * Routes that stats with these prefix are used for 
 * API authentication purposes
 */
export const apiAuthPrefix = '/api/auth';

/**
 * Default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
