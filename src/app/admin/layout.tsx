import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <Link href="/admin/tutors" className="font-semibold text-fuchsia-400">
          Admin
        </Link>
        <nav className="flex gap-4 text-sm text-zinc-400">
          <Link href="/admin/applications" className="hover:text-white">
            신청 관리
          </Link>
          <Link href="/admin/tutors" className="hover:text-white">
            튜터 관리
          </Link>
          <Link href="/en" className="hover:text-white">
            사이트로
          </Link>
        </nav>
      </header>
      {children}
    </div>
  )
}