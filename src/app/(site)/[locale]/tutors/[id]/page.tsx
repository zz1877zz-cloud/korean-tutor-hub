import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import BookingButton from "@/components/BookingButton"
import ConsultationRequestButton from "@/components/ConsultationRequestButton"
import Avatar from "@/components/Avatar"
import TutorReviews from "@/components/TutorReviews"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { specialtyLabel } from "@/lib/specialties"
import { pageMeta } from "@/lib/seo"
import { formatHourly, formatRating } from "@/lib/tutor-display"

function clip(text: string, max = 150) {
  const flat = text.replace(/\s+/g, " ").trim()
  if (flat.length <= max) return flat
  return `${flat.slice(0, max - 1).trimEnd()}…`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "detail" })
  const supabase = await createClient()
  const { data: tutor } = await supabase
    .from("tutors")
    .select("display_name, tagline, bio")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle()

  const name = tutor?.display_name?.trim() || t("fallbackName")
  const about = tutor?.tagline?.trim() || tutor?.bio?.trim()
  return pageMeta({
    locale,
    path: `/tutors/${id}`,
    title: name,
    description: about ? clip(about) : t("metaFallback"),
  })
}

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

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, kind, rating, comment, created_at")
    .eq("tutor_id", tutor.id)
    .order("created_at", { ascending: false })

  const notices = (posts ?? []).filter((p) => p.type === "notice")
  const regular = (posts ?? []).filter((p) => p.type !== "notice")

  const name = tutor.display_name?.trim() || t("fallbackName")
  const rating = formatRating(tutor.rating)
  const price = formatHourly(tutor.hourly_rate, locale)
  const specialties = (tutor.specialties ?? []).filter(Boolean)
  const languages = (tutor.languages ?? []).filter(Boolean)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-12">
      <Link
        href="/tutors"
        className="mb-6 inline-flex min-h-11 items-center text-sm text-zinc-300 transition hover:text-white"
      >
        ← {t("back")}
      </Link>

      <div className="surface mb-8 p-5 sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar src={tutor.avatar_url} bio={tutor.bio || name} size="xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{name}</h1>

            {tutor.tagline && (
              <p className="mt-2 text-sm leading-relaxed text-fuchsia-200">
                {tutor.tagline}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="price text-xl">{price ?? t("rateUnset")}</p>
              <p className={rating ? "rating text-sm" : "text-sm text-zinc-300"}>
                {rating ? `★ ${rating}` : t("reviewsPending")}
              </p>
            </div>
          </div>
        </div>

        <h2 className="mb-3 text-lg font-bold text-white">{t("about")}</h2>
        <p className="mb-8 whitespace-pre-line leading-relaxed text-zinc-200">
          {tutor.bio?.trim() ? tutor.bio : t("bioEmpty")}
        </p>

        <div className="mb-6">
          <h2 className="mb-2 font-semibold text-white">{t("specialties")}</h2>
          {specialties.length ? (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {specialties.map((item: string) => (
                <li key={item} className="chip text-sm">
                  {specialtyLabel(item, locale)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">{t("specialtiesEmpty")}</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="mb-2 font-semibold text-white">{t("languages")}</h2>
          {languages.length ? (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {languages.map((item: string) => (
                <li
                  key={item}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-zinc-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">{t("languagesEmpty")}</p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 p-4">
          <p className="text-sm leading-relaxed text-zinc-200">{t("actionLead")}</p>
          <ConsultationRequestButton tutorId={tutor.id} />
          <BookingButton tutorId={tutor.id} />
        </div>
      </div>

      <TutorReviews reviews={(reviews ?? []) as never} />

      <section className="mt-10">
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
              <p className="text-sm text-zinc-200 whitespace-pre-line">{post.body}</p>
            </div>
          ))}

          {regular.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm text-zinc-200 whitespace-pre-line">{post.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}