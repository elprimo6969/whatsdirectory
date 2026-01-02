import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()

  const [pending, approved, rejected] = await Promise.all([
    supabase.from("channels").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    supabase.from("channels").select("*").eq("status", "approved").order("created_at", { ascending: false }),
    supabase.from("channels").select("*").eq("status", "rejected").order("created_at", { ascending: false }),
  ])

  return NextResponse.json({
    pending: pending.data || [],
    approved: approved.data || [],
    rejected: rejected.data || [],
  })
}

export async function POST(request: Request) {
  const supabase = createAdminClient()
  const { channelId, action } = await request.json()

  const status = action === "approve" ? "approved" : "rejected"

  const { error } = await supabase
    .from("channels")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", channelId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { channelId, rating, verified } = body

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (rating !== undefined) {
    updateData.rating = rating
  }

  if (verified !== undefined) {
    updateData.verified = verified
  }

  const { error } = await supabase.from("channels").update(updateData).eq("id", channelId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const supabase = createAdminClient()
  const { channelId } = await request.json()

  const { error } = await supabase.from("channels").delete().eq("id", channelId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
