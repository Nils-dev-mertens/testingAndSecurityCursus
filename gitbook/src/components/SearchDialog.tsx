import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import SearchResult from "./SearchResult";
import type { DocNode } from "../types";

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [tree, setTree] = useState<DocNode | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/tree.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setTree(data);
      })
      .catch(() => {
        /* search index unavailable */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setFilter("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="border-border placeholder:text-muted-foreground flex h-9 w-64 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent md:text-sm"
        aria-label="Search documentation"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search documentation...</span>
        <kbd className="text-muted-foreground/70 rounded border border-border bg-muted px-1.5 font-sans text-xs">
          Ctrl K
        </kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
              onChange={(e) => setFilter(e.target.value)}
              icon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
            {filter && tree && (
              <div className="max-h-[300px] overflow-y-auto">
                <SearchResult query={filter} data={tree} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchDialog;