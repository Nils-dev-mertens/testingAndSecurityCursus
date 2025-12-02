import React from "react"
import { docsTree } from "../data/docstree"
import type { DocNode } from "../types"

interface SidebarProps {
  onSelect: (path: string) => void
}

export function Sidebar({ onSelect }: SidebarProps) {
  const renderNode = (node: DocNode, level: number = 0) => {
    const hasIndex = node.files.some(f => f.filename === "index.md")
    const folderName = node.path === "/" ? "Home" : node.path.split("/").pop()
    
    return (
      <div key={node.path}>
        {/* Render folder/section link if it has an index */}
        {hasIndex && (
          <div style={{ paddingLeft: level * 16, margin: "4px 0" }}>
            <a
              href={`#${encodeURI(node.path)}`}
              onClick={(e) => {
                e.preventDefault()
                onSelect(node.path)
              }}
              style={{ cursor: "pointer", color: "inherit", textDecoration: "none", fontWeight: level === 0 ? "bold" : "normal" }}
            >
              {folderName}
            </a>
          </div>
        )}
        
        {/* Render non-index files */}
        {node.files
          .filter(file => file.filename !== "index.md")
          .map((file) => {
            const fileSlug = file.filename.replace(/\.md$/, "")
            const filePath = node.path === "/" ? `/${fileSlug}` : `${node.path}/${fileSlug}`

            return (
              <div key={file.filename} style={{ paddingLeft: (level + 1) * 16, margin: "4px 0" }}>
                <a
                  href={`#${encodeURI(filePath)}`}
                  onClick={(e) => {
                    e.preventDefault()
                    onSelect(filePath)
                  }}
                  style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}
                >
                  {fileSlug}
                </a>
              </div>
            )
          })}
        
        {/* Render children */}
        {node.children.map(child => renderNode(child, level + 1))}
      </div>
    )
  }

  return <div>{renderNode(docsTree)}</div>
}