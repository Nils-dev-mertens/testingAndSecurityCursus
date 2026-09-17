import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import type { PageLink } from "../lib/pages";

interface FolderFilesProps {
  files: PageLink[];
}

export function FolderFiles({ files }: FolderFilesProps) {
  const [open, setOpen] = useState(false);

  if (files.length === 0) return null;

  return (
    <div className="border-border mt-10 rounded-lg border p-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="folder-files"
        className="flex w-full cursor-pointer items-center justify-between text-sm font-semibold"
      >
        <span className="flex items-center gap-2">
          <FileText className="text-muted-foreground h-4 w-4" />
          See files ({files.length})
        </span>
        <ChevronDown
          className={`text-muted-foreground h-4 w-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ul id="folder-files" className="mt-3 grid gap-1">
          {files.map((file) => (
            <li key={file.href}>
              <a
                href={file.href}
                className="hover:bg-accent text-foreground/90 block rounded-md px-2 py-1.5 text-sm transition-colors"
              >
                {file.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FolderFiles;