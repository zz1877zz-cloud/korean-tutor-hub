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
    <Link href={`/tutors/${tutor.id}`} className="tutor-row surface">
      <Avatar src={tutor.avatar_url} bio={tutor.bio || name} name={name} size="lg" />
      <div className="min-w-0">
        <Heading className="truncate font-semibold">{name}</Heading>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-300">{intro}</p>
        <p className="mt-1 text-sm text-zinc-400">
          {hasLanguages
            ? languageLine(tutor.languages, labels.languagesUnset)
            : labels.languagesUnset}
        </p>
        {specs.length > 0 && (
          <p className="mt-1 text-sm text-zinc-400">
            {specs.map((code) => specialtyLabel(code, locale)).join(", ")}
          </p>
        )}
      </div>
      <div className="tutor-facts">
        <span className="price text-sm">{price ?? labels.rateUnset}</span>
        <span className={rating ? "rating text-sm" : "text-sm text-zinc-400"}>
          {rating ? `★ ${rating}` : labels.reviewsPending}
        </span>
      </div>
    </Link>
  )
}
