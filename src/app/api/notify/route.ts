import { NextResponse } from "next/server"
import { sendAdminMail } from "@/lib/notify"

export async function POST(req: Request) {
  const { type, preview } = await req.json()

  const subject =
    type === "booking" ? "[KTH] 새 예약 요청" : "[KTH] 새 오작교 요청"

  const result = await sendAdminMail(
    subject,
    String(preview || "새 요청이 있습니다.")
  )

  return NextResponse.json(result)
}