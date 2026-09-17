import * as fs from "fs"
import * as path from "path"
import { slug } from "github-slugger"

interface FileNode {
  filename: string
  content: string
}

interface DocNode {
  path: string
  label: string
  files: FileNode[]
  children: DocNode[]
}

const CONTENT_ROOT = path.join(process.cwd(), "content")
const TREE_OUTPUT = path.join(process.cwd(), "public", "tree.json")

/**
 * Slugifies a path segment the same way Astro content ids are slugified
 * (github-slugger: lowercase, spaces to "-", strip punctuation), so the
 * search index links match the generated routes.
 */
function slugify(segment: string): string {
  return slug(segment)
}

function buildNode(dir: string, baseUrl: string, label: string): DocNode {
  const items = fs.readdirSync(dir)

  const files: FileNode[] = []
  const children: DocNode[] = []

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    // Subdirectories
    if (stat.isDirectory()) {
      const childUrl = baseUrl === "/" ? `/${slugify(item)}` : `${baseUrl}/${slugify(item)}`
      children.push(buildNode(fullPath, childUrl, item))
      continue
    }

    // Markdown files
    if (stat.isFile() && item.endsWith(".md")) {
      files.push({
        filename: item,
        content: fs.readFileSync(fullPath, "utf8")
      })
    }
  }

  return {
    path: baseUrl,
    label,
    files,
    children: children.sort((a, b) => a.path.localeCompare(b.path))
  }
}

//
// MAIN BUILD STEP
//
const tree = buildNode(CONTENT_ROOT, "/", "Home")

// Ensure public/ exists
fs.mkdirSync(path.dirname(TREE_OUTPUT), { recursive: true })

fs.writeFileSync(
  TREE_OUTPUT,
  JSON.stringify(tree, null, 2)
)

console.log("Generated public/tree.json (search index).")