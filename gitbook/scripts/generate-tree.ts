import * as fs from "fs"
import * as path from "path"

export interface FileNode {
  filename: string
  content: string
}

export interface DocNode {
  path: string        // "/", "/guide", "/guide/deep"
  files: FileNode[]   // only md files in this folder
  children: DocNode[] // only subfolders
}

function buildNode(dir: string, baseUrl: string): DocNode {
  const items = fs.readdirSync(dir)

  const files: FileNode[] = []
  const children: DocNode[] = []

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    // Handle subdirectories
    if (stat.isDirectory()) {
      const childUrl = baseUrl === "/" ? `/${item}` : `${baseUrl}/${item}`
      children.push(buildNode(fullPath, childUrl))
    }

    // Handle markdown files
    if (stat.isFile() && item.endsWith(".md")) {
      const content = fs.readFileSync(fullPath, "utf8")
      files.push({
        filename: item,
        content
      })
    }
  }

  return {
    path: baseUrl,
    files,
    children: children.sort((a, b) => a.path.localeCompare(b.path))
  }
}

const ROOT = path.join(process.cwd(), "content")
const tree = buildNode(ROOT, "/")

fs.writeFileSync(
  path.join(process.cwd(), "tree.json"),
  JSON.stringify(tree, null, 2)
)

console.log("Generated tree.json")
