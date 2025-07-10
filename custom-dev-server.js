const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = 3000
const dev = true

console.log('🌅 Starting SocalSolver custom dev server...')

const app = next({ 
 dev: false, // Force production mode to avoid file watching
 conf: {
 distDir: '.next',
 generateEtags: false,
 compress: false,
 }
})

const handle = app.getRequestHandler()

// First build the app
console.log('📦 Building application...')

app.prepare()
 .then(() => {
 createServer(async (req, res) => {
 try {
 // Parse the URL
 const parsedUrl = parse(req.url, true)
 const { pathname, query } = parsedUrl

 await handle(req, res, parsedUrl)
 } catch (err) {
 console.error('Error occurred handling', req.url, err)
 res.statusCode = 500
 res.end('Internal server error')
 }
 })
 .once('error', (err) => {
 console.error('Server error:', err)
 process.exit(1)
 })
 .listen(port, (err) => {
 if (err) throw err
 console.log('')
 console.log('🎉 SocalSolver is running!')
 console.log(`🌅 http://localhost:${port}`)
 console.log('')
 console.log('📱 Available pages:')
 console.log(' • Home: http://localhost:' + port)
 console.log(' • Calculators: http://localhost:' + port + '/calculators')
 console.log(' • BMI: http://localhost:' + port + '/calculators/bmi')
 console.log('')
 })
 })
 .catch((ex) => {
 console.error('Failed to start server:', ex)
 process.exit(1)
 })
