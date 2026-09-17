import type { DocNode } from "../types";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { DialogClose } from "./ui/dialog";
import { slugify } from "../lib/pages";

interface SearchResultProps {
  query: string;
  data: DocNode;
}

export default function SearchResult({ query, data }: SearchResultProps) {
  const normalizedQuery = query.toLowerCase().replace(/[#\n]/g, "");

  const matchesQuery = (text: string) =>
    text.toLowerCase().replace(/[#\n]/g, "").includes(normalizedQuery);

  return (
    <ScrollArea>
      {data.files.map((file, index) => {
        if (!matchesQuery(file.filename) && !matchesQuery(file.content)) return null;
        const path =
          file.filename === "index.md"
            ? data.path
            : `${data.path}/${slugify(file.filename.split(".")[0])}`;
        return (
          <ResultItem
            key={`${data.path}-file-${index}`}
            path={path}
            title={file.filename}
            content={file.content}
          />
        );
      })}
      {data.children.map((childNode, index) => (
        <SearchResult key={`${data.path}-child-${index}`} query={query} data={childNode} />
      ))}
    </ScrollArea>
  );
}

interface ResultItemProps {
  path: string;
  title: string;
  content: string;
}

export function ResultItem({ path, title, content }: ResultItemProps) {
  const label =
    title === "index.md"
      ? path === "/"
        ? "Home"
        : path.split("/").filter(Boolean).pop()
      : title.split(".")[0];

  return (
    <DialogClose asChild>
      <a href={path} className="block">
        <Card className="mb-2 cursor-pointer hover:bg-accent">
          <CardHeader>
            <CardTitle>{label}</CardTitle>
            <CardDescription className="line-clamp-1">
              {content.replace(/^#+\s*/, "")}
            </CardDescription>
          </CardHeader>
        </Card>
      </a>
    </DialogClose>
  );
}