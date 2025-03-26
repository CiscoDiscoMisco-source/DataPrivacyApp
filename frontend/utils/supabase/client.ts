import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return document.cookie
            .split("; ")
            .find((c) => c.startsWith(`${name}=`))
            ?.split("=")[1];
        },
        set(name, value, options) {
          let cookie = `${name}=${value}`;
          if (options.maxAge) {
            cookie += `; Max-Age=${options.maxAge}`;
          }
          if (options.domain) {
            cookie += `; Domain=${options.domain}`;
          }
          if (options.path) {
            cookie += `; Path=${options.path}`;
          }
          if (options.expires) {
            cookie += `; Expires=${options.expires.toUTCString()}`;
          }
          if (options.sameSite) {
            cookie += `; SameSite=${options.sameSite}`;
          }
          if (options.secure) {
            cookie += `; Secure`;
          }
          document.cookie = cookie;
        },
        remove(name, options) {
          this.set(name, "", { ...options, maxAge: -1 });
        },
      },
    }
  ); 