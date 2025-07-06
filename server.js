const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            // Parse the URL
            const parsedUrl = parse(req.url, true)
            
            // Let Next.js handle the request
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('Internal Server Error')
        }
    })
        .once('error', (err) => {
            console.error('Server error:', err)
            process.exit(1)
        })
        .listen(port, hostname, () => {
            console.log(`> Ready on http://${hostname}:${port}`)
        })
})