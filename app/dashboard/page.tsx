

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const supabase = await createClient()  // ✅ MUST await

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  return <DashboardClient user={user} />
}
