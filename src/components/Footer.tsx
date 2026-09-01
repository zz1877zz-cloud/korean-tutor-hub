import { Link } from "@/i18n/navigation"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0f] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
          Korean Tutor Hub는 K-pop과 한국 유학을 꿈꾸는 해외 학습자가
          검증된 한국어 튜터를 만나고, 더 낮은 부담으로 성장할 수 있도록 돕습니다.
          수업 경험을 바탕으로 한국 어학당·연수 기회까지 이어 가는 것이 우리의 목표입니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
          <Link href="/tutors" className="hover:text-zinc-300 transition">
            튜터 찾기
          </Link>
          <Link href="/terms" className="hover:text-zinc-300 transition">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition">
            개인정보처리방침
          </Link>
          <span>© {new Date().getFullYear()} Korean Tutor Hub</span>
        </div>
      </div>
    </footer>
  )
}