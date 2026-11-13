import { Link } from "@/i18n/navigation"
import Avatar from "@/components/Avatar"
import { specialtyLabel } from "@/lib/specialties"
import { formatHourly, formatRating, languageLine } from "@/lib/tutor-display"

export type TutorCardData = {
  id: string
  bio: string | null
  display_name: string | null
  tagline: string | null
  specialties?: string[] | null
  languages?: string[] | null
  hourly_rate: number | null
  rating: number | null
  avatar_url: string | null
}

export type TutorCardLabels = {
  unnamed: string
  reviewsPending: string
  rateUnset: string
  languagesLabel: string
  languagesUnset: string
  bioUnset: string
}

export default function TutorCard({
  tutor,
  locale,
  labels,
  heading = "h2",
}: {
  tutor: TutorCardData
  locale: string
  labels: TutorCardLabels
  heading?: "h2" | "h3"
}) {
  const name = tutor.display_name?.trim() || labels.unnamed
  const Heading = heading
  const rating = formatRating(tutor.rating)
  const price = formatHourly(tutor.hourly_rate, locale)
  const specs = (tutor.specialties ?? []).filter(Boolean).slice(0, 3)
  const intro = tutor.tagline?.trim() || tutor.bio?.trim() || labels.bioUnset
  const hasLanguages = (tutor.languages ?? []).some((item) => item.trim())

  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="surface flex h-full flex-col gap-3 p-4 transition hover:border-fuchsia-400/40"
    >
      <div className="flex items-start gap-3">
        <Avatar src={tutor.avatar_url} bio={tutor.bio || name} name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Heading className="truncate font-semibold text-white">{name}</Heading>
            {rating ? (
              <span className="rating shrink-0 text-sm">★ {rating}</span>
            ) : (
              <span className="shrink-0 text-xs text-zinc-400">
                {labels.reviewsPending}
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-300">
            {intro}
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-zinc-300">
        {hasLanguages
          ? `${labels.languagesLabel}: ${languageLine(tutor.languages, labels.languagesUnset)}`
          : labels.languagesUnset}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {specs.map((code) => (
            <span key={code} className="chip">
              {specialtyLabel(code, locale)}
            </span>
          ))}
        </div>
        <span className="price shrink-0 text-sm">
          {price ?? labels.rateUnset}
        </span>
      </div>
    </Link>
  )
}
