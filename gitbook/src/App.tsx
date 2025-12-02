import React, { useState, useEffect } from "react"
import { DocsPage } from "./components/DocsPage"
import { Sidebar } from "./components/Sidebar"
import { SidebarProvider } from "./components/ui/sidebar"

export default function App() {
  const [currentPath, setCurrentPath] = useState("/")

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

  // Initialize path from URL hash
  useEffect(() => {
    const readHash = () => {
      const raw = window.location.hash.slice(1)
      setCurrentPath(normalizePath(raw))
    }

    readHash()
    window.addEventListener("hashchange", readHash)
    return () => window.removeEventListener("hashchange", readHash)
  }, [])

  // Update URL when selecting sidebar item
  const handleSelect = (path: string) => {
    const normalized = normalizePath(path)
    setCurrentPath(normalized)
    window.location.hash = encodeURI(normalized)
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="
        w-64 
        border-r 
        border-border 
        bg-card 
        shadow-sm 
        flex-shrink-0
      ">
        <SidebarProvider className="p-4">
          <Sidebar onSelect={handleSelect} />
        </SidebarProvider>
      </div>

      {/* Docs Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <DocsPage path={currentPath} />
      </div>
    </div>
  )
}
