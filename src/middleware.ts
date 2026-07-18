import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, Next internals, metadata routes
  // (favicon/icon/apple-icon/manifest/robots/sitemap), and files with an
  // extension. These must NOT be locale-prefixed or the browser can't load
  // the generated favicon.
  matcher: [
    "/((?!api|_next|_vercel|icon|apple-icon|favicon.ico|manifest|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
