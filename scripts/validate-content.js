#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function validateContent() {
 const contentDir = path.join(process.cwd(), 'content/calculators')
 
 if (!fs.existsSync(contentDir)) {
 console.log('✅ Content directory not found - skipping validation')
 return
 }

 const files = fs.readdirSync(contentDir, { recursive: true })
 .filter(file => file.endsWith('.mdx'))

 console.log(`🔍 Validating ${files.length} content files...`)

 let errors = 0
 files.forEach(file => {
 try {
 const filePath = path.join(contentDir, file)
 const content = fs.readFileSync(filePath, 'utf8')
 const { data: frontmatter } = matter(content)

 // Basic validation
 if (!frontmatter.title) {
 console.error(`❌ ${file}: Missing title`)
 errors++
 }
 if (!frontmatter.description) {
 console.error(`❌ ${file}: Missing description`)
 errors++
 }
 if (!frontmatter.calculatorId) {
 console.error(`❌ ${file}: Missing calculatorId`)
 errors++
 }
 } catch (error) {
 console.error(`❌ ${file}: Parse error - ${error.message}`)
 errors++
 }
 })

 if (errors === 0) {
 console.log('✅ All content files are valid')
 } else {
 console.error(`❌ Found ${errors} validation errors`)
 process.exit(1)
 }
}

validateContent()
