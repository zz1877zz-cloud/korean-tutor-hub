import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const bodyClassName = `${geistSans.variable} ${geistMono.variable} font-sans antialiased`

export const themeBootScript = `(function(){try{var t=localStorage.getItem("kth-theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");}catch(e){}})();`
