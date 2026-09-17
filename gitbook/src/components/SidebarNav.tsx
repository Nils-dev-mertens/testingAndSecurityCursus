import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import type { LeanNode } from "../lib/pages";
import { slugify } from "../lib/pages";

interface SidebarNavProps {
  currentPath: string;
  tree: LeanNode;
}

export function SidebarNav({ currentPath, tree }: SidebarNavProps) {
  return (
    <SidebarProvider className="min-h-0 w-auto shrink-0 md:min-h-svh">
      <Sidebar collapsible="icon">
        <div className="h-full overflow-y-auto p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={currentPath === "/"}>
                <a href="/">Home</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {tree.children.map((child) => (
              <SidebarNode
                key={child.path}
                node={child}
                currentPath={currentPath}
              />
            ))}
          </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarTrigger className="fixed left-4 top-3.5 z-40 md:hidden" />
    </SidebarProvider>
  );
}

function SidebarNode({ node, currentPath }: { node: LeanNode; currentPath: string }) {
  const [open, setOpen] = useState(true);
  const nonIndexFiles = node.files.filter((f) => f.filename !== "index.md");
  const hasChildren = node.children.length > 0 || nonIndexFiles.length > 0;
  const folderLabel = node.label ?? node.path.split("/").pop() ?? node.path;
  const isActive = currentPath === node.path;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <a href={node.path}>{folderLabel}</a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            asChild
            isActive={isActive}
            className="flex items-center justify-between"
          >
            <a href={node.path}>
              <span>{folderLabel}</span>
              <ChevronRight
                className={`ml-1 h-4 w-4 shrink-0 transition-transform ${
                  open ? "rotate-90" : ""
                }`}
              />
            </a>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {nonIndexFiles.map((file) => {
              const label = file.filename.replace(/\.md$/i, "");
              const slug = slugify(label);
              const filePath = node.path === "/" ? `/${slug}` : `${node.path}/${slug}`;
              return (
                <SidebarMenuSubItem key={filePath}>
                  <SidebarMenuSubButton
                    href={filePath}
                    isActive={currentPath === filePath}
                  >
                    {label}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
            {node.children.map((child) => (
              <SidebarNode key={child.path} node={child} currentPath={currentPath} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export default SidebarNav;