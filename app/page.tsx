
"use client"

import { createClient } from "@/lib/supabase-browser"

export default function Login() {
  const supabase = createClient()

  // const siteUrl =
  //   process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" || "https://bookmark-ten-pi.vercel.app/"

   const redirectTo = "https://bookmark-ten-pi.vercel.app/auth/callback"

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Smart Bookmark
        </h1>

        <p className="text-gray-500 mb-8">
          Save and manage your bookmarks securely.
        </p>

        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
        >
          {/* Google Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20"
            height="20"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.5 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.3-.1-2.7-.4-3.5z"
            />
          </svg>
          Sign in with Google
        </button>

      </div>
    </div>
  )
}
