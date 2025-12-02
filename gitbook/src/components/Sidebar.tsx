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
    const hasIndex = node.files.some((f) => f.filename === "index.md")
    const nonIndexFiles = node.files.filter((f) => f.filename !== "index.md")
    const hasChildren = node.children.length > 0 || nonIndexFiles.length > 0

    const folderLabel = node.path === "/" ? "Home" : node.path.split("/").pop()

    // If folder ONLY contains index.md → no collapsible UI, just a direct link
    if (!hasChildren) {
      return (
        <SidebarMenuItem key={node.path}>
          <SidebarMenuButton onClick={() => onSelect(node.path)}>
            {folderLabel}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    // Collapsible UI -------
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
            <SidebarMenuButton>
              <ChevronRight
                className={`h-4 w-4 transition-transform mr-1 ${
                  open ? "rotate-90" : ""
                }`}
              />
              {folderLabel}
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