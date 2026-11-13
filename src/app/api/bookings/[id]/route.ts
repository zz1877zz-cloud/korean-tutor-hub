import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, cancel_reason } = body

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return NextResponse.json({ error: "상태를 바꿀 수 없어요." }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 })
    }

    const updateData: {
      status: string
      cancel_reason?: string | null
    } = { status }

    if (status === "cancelled") {
      updateData.cancel_reason = cancel_reason || null
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .eq("student_id", user.id)
      .select()
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: "상태를 바꾸지 못했어요." }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "서버 오류가 났어요." }, { status: 500 })
  }
}