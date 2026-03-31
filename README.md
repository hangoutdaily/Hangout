It’s okay to embarrass yourself a little in the pursuit of human connection.

**Perf Improvements TODO**

1. Move auth from localStorage → HttpOnly cookies (so SSR can actually work for logged-in users)
2. Prefetch main data (like events) on server using React Query hydration (remove initial loading screens) maybe use `HydrationBoundary`
3. Use fetch for server-side calls (keep Axios only for client stuff like actions)
4. Replace <img> with next/image for better performance
5. Lazy load Google Maps (next/dynamic, no SSR) to avoid heavy JS on initial load
