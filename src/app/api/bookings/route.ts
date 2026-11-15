import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendAdminMail } from "@/lib/notify"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tutor_id, note, scheduled_at } = body

    const tutorId = typeof tutor_id === "string" ? tutor_id : ""
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tutorId)) {
      return NextResponse.json(
        { error: "튜터 정보가 없어요." },
        { status: 400 }
      )
    }
    const safeNote =
      typeof note === "string" && note.trim() ? note.trim().slice(0, 2000) : null

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요해요." },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        tutor_id: tutorId,
        student_id: user.id,
        note: safeNote,
        scheduled_at: scheduled_at || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json(
        { error: "예약을 저장하지 못했어요." },
        { status: 500 }
      )
    }

    await sendAdminMail(
      "[KTH] 새 예약 요청",
      (safeNote || "예약 요청") +
        "\n\nhttps://korean-tutor-hub.vercel.app/ko/tutor/bookings"
    )

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "서버 오류가 났어요." },
      { status: 500 }
    )
  }
}