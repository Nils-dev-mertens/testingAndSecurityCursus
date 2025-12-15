import { useState, useEffect } from "react"
import "./App.css"
import { DocsPage } from "./components/DocsPage"
import { Sidebar } from "./components/Sidebar"
import { TestTube2 } from "lucide-react"
import { SidebarProvider } from "./components/ui/sidebar"
import { Input } from "./components/ui/input"

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
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* navbar */}
      <nav className="w-full border-b border-border bg-background flex-shrink-0">
        <div className="flex h-14 items-center justify-between px-6">
          {/* Left: Title */}
          <div className="flex items-center gap-2">
            <TestTube2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-sm font-semibold">
              Testing and Security
            </h2>
          </div>

          {/* Right: Search */}
          <div className="w-64">
            <Input
              placeholder="Search documentation..."
              className="h-9"
            />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <div className="
          w-64 
          border-r 
          border-border 
          bg-card 
          shadow-sm 
          shrink-0
        ">
          <SidebarProvider className="p-4">
            <Sidebar onSelect={handleSelect} />
          </SidebarProvider>
        </div>

        {/* Docs Content */}
<div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-4xl mx-auto p-6 converted">
            <DocsPage path={currentPath} />
          </div>
        </div>
      </div>
    </div>
  )
}