import { NextResponse } from "next/server"
import { sendAdminMail } from "@/lib/notify"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  let body: { type?: unknown; preview?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "요청을 읽지 못했어요." }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 })
  }

  const preview = String(body.preview ?? "").trim().slice(0, 500)
  const subject =
    body.type === "booking" ? "[KTH] 새 예약 요청" : "[KTH] 새 오작교 요청"

  const result = await sendAdminMail(subject, preview || "새 요청이 있어요.")

  return NextResponse.json({
    skipped: Boolean(result.skipped),
    status: "status" in result ? result.status : null,
  })
}