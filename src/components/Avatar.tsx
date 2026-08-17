function avatarUrl(seed?: string | null) {
    const s = encodeURIComponent(seed || "guest")
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${s}&size=128&backgroundColor=ffd5dc,c0aede,d1d4f9,b6e3f4,ffdfbf`
  }
  
  export default function Avatar({
    src,
    seed,
    size = "md",
  }: {
    src?: string | null
    seed?: string | null
    size?: "sm" | "md" | "lg"
  }) {
    const sizeClass =
      size === "sm"
        ? "w-9 h-9"
        : size === "lg"
        ? "w-16 h-16"
        : "w-12 h-12"
  
    const imageSrc = src || avatarUrl(seed)
  
    return (
      <img
        src={imageSrc}
        alt="avatar"
        className={`${sizeClass} rounded-full object-cover bg-white/10 border border-white/15`}
      />
    )
  }