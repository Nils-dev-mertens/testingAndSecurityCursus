import { docsTree } from "../data/docstree"
import type { DocNode } from "../types"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./ui/collapsible"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  onSelect: (path: string) => void
}

export function Sidebar({ onSelect }: SidebarProps) {
  const renderNode = (node: DocNode) => {
    const indexFile = node.files.find((f) => f.filename === "index.md")
    const nonIndexFiles = node.files.filter((f) => f.filename !== "index.md")
    const hasChildren = node.children.length > 0 || nonIndexFiles.length > 0

    const folderLabel = node.path === "/" ? "Home" : node.path.split("/").pop()
    const folderPath = node.path // clicking folder should go to index.md

    // Folder with no children or non-index files → direct link
    if (!hasChildren) {
      return (
        <SidebarMenuItem key={node.path}>
          <SidebarMenuButton onClick={() => onSelect(folderPath)}>
            {folderLabel}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    const [open, setOpen] = useState(true)

    return (
      <Collapsible
        key={node.path}
        defaultOpen
        onOpenChange={setOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          {/* Folder button links to index.md if exists */}
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={() => onSelect(folderPath)}
              className="flex items-center justify-between"
            >
              <span>{folderLabel}</span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ml-1 ${
                  open ? "rotate-90" : ""
                }`}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Non-index files */}
              {nonIndexFiles.map((file) => {
                const slug = file.filename.replace(".md", "")
                const filePath =
                  node.path === "/" ? `/${slug}` : `${node.path}/${slug}`
                return (
                  <SidebarMenuSubItem
                    key={filePath}
                    onClick={() => onSelect(filePath)}
                  >
                    {slug}
                  </SidebarMenuSubItem>
                )
              })}

              {/* Children folders */}
              {node.children.map((child) => renderNode(child))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return <SidebarMenu>{renderNode(docsTree)}</SidebarMenu>
}
