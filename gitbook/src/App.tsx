import { useState, useEffect, useRef } from "react"
import "./App.css"
import { DocsPage } from "./components/DocsPage"
import { Sidebar } from "./components/Sidebar"
import { TestTube2, SearchIcon } from "lucide-react"
import { SidebarProvider } from "./components/ui/sidebar"
import { Input } from "./components/ui/input"
import { docsTree } from "./data/docstree"
import SearchResult from "./components/SearchResult"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "./components/ui/dialog"

export default function App() {
  const [currentPath, setCurrentPath] = useState("/")
  const [filter, setFilter] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
    const handleKeyDown = (e : KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const handleInputFocus = () => {
    setIsDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    // Reset filter when dialog closes
    if (!open) {
      setFilter("")
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* navbar */}
      <nav className="w-full border-b border-border bg-background shrink-0">
        <div className="flex h-14 items-center justify-between px-6">
          {/* Left: Title */}
          <div className="flex items-center gap-2">
            <TestTube2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-sm font-semibold">
              Testing and Security
            </h2>
          </div>

          {/* Right: Search Input */}
          <div className="w-64 relative">
            <Input
              ref={inputRef}
              placeholder="Search documentation..."
              className="h-9 cursor-pointer"
              value={filter}
              readOnly
              onFocus={handleInputFocus}
              // Preserve the icon and styling of the original input
              icon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </div>
      </nav>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search Documentation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Search documentation..."
              className="h-9"
              autoFocus
              value={filter}
              onChange={(e) => { setFilter(e.target.value) }}
              icon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
            />
            {filter && (
              <div className="max-h-[300px] overflow-y-auto">
                <SearchResult query={filter} data={docsTree} setter={setCurrentPath} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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