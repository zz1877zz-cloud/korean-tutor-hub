import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/server"
import Avatar from "@/components/Avatar"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const ko = locale === "ko"
  const supabase = await createClient()

  const { data: tutors } = await supabase
    .from("tutors")
    .select("id, bio, avatar_url, display_name, tagline, hourly_rate, rating")
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .limit(6)

  return (
    <div className="relative">
      <div className="hero-stage pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/hero-lyrics-wide.jpg"
          alt=""
          className="hidden md:block absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <img
          src="/hero-lyrics-mobile.jpg"
          alt=""
          className="md:hidden absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <img
          src="/hero-ojakgyo-wide.jpg"
          alt=""
          className="hidden md:block absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <img
          src="/hero-ojakgyo-mobile.jpg"
          alt=""
          className="md:hidden absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/10 via-[#0a0a0f]/40 to-[#0a0a0f]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm text-fuchsia-400 mb-4">
            {ko ? "K-pop에서 한국까지" : "From K-pop to Korea"}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {ko ? "좋아하는 가사를" : "Feel the lyrics"}
            <br />
            <span className="hero-accent bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              {ko ? "진심으로 느껴보세요" : "like you mean them"}
            </span>
          </h1>
          <p className="text-zinc-400 mb-8">
            {ko
              ? "튜터와 먼저 오작교에서 대화해 보세요. 함께하고 싶다면 수업을, 한국을 같이 경험해요."
              : "Talk on Ojakgyo first. If you want to keep going, take the class — and see Korea together."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/tutors" className="cta-btn">
              {ko ? "튜터 보러 가기" : "Meet tutors"}
            </Link>
            <Link href="/apply-tutor" className="cta-btn">
              {ko ? "튜터로 합류" : "Become a tutor"}
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-5">
            <p className="text-fuchsia-300 text-xs mb-2">{ko ? "훅" : "Hook"}</p>
            <h2 className="text-white font-semibold mb-2">
              {ko ? "좋아하는 가사를" : "The lyrics you love"}
            </h2>
            <p className="text-sm text-zinc-400">
              {ko
                ? "해석만 하고 끝내지 않아요. 좋아하는 가사를 진심으로 말해 봅니다."
                : "Don’t stop at the translation. Say the lyrics like they belong to you."}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-5">
            <p className="text-fuchsia-300 text-xs mb-2">{ko ? "오작교" : "Ojakgyo"}</p>
            <h2 className="text-white font-semibold mb-2">
              {ko ? "우리 제법 잘 어울려요 😊" : "We kind of click 😊"}
            </h2>
            <p className="text-sm text-zinc-400">
              {ko
                ? "어색하면 수업까지 안 가도 돼요. 먼저 말하고, 끌리면 그다음이에요."
                : "If it’s awkward, you don’t have to book. Talk first. Continue only if it feels right."}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-5">
            <p className="text-fuchsia-300 text-xs mb-2">
              {ko ? "한 걸음 다가가요! 🌏🇰🇷" : "One step closer 🌏🇰🇷"}
            </p>
            <h2 className="text-white font-semibold mb-2">
              {ko ? "같이 달려가요 🏃" : "Let’s run it 🏃"}
            </h2>
            <p className="text-sm text-zinc-400">
              {ko
                ? "회화에서 멈추지 말아요. 한국 연수/어학당까지 이어질 수 있는 실력과 환경을 목표로 같이 달려가요!"
                : "Don’t stop at weekend chat. Train for the Korean you can use at an institute — or in Korea."}
            </p>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {ko ? "금주의 인기 튜터" : "Popular tutors this week"}
            </h2>
            <Link href="/tutors" className="text-sm text-violet-300">
              {ko ? "더 보기 →" : "More →"}
            </Link>
          </div>

          {!tutors?.length && (
            <p className="text-sm text-zinc-500 rounded-2xl border border-white/10 bg-black/30 p-6">
              {ko
                ? "첫 라인업을 올리고 있습니다. 가르칠 수 있다면 얼굴과 소개를 보내 주세요."
                : "The first lineup is coming. If you teach, send a face and a short bio."}
            </p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tutors?.map((tutor) => (
              <Link
                key={tutor.id}
                href={`/tutors/${tutor.id}`}
                className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 hover:border-fuchsia-500/30 transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src={tutor.avatar_url} bio={tutor.bio} size="md" />
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {tutor.display_name || (ko ? "튜터" : "Tutor")}
                    </p>
                    <p className="text-amber-400 text-xs">★ {tutor.rating ?? 0}</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {tutor.tagline || tutor.bio}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}