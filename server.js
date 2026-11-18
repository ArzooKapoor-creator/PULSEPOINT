/**
 * PULSEPOINT - LOCAL DEVELOPMENT SERVER (ZERO-DEPENDENCY)
 * 
 * Why this file exists:
 * Enables "npm run dev" or "node server.js" to run your website locally
 * using Node.js's built-in 'http' and 'fs' modules.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Supported file formats and their proper content types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Create the local HTTP server
const server = http.createServer(function (req, res) {
  // 1. Remove query string if present (e.g., from ?id=sleep-habits)
  let requestUrl = req.url.split('?')[0];

  // 2. Default to index.html when visiting the root '/'
  if (requestUrl === '/' || requestUrl === '') {
    requestUrl = '/index.html';
  }

  // 3. Resolve the exact file path on your computer
  const filePath = path.join(__dirname, requestUrl);
  const fileExt = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

  // 4. Read and send the file to the browser
  fs.readFile(filePath, function (err, content) {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <div style="font-family:sans-serif; text-align:center; padding:3rem;">
            <h1>404 - Page Not Found</h1>
            <p>Could not find <code>${requestUrl}</code></p>
            <a href="/" style="color:#0d9488; font-weight:bold;">&larr; Return to Home</a>
          </div>
        `);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Start listening on port 3000
server.listen(PORT, function () {
  console.log(`\n======================================================`);
  console.log(`🩺 PulsePoint Dev Server Running!`);
  console.log(`👉 Open in your browser: http://localhost:${PORT}`);
  console.log(`Press Ctrl + C in this terminal to stop the server.`);
  console.log(`======================================================\n`);
});
