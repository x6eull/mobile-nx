/**
 * A node module that automatically handles cookies
 * @returns {Object} fetch: a fetch function that automatically handles cookies, extractCookie: a function that extracts a cookie from the cookie pool
 */
declare function createFetchSession(): Promise<{
    fetch: (url: string, options?: RequestInit) => Promise<Response>;
    extractCookie: (origin: string, cookieName: string) => string;
    injectCookie: (origin: string, cookieName: string, cookie: string) => void;
}>;
export { createFetchSession };
