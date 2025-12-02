export interface FileNode {
  filename: string
  content: string
}

export interface DocNode {
  path: string
  files: FileNode[]
  children: DocNode[]
}