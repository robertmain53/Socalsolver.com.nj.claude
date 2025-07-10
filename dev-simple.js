const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ 
 dev,
 // Disable problematic features
 conf: {
 experimental: {},
 webpack: (config) => {
 config.watchOptions = { ignored: ['**/node_modules/**'] }
 return config
 }
 }
})

const handle = app.getRequestHandler()

app.prepare().then(() => {
 createServer(async (req, res) => {
 try {
 const parsedUrl = parse(req.url, true)
 await handle(req, res, parsedUrl)
 } catch (err) {
 console.error('Error:', err)
 res.statusCode = 500
 res.end('Server error')
 }
 }).listen(3000, () => {
 console.log('🌅 SocalSolver ready on http://localhost:3000')
 })
})
