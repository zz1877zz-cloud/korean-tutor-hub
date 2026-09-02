import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { text } = await req.json()
  const source = String(text ?? "").trim()

  if (!source) {
    return NextResponse.json({ error: "empty" }, { status: 400 })
  }

  const hasHangul = /[가-힣]/.test(source)
  const langpair = hasHangul ? "ko|en" : "en|ko"

  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(source.slice(0, 500)) +
    "&langpair=" +
    langpair

  const res = await fetch(url)
  const data = await res.json()
  const translated = data?.responseData?.translatedText

  if (!translated) {
    return NextResponse.json({ error: "fail" }, { status: 502 })
  }

  return NextResponse.json({
    translated,
    to: hasHangul ? "en" : "ko",
  })
}