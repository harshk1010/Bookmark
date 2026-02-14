# Smart Bookmark

A bookmark manager built using **Next.js**, **Supabase**, and **Tailwind CSS**, deployed on **Vercel**.

---

## Live Demo

🔗 **Live URL:** https://bookmark-ten-pi.vercel.app/  
🔗 **GitHub Repo:** https://github.com/harshk1010/Bookmark

> You can log in using your own Google account to test functionality.

---

##  Tech Stack

- **Frontend:** Next.js (App Router)
- **Authentication:** Supabase Google OAuth
- **Database:** Supabase PostgreSQL
- **Realtime:** Supabase Realtime (Postgres Changes)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

##  Features Implemented

### Google OAuth Authentication
- Users can sign in using **Google only**
- No email/password authentication
- Secure session handling using Supabase

---

### Add Bookmark
- Logged-in users can add:
  - Bookmark Title
  - Bookmark URL
- Stored securely in Supabase database

---

### Private Bookmarks (Row Level Security)
- Each bookmark is associated with a `user_id`
- Supabase **Row Level Security (RLS)** ensures:
  - User A cannot see User B’s bookmarks
  - User B cannot delete User A’s bookmarks
- Privacy is enforced at the **database level**

---

### Real-Time Updates
- If two tabs are open:
  - Adding a bookmark in one tab updates the other instantly
- Implemented using Supabase Realtime (`postgres_changes`)

---

### Delete Bookmark
- Users can delete their own bookmarks
- Protected using RLS policies

---

### Production Deployment
- App deployed on Vercel
- Environment variables configured securely
- Supabase production URL configuration updated

---

## ⚠ Problems Faced & How I Solved Them

###  1. OAuth Redirect Loop in Production
**Problem:** After deploying, login redirected back to login page.

**Cause:** Session cookies were not properly handled in production.

**Solution:**
- Corrected `/auth/callback` route to properly exchange code and attach cookies to response.
- Ensured Supabase Site URL matched Vercel domain.
- Verified cookies using browser DevTools.

---

###  2. Middleware Breaking Session
**Problem:** Middleware was causing redirect even when session existed.

**Solution:**
- Simplified auth handling.
- Ensured correct cookie propagation in production.

---

###  3. Row Level Security Blocking Inserts
**Problem:** Data was not being inserted into database.

**Cause:** Incorrect RLS policy (`using` instead of `with check` for insert).

**Solution:**
```sql
create policy "Users can insert their bookmarks"
on bookmarks
for insert
with check (auth.uid() = user_id);

