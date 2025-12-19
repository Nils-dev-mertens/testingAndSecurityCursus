import type { Dispatch, SetStateAction } from "react"

  const normalizePath = (raw: string | null | undefined) => {
    if (!raw) return "/"
    try {
      let p = decodeURIComponent(raw)
      if (!p.startsWith("/")) p = "/" + p
      if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1)
      return p
    } catch (e) {
      return raw || "/"
    }
  }

export default function handleSelect(path: string, setter :Dispatch<SetStateAction<string>>) {
    const normalized = normalizePath(path)
    setter(normalized)
    window.location.hash = encodeURI(normalized)
  }