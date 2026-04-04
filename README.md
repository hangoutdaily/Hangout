**It’s okay to embarrass yourself a little in the pursuit of human connection.**

### **High-Level Overview**

- User registration (email/phone + password, or Google Sign-In)
- Profile onboarding (multi-step with personality traits, interests, lifestyle choices, photos)
- Event/Hangout creation with categories, location (Google Maps), date/time, capacity
- Join-request workflow — users request to join; hosts approve or reject
- Real-time group chat tied to each hangout (via [Socket.IO](http://socket.io/))
- Wishlist — users can like/save events
- Image uploads to AWS S3 via presigned URLs

<img width="973" height="186" alt="image" src="https://github.com/user-attachments/assets/a5815dbd-1899-47f1-8f93-31371d29267b" />

<img width="969" height="540" alt="image" src="https://github.com/user-attachments/assets/f05ce26e-4919-4b53-80dc-201c5d754b9e" />

### **State Management**

**No external state library** — state is managed via:

1. **React Context** — **AuthContext** (user auth), **ThemeContext** (theme preference)
2. **Component-level `useState`** — each page fetches its own data in `useEffect`
3. **localStorage** — `accessToken`, `refreshToken`, `theme`

### **Upload Flow**

1. Frontend requests a **presigned S3 URL**: `POST /upload/presigned-url` with `{ fileName, fileType }`
2. **upload controller** validates with Zod (only `image/*` allowed)
3. **s3.ts getPresignedPutUrl()** generates:
    - Key: `profiles/{timestamp}_{fileName}`
    - Presigned upload URL (1-hour TTL)
    - Public view URL: `https://{bucket}.s3.{region}.amazonaws.com/{key}`
4. Frontend uploads directly to S3 using the presigned URL
5. The `viewUrl` is stored in the user's profile or event `photos` array

### **Storage**

- **AWS S3** — bucket name and region from env vars
- All files stored under `profiles/` prefix

### **Cache**

- I used React Query to manage server state like events, categories, and likes.
- I structured queries with meaningful keys like ['events', filters] so different filtered results are cached independently.
- I configured staleTime to reduce unnecessary API calls and used mutations with query invalidation to keep data consistent after actions like liking an event.
- This allowed me to avoid manual state management and ensured better performance and UX.”

### **Perf Improvements TODO**

1. Move auth from localStorage → HttpOnly cookies (so SSR can actually work for logged-in users)
2. Prefetch main data (like events) on server using React Query hydration (remove initial loading screens) maybe use `HydrationBoundary`
3. Use fetch for server-side calls (keep Axios only for client stuff like actions)
4. Replace <img> with next/image for better performance
5. Lazy load Google Maps (next/dynamic, no SSR) to avoid heavy JS on initial load
