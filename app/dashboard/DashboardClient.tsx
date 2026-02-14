

"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase-browser"
import type { User } from "@supabase/supabase-js"

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

type DashboardClientProps = {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const supabase = useMemo(() => createClient(), [])

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

useEffect(() => {
  const loadBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Fetch error:", error.message)
      return
    }

    setBookmarks(data || [])
  }

  loadBookmarks()
}, [supabase]) // keep only supabase


  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) return

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("URL must start with http:// or https://")
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id,
      })
      .select()

    if (error) {
      console.error("Insert error FULL:", error)
      alert("Insert failed. Check console.")
      setLoading(false)
      return
    }

    console.log("Inserted row:", data)

    // Only update UI if DB insert succeeded
    if (data) {
      setBookmarks((prev) => [...data, ...prev])
    }

    setTitle("")
    setUrl("")
    setLoading(false)
  }

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Delete error:", error.message)
      return
    }

    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Bookmarks
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 shadow"
        >
          Logout
        </button>
      </div>

      {/* Add Bookmark Section */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-inner mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Add New Bookmark
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
             className="border border-gray-300 bg-white text-black placeholder-gray-400 
             focus:ring-2 focus:ring-black focus:outline-none 
             p-3 flex-1 rounded-lg"
             placeholder="Enter Title"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
          />

<input
  className="border border-gray-300 bg-white text-black placeholder-gray-400 
             focus:ring-2 focus:ring-black focus:outline-none 
             p-3 flex-1 rounded-lg"
  placeholder="Enter URL"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
/>


          <button
            onClick={addBookmark}
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-md disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* Bookmark List */}
      {bookmarks.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p className="text-lg">No bookmarks yet 📌</p>
          <p className="text-sm">Add your first bookmark above.</p>
        </div>
      ) : (
       <ul className="space-y-4">
  {bookmarks.map((b) => (
    <li
      key={b.id}
      className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200"
    >
      <div className="flex flex-col">
        {/* Title */}
        <span className="text-lg font-semibold text-gray-800">
          {b.title}
        </span>

        {/* URL */}
        <a
          href={b.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm break-all"
        >
          {b.url}
        </a>
      </div>

      <button
        onClick={() => deleteBookmark(b.id)}
        className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg transition duration-200"
      >
        Delete
      </button>
    </li>
  ))}
</ul>

      )}
    </div>
  </div>
)
}