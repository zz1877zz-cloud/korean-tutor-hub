import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import TutorPostForm from "@/components/TutorPostForm"
import TutorPostListStudio from "@/components/TutorPostListStudio"

export default async function TutorPostsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("studio")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: tutor } = await supabase
    .from("tutors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!tutor) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-2">{t("postsTitle")}</h1>
        <p className="text-zinc-400 text-sm">{t("notTutor")}</p>
      </div>
    )
  }

  const { data: posts } = await supabase
    .from("tutor_posts")
    .select("id, type, body, pinned, created_at")
    .eq("tutor_id", tutor.id)
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">{t("postsTitle")}</h1>
      <p className="text-zinc-400 text-sm mb-6">{t("postsDesc")}</p>

      <TutorPostForm tutorId={tutor.id} />

      <h2 className="text-white font-semibold mt-10 mb-4">{t("myPosts")}</h2>
      <TutorPostListStudio posts={posts ?? []} />

      <div className="mt-8">
        <Link
          href={`/${locale}/tutor/profile`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          {t("backProfile")}
        </Link>
      </div>
    </div>
  )
}