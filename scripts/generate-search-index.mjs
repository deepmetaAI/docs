import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const docsDir = path.join(__dirname, '../src/app/docs/zh-CN')
const outputFile = path.join(__dirname, '../src/lib/search-data.json')

function extractTextFromMdx(content) {
  // Remove export statements
  content = content.replace(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\}/g, '')
  
  // Remove import statements
  content = content.replace(/import\s+.*?from\s+['"].*?['"]/g, '')
  
  // Remove JSX components but keep text content
  content = content.replace(/<(\w+)[^>]*\/>/g, '') // self-closing tags
  content = content.replace(/<(\w+)[^>]*>([\s\S]*?)<\/\1>/g, '$2') // paired tags
  
  // Remove code blocks but keep inline code content
  content = content.replace(/```[\s\S]*?```/g, '')
  
  // Remove markdown links but keep text
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  
  // Remove markdown images
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
  
  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '')
  
  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---/g, '')
  
  // Remove markdown formatting
  content = content.replace(/[*_~`#]+/g, '')
  
  // Remove extra whitespace
  content = content.replace(/\s+/g, ' ').trim()
  
  return content
}

function extractTitle(content) {
  // Try to get title from metadata
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?title:\s*['"]([^'"]+)['"]/);
  if (metadataMatch) {
    return metadataMatch[1]
  }
  
  // Try to get first h1
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) {
    return h1Match[1].trim()
  }
  
  return ''
}

function extractSections(content) {
  const sections = []
  const h2Regex = /^##\s+(.+)$/gm
  let match
  
  while ((match = h2Regex.exec(content)) !== null) {
    sections.push({
      title: match[1].trim(),
      anchor: match[1].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    })
  }
  
  return sections
}

function getUrlFromPath(filePath) {
  const relativePath = path.relative(docsDir, filePath)
  const urlPath = relativePath
    .replace(/page\.mdx$/, '')
    .replace(/\\/g, '/')
    .replace(/\/$/, '')
  
  if (urlPath === '') {
    return '/docs/zh-CN'
  }
  return `/docs/zh-CN/${urlPath}`
}

function walkDir(dir, results = []) {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      // Skip backup directories
      if (file.startsWith('.')) continue
      walkDir(filePath, results)
    } else if (file === 'page.mdx') {
      results.push(filePath)
    }
  }
  
  return results
}

function generateSearchIndex() {
  const mdxFiles = walkDir(docsDir)
  const searchData = []
  
  for (const filePath of mdxFiles) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const url = getUrlFromPath(filePath)
    const title = extractTitle(content)
    const textContent = extractTextFromMdx(content)
    const sections = extractSections(content)
    
    // Add main page entry
    searchData.push({
      url,
      title: title || url.split('/').pop() || 'Untitled',
      pageTitle: title || url.split('/').pop() || 'Untitled',
      content: textContent.slice(0, 2000) // Limit content length
    })
    
    // Add section entries
    for (const section of sections) {
      searchData.push({
        url: `${url}#${section.anchor}`,
        title: section.title,
        pageTitle: title || url.split('/').pop() || 'Untitled',
        content: textContent.slice(0, 500),
        section: section.title
      })
    }
  }
  
  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(searchData, null, 2), 'utf-8')
  console.log(`Generated search index with ${searchData.length} entries`)
}

generateSearchIndex()
