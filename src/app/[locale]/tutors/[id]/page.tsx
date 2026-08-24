import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import BookingButton from "@/components/BookingButton"
import ConsultationRequestButton from "@/components/ConsultationRequestButton"
import Avatar from "@/components/Avatar"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { specialtyLabel } from "@/lib/specialties"

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const t = await getTranslations("detail")
  const supabase = await createClient()

  const { data: tutor, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !tutor) {
    notFound()
  }

  const { data: posts } = await supabase
    .from("tutor_posts")
    .select("id, type, body, pinned, created_at")
    .eq("tutor_id", tutor.id)
    .eq("is_published", true)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })

  const notices = (posts ?? []).filter((p) => p.type === "notice")
  const regular = (posts ?? []).filter((p) => p.type !== "notice")

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href={`/${locale}/tutors`}
        className="text-zinc-400 hover:text-white transition mb-6 inline-block text-sm"
      >
        ← {t("back")}
      </Link>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
        <div className="flex items-center gap-5 mb-6">
          <Avatar src={tutor.avatar_url} bio={tutor.bio} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white truncate">
                {tutor.display_name ||
                  (locale === "ko" ? "튜터" : "Tutor")}
              </h1>
              <div className="text-amber-400 text-xl font-medium shrink-0">
                ★ {tutor.rating}
              </div>
            </div>

            {tutor.tagline && (
              <p className="text-fuchsia-300 text-sm mb-3">{tutor.tagline}</p>
            )}

            <div className="text-2xl font-bold text-fuchsia-400">
              {tutor.hourly_rate?.toLocaleString()}
              {locale === "ko" ? "원" : " KRW"}
              <span className="text-base font-normal text-zinc-500">
                {locale === "ko" ? "/시간" : "/hour"}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white mb-3">{t("about")}</h2>
        <p className="text-zinc-300 leading-relaxed mb-8 whitespace-pre-line">
          {tutor.bio}
        </p>

        <div className="mb-6">
          <h2 className="font-semibold text-white mb-2">{t("specialties")}</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.specialties?.map((item: string) => (
              <span
                key={item}
                className="bg-fuchsia-500/15 text-fuchsia-300 px-3 py-1 rounded-full text-sm"
              >
                {specialtyLabel(item, locale)}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-white mb-2">{t("languages")}</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.languages?.map((item: string) => (
              <span
                key={item}
                className="bg-white/10 text-zinc-300 px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ConsultationRequestButton tutorId={tutor.id} />
          <BookingButton tutorId={tutor.id} />
        </div>
      </div>

      {/* 채널 타임라인 */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">{t("timeline")}</h2>

        {!posts?.length && (
          <p className="text-sm text-zinc-500">{t("timelineEmpty")}</p>
        )}

        <div className="space-y-3">
          {notices.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-amber-300">{t("noticeBadge")}</span>
                {post.pinned && (
                  <span className="text-xs text-zinc-500">{t("pinned")}</span>
                )}
              </div>
              <p className="text-sm text-zinc-200 whitespace-pre-line">
                {post.body}
              </p>
              <p className="text-xs text-zinc-600 mt-2">
                {new Date(post.created_at).toLocaleString(
                  locale === "ko" ? "ko-KR" : "en-US"
                )}
              </p>
            </div>
          ))}

          {regular.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm text-zinc-200 whitespace-pre-line">
                {post.body}
              </p>
              <p className="text-xs text-zinc-600 mt-2">
                {new Date(post.created_at).toLocaleString(
                  locale === "ko" ? "ko-KR" : "en-US"
                )}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}