import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { ArrowDown, ArrowUp, CornerDownLeft, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import SearchResult from "./SearchResult";
import { searchDocs } from "../lib/search";
import type { DocNode } from "../types";

/** Upper bound on rendered rows so a one-letter query stays snappy. */
const MAX_RESULTS = 30;

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [tree, setTree] = useState<DocNode | null>(null);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Resolved after mount so server and client markup match.
  useEffect(() => {
    setIsMac(/mac|iphone|ipad/i.test(navigator.userAgent));
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

  const hits = tree ? searchDocs(tree, filter) : [];
  const hasQuery = filter.trim().length > 0;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setFilter("");
  };

  /** Moves focus through the result list so Enter opens the highlighted page. */
  const moveFocus = (direction: 1 | -1) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLAnchorElement>("[data-search-hit]") ?? [],
    );
    if (items.length === 0) return;
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      current === -1
        ? direction === 1
          ? 0
          : items.length - 1
        : (current + direction + items.length) % items.length;
    items[next].focus();
  };

  const handleListKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveFocus(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveFocus(-1);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Typing while a result is focused should keep refining the query.
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground border-border bg-muted/40 hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex h-9 w-56 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:hidden lg:w-64"
        aria-label="Search documentation"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate text-left">Search docs…</span>
        <kbd className="border-border bg-background pointer-events-none hidden items-center rounded border px-1.5 font-sans text-[11px] sm:inline-flex">
          {isMac ? "⌘ K" : "Ctrl K"}
        </kbd>
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="sm:hidden"
        aria-label="Search documentation"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="top-[10%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search documentation</DialogTitle>
            <DialogDescription>
              Type to filter all documentation pages, then press Enter to open a result.
            </DialogDescription>
          </DialogHeader>

          <div
            className="border-border flex items-center gap-3 border-b px-4"
            onClick={() => inputRef.current?.focus()}
          >
            <Search className="text-muted-foreground h-4 w-4 shrink-0" />
            <Input
              ref={inputRef}
              autoFocus
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  moveFocus(e.key === "ArrowDown" ? 1 : -1);
                }
              }}
              placeholder="Search documentation…"
              aria-label="Search documentation"
              className="h-12 border-0 bg-transparent px-0 shadow-none ring-0 dark:bg-transparent"
            />
            <kbd className="text-muted-foreground/70 border-border bg-muted hidden shrink-0 rounded border px-1.5 font-sans text-[11px] sm:inline-flex">
              Esc
            </kbd>
          </div>

          <div
            ref={listRef}
            onKeyDown={handleListKeyDown}
            className="max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain p-2"
          >
            {!tree ? (
              <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                Loading search index…
              </p>
            ) : !hasQuery ? (
              <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                Type to search across every page of the docs.
              </p>
            ) : hits.length === 0 ? (
              <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                No results for “{filter.trim()}”.
              </p>
            ) : (
              <SearchResult query={filter} data={tree} limit={MAX_RESULTS} />
            )}
          </div>

          <div className="border-border text-muted-foreground flex items-center justify-between gap-3 border-t px-4 py-2 text-xs">
            <span>
              {hasQuery
                ? `${hits.length} result${hits.length === 1 ? "" : "s"}`
                : "Search"}
            </span>
            <span className="hidden items-center gap-3 sm:flex">
              <span className="flex items-center gap-0.5">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                <span className="ml-1">Navigate</span>
              </span>
              <Hint icon={<CornerDownLeft className="h-3 w-3" />} label="Open" />
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Hint({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1">
      {icon}
      {label}
    </span>
  );
}

export default SearchDialog;
