import React, { useState, useEffect } from "react"
import { DocsPage } from "./components/DocsPage"
import { Sidebar } from "./components/Sidebar"

export default function App() {
  const [currentPath, setCurrentPath] = useState("/")

  const normalizePath = (raw: string | null | undefined) => {
    if (!raw) return "/"
    try {
      // decode URI component and ensure leading slash, remove trailing slash
      let p = decodeURIComponent(raw)
      if (!p.startsWith("/")) p = "/" + p
      if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1)
      return p
    } catch (e) {
      return raw || "/"
    }
  }

  // Initialize path from URL hash on mount and listen for hash changes
  useEffect(() => {
    const readHash = () => {
      const raw = window.location.hash.slice(1)
      setCurrentPath(normalizePath(raw))
    }

    readHash()
    window.addEventListener("hashchange", readHash)
    return () => window.removeEventListener("hashchange", readHash)
  }, [])

  // Update URL when a sidebar item is selected
  const handleSelect = (path: string) => {
    const normalized = normalizePath(path)
    setCurrentPath(normalized)
    // Use encodeURI so slashes are preserved but special characters are encoded
    window.location.hash = encodeURI(normalized)
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: 250, borderRight: "1px solid #ccc" }}>
        <Sidebar onSelect={handleSelect} />
      </div>
      <div style={{ flex: 1 }}>
        <DocsPage path={currentPath} />
      </div>
    </div>
  )
}