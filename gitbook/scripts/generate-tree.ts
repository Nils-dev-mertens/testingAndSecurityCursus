import * as fs from "fs"
import * as path from "path"

interface FileNode {
  filename: string
  content: string
}

interface DocNode {
  path: string
  files: FileNode[]
  children: DocNode[]
}

const CONTENT_ROOT = path.join(process.cwd(), "content")
const PUBLIC_DOCS = path.join(process.cwd(), "public", "docs")

// Ensure /public/docs exists
if (!fs.existsSync(PUBLIC_DOCS)) {
  fs.mkdirSync(PUBLIC_DOCS, { recursive: true })
}

// Extract images: ![alt](path)
const IMAGE_REGEX = /!\[[^\]]*\]\(([^)]+)\)/g

function copyImage(srcMdDir: string, imgPath: string): string {
  // If already absolute (/docs/image.png) → do nothing
  if (imgPath.startsWith("/")) return imgPath

  const absoluteImgPath = path.resolve(srcMdDir, imgPath)
  if (!fs.existsSync(absoluteImgPath)) {
    console.warn("⚠ Missing image:", absoluteImgPath)
    return imgPath
  }

  // Mirror directory structure inside /public/docs
  const relativeSubpath = path.relative(CONTENT_ROOT, absoluteImgPath)
  const targetPath = path.join(PUBLIC_DOCS, relativeSubpath)

  // Ensure the folder exists
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })

  // Copy only if changed or missing
  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(absoluteImgPath, targetPath)
    console.log("Copied:", relativeSubpath)
  }

  // Public URL
  return `/docs/${relativeSubpath.replace(/\\/g, "/")}`
}

function rewriteImages(mdContent: string, mdDir: string) {
  return mdContent.replace(IMAGE_REGEX, (match, imgPath) => {
    const newUrl = copyImage(mdDir, imgPath)
    return match.replace(imgPath, newUrl)
  })
}

function buildNode(dir: string, baseUrl: string): DocNode {
  const items = fs.readdirSync(dir)

  const files: FileNode[] = []
  const children: DocNode[] = []

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    // Subdirectories
    if (stat.isDirectory()) {
      const childUrl = baseUrl === "/" ? `/${item}` : `${baseUrl}/${item}`
      children.push(buildNode(fullPath, childUrl))
      continue
    }

    // Markdown files
    if (stat.isFile() && item.endsWith(".md")) {
      const raw = fs.readFileSync(fullPath, "utf8")
      const updated = rewriteImages(raw, dir)

      files.push({
        filename: item,
        content: updated
      })
    }
  }

  return {
    path: baseUrl,
    files,
    children: children.sort((a, b) => a.path.localeCompare(b.path))
  }
}

//
// MAIN BUILD STEP
//
const tree = buildNode(CONTENT_ROOT, "/")

fs.writeFileSync(
  path.join(process.cwd(), "tree.json"),
  JSON.stringify(tree, null, 2)
)

console.log("Generated tree.json with image handling.")
