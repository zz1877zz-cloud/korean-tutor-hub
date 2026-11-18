"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import { useTranslations } from "next-intl"

const STORAGE_KEY = "kth-ghosts"

const GHOSTS = [
  { width: 30, follow: 0.014, bob: 3.2, phase: 0.4, ox: -48, oy: 16 },
  { width: 36, follow: 0.008, bob: 4.1, phase: 1.8, ox: -6, oy: 34 },
  { width: 24, follow: 0.0046, bob: 2.6, phase: 2.9, ox: 30, oy: 20 },
] as const

function subscribe(onChange: () => void) {
  window.addEventListener("kth-ghosts", onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener("kth-ghosts", onChange)
    window.removeEventListener("storage", onChange)
  }
}

function readEnabled() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off"
  } catch {
    return true
  }
}

function writeEnabled(next: boolean) {
  window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off")
  window.dispatchEvent(new Event("kth-ghosts"))
}

function useGhostsEnabled() {
  return useSyncExternalStore(subscribe, readEnabled, () => true)
}

export function GatGhostMark() {
  return (
    <svg viewBox="0 0 64 86" aria-hidden="true" focusable="false">
      <path
        className="gat-body"
        d="M18 54C18 42 24 36 32 36C40 36 46 42 46 54V64Q43 74 40 64Q37 74 34 64Q31 74 28 64Q25 74 22 64Q19 74 18 64Z"
      />
      <ellipse className="gat-blush" cx="23.4" cy="53.5" rx="2.5" ry="1.3" />
      <ellipse className="gat-blush" cx="40.6" cy="53.5" rx="2.5" ry="1.3" />
      <circle className="gat-eye" cx="26.4" cy="49.6" r="1.65" />
      <circle className="gat-eye" cx="37.6" cy="49.6" r="1.65" />
      <ellipse className="gat-hat" cx="32" cy="36.4" rx="23" ry="3.35" />
      <path className="gat-hat" d="M27.4 35.6V18.2c0-2.5 9.2-2.5 9.2 0v17.4z" />
      <ellipse className="gat-crown" cx="32" cy="17.6" rx="4.7" ry="1.85" />
      <path className="gat-shine" d="M16 35.6c4-1.2 10-1.8 16-1.8s12 .6 16 1.8c-4 .7-10 1.1-16 1.1s-12-.4-16-1.1z" />
    </svg>
  )
}

export function GhostToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("common")
  const on = useGhostsEnabled()
  const label = on ? t("ghostsOff") : t("ghostsOn")

  return (
    <button
      type="button"
      className={`icon-btn ghost-toggle inline-flex items-center justify-center ${className}`}
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={() => writeEnabled(!on)}
    >
      <span className="ghost-toggle-mark">
        <GatGhostMark />
      </span>
    </button>
  )
}

export default function GatGhosts() {
  const on = useGhostsEnabled()
  const nodes = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (!on) return

    const coarse = window.matchMedia("(pointer: coarse)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    let stop = () => {}

    const arm = () => {
      stop()
      stop = () => {}
      if (coarse.matches || reduce.matches) return
      stop = follow(nodes.current)
    }

    arm()
    coarse.addEventListener("change", arm)
    reduce.addEventListener("change", arm)
    return () => {
      coarse.removeEventListener("change", arm)
      reduce.removeEventListener("change", arm)
      stop()
    }
  }, [on])

  if (!on) return null

  return (
    <div className="gat-ghosts" aria-hidden="true">
      {GHOSTS.map((ghost, index) => (
        <div
          key={ghost.width}
          ref={(node) => {
            nodes.current[index] = node
          }}
          className="gat-ghost"
          style={{ width: ghost.width, height: Math.round(ghost.width * (86 / 64)) }}
        >
          <GatGhostMark />
        </div>
      ))}
    </div>
  )
}

function follow(elements: Array<HTMLDivElement | null>) {
  const state = GHOSTS.map((ghost, index) => ({
    ...ghost,
    height: ghost.width * (86 / 64),
    x: window.innerWidth * 0.46,
    y: window.innerHeight * 0.42,
    el: elements[index],
  }))
  let targetX = state[0].x
  let targetY = state[0].y
  let seen = false
  let frame = 0
  let last = performance.now()

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType === "touch") return
    targetX = event.clientX
    targetY = event.clientY
    seen = true
  }

  const tick = (now: number) => {
    const dt = Math.min(34, now - last)
    last = now
    for (const ghost of state) {
      const step = 1 - Math.exp(-ghost.follow * dt)
      ghost.x += (targetX + ghost.ox - ghost.x) * step
      ghost.y += (targetY + ghost.oy - ghost.y) * step
      const wave = now * 0.002 + ghost.phase
      const bobX = Math.cos(wave * 0.85) * ghost.bob * 0.35
      const bobY = Math.sin(wave) * ghost.bob
      if (!ghost.el) continue
      ghost.el.style.opacity = seen ? "1" : "0"
      ghost.el.style.transform = `translate3d(${ghost.x - ghost.width / 2 + bobX}px, ${ghost.y - ghost.height / 2 + bobY}px, 0)`
    }
    frame = requestAnimationFrame(tick)
  }

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame)
      frame = 0
      return
    }
    if (!frame) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
  }

  window.addEventListener("pointermove", onPointer, { passive: true })
  document.addEventListener("visibilitychange", onVisibility)
  frame = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener("pointermove", onPointer)
    document.removeEventListener("visibilitychange", onVisibility)
  }
}
