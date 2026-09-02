import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendAdminMail } from "@/lib/notify"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tutor_id, note, scheduled_at } = body

    if (!tutor_id) {
      return NextResponse.json(
        { error: "튜터 정보가 없습니다." },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        tutor_id,
        student_id: user.id,
        note: note || null,
        scheduled_at: scheduled_at || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json(
        { error: "예약 저장에 실패했습니다." },
        { status: 500 }
      )
    }

    await sendAdminMail(
      "[KTH] 새 예약 요청",
      (note || "예약 요청") +
        "\n\nhttps://korean-tutor-hub.vercel.app/ko/tutor/bookings"
    )

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}