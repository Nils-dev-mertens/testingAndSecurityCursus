import type { DocNode } from "../types";
import { searchDocs, type SearchHit } from "../lib/search";
import { DialogClose } from "./ui/dialog";
import { CornerDownLeft } from "lucide-react";

interface SearchResultProps {
  query: string;
  data: DocNode;
  /** Optional cap on rendered rows. */
  limit?: number;
}

export default function SearchResult({ query, data, limit }: SearchResultProps) {
  const hits = searchDocs(data, query);
  if (hits.length === 0) return null;
  const visibleHits = limit ? hits.slice(0, limit) : hits;

  return (
    <ul className="flex flex-col gap-1">
      {visibleHits.map((hit) => (
        <li key={hit.path}>
          <ResultItem hit={hit} query={query} />
        </li>
      ))}
    </ul>
  );
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle) return <>{text}</>;

  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === needle.toLowerCase() ? (
          <mark key={index} className="bg-primary/25 text-foreground rounded-sm">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

interface ResultItemProps {
  hit: SearchHit;
  query: string;
}

export function ResultItem({ hit, query }: ResultItemProps) {
  return (
    <DialogClose asChild>
      <a
        href={hit.path}
        data-search-hit={hit.path}
        className="group hover:bg-accent focus-visible:bg-accent focus-visible:ring-ring/50 flex flex-col gap-1 rounded-md px-3 py-2 outline-none transition-colors focus-visible:ring-2"
      >
        {hit.breadcrumb ? (
          <span className="text-muted-foreground truncate text-xs">{hit.breadcrumb}</span>
        ) : null}
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">
            <Highlighted text={hit.label} query={query} />
          </span>
          <CornerDownLeft className="text-muted-foreground h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-focus-visible:opacity-100" />
        </span>
        {hit.snippet ? (
          <span className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            <Highlighted text={hit.snippet} query={query} />
          </span>
        ) : null}
      </a>
    </DialogClose>
  );
}
