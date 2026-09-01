import { setRequestLocale, getTranslations } from "next-intl/server"
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
  const t = await getTranslations("home")
  const ko = locale === "ko"
  const supabase = await createClient()

  const { data: tutors } = await supabase
    .from("tutors")
    .select("id, bio, avatar_url, display_name, tagline, hourly_rate, rating")
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .limit(6)

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm text-fuchsia-400 mb-4">{t("badge")}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {ko ? "가사로 시작해서" : "From lyrics"}
          <br />
          <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
            {ko ? "한국 교실까지" : "to a classroom in Korea"}
          </span>
        </h1>
        <p className="text-zinc-400 mb-8">
          {ko
            ? "검증된 튜터와 먼저 오작교로 이야기하세요. 맞으면 수업, 그다음 연수까지 이어 갑니다."
            : "Talk first on Ojakgyo. If it fits, book a lesson — then a path toward study in Korea."}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/tutors"
            className="rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 text-sm font-medium text-white"
          >
            {t("ctaTutors")}
          </Link>
          <Link
            href="/apply-tutor"
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-300 hover:text-white"
          >
            {ko ? "튜터로 지원" : "Teach with us"}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-fuchsia-300 text-xs mb-2">01</p>
          <h2 className="text-white font-semibold mb-2">
            {ko ? "오작교로 먼저" : "Talk first"}
          </h2>
          <p className="text-sm text-zinc-400">
            {ko
              ? "결제 전에 목표·시간·텐션이 맞는지 짧게 확인합니다."
              : "Check goals, time, and vibe before any payment."}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-fuchsia-300 text-xs mb-2">02</p>
          <h2 className="text-white font-semibold mb-2">
            {ko ? "사람이 검수" : "Humans approve"}
          </h2>
          <p className="text-sm text-zinc-400">
            {ko
              ? "누구나 바로 목록에 올라가지 않습니다. 승인된 튜터만 공개됩니다."
              : "Tutors are listed only after review. Not an open free-for-all."}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-fuchsia-300 text-xs mb-2">03</p>
          <h2 className="text-white font-semibold mb-2">
            {ko ? "수업 → 한국" : "Lesson → Korea"}
          </h2>
          <p className="text-sm text-zinc-400">
            {ko
              ? "회화가 쌓이면 어학당·연수로 연결하는 것이 목표입니다."
              : "The long game is a language institute or study stay in Korea."}
          </p>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {ko ? "지금 만날 수 있는 튜터" : "Tutors you can meet"}
          </h2>
          <Link href="/tutors" className="text-sm text-violet-300">
            {ko ? "전체 보기 →" : "See all →"}
          </Link>
        </div>

        {!tutors?.length && (
          <p className="text-sm text-zinc-500 rounded-2xl border border-white/10 bg-white/5 p-6">
            {ko
              ? "첫 공개 튜터를 모시고 있습니다. 가르칠 수 있다면 지원해 주세요."
              : "We are seating the first public tutors. Apply if you can teach."}
          </p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tutors?.map((tutor) => (
            <Link
              key={tutor.id}
              href={`/tutors/${tutor.id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-fuchsia-500/30 transition"
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
  )
}