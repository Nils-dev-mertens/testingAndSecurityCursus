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
const renderNode = (node: DocNode, isRoot = false) => {
  const indexFile = node.files.find((f) => f.filename === "index.md")
  const nonIndexFiles = node.files.filter((f) => f.filename !== "index.md")
  const hasChildren = node.children.length > 0 || nonIndexFiles.length > 0

  const folderLabel = node.path === "/" ? "Home" : node.path.split("/").pop()
  const folderPath = node.path

  // Root folder: render only the index page directly
  if (isRoot) {
    return (
      <SidebarMenuItem key={node.path}>
        <SidebarMenuButton onClick={() => onSelect(folderPath)}>
          {folderLabel}
        </SidebarMenuButton>
        {/* Render children as collapsibles */}
        {node.children.map((child) => renderNode(child))}
      </SidebarMenuItem>
    )
  }

  // Normal folder with children → collapsible
  if (hasChildren) {
    const [open, setOpen] = useState(true)
    return (
      <Collapsible
        key={node.path}
        defaultOpen
        onOpenChange={setOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
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

              {node.children.map((child) => renderNode(child))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  // Folder with only index.md → direct link
  return (
    <SidebarMenuItem key={node.path}>
      <SidebarMenuButton onClick={() => onSelect(folderPath)}>
        {folderLabel}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// Render root
return <SidebarMenu>{renderNode(docsTree, true)}</SidebarMenu>
}
