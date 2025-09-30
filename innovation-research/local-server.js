#!/usr/bin/env node

// Local test server to simulate Vercel functions
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting local serverless function test server...');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API routes
  if (pathname === '/api/participate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('📝 Participation form submission:', data);

        // Simulate form processing
        const response = {
          success: true,
          message: 'Participation form submitted successfully!',
          data: {
            club_name: data.club_name,
            role: data.role,
            email: data.email,
            innovation: data.innovation,
            language: data.language || 'en',
            timestamp: new Date().toISOString()
          }
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));

        console.log('✅ Participation form processed successfully');
      } catch (error) {
        console.error('❌ Error processing participation form:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (pathname === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('📧 Contact form submission:', data);

        // Simulate form processing
        const response = {
          success: true,
          message: 'Contact form submitted successfully!',
          data: {
            name: data.name,
            email: data.email,
            message: data.message,
            language: data.language || 'en',
            timestamp: new Date().toISOString()
          }
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));

        console.log('✅ Contact form processed successfully');
      } catch (error) {
        console.error('❌ Error processing contact form:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Serve static files from public directory
  if (pathname === '/' || pathname === '/index.html') {
    serveFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
  } else if (pathname.startsWith('/')) {
    const filePath = path.join(__dirname, 'public', pathname);
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    serveFile(res, filePath, mimeTypes[ext] || 'text/plain');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Local server running on http://localhost:${PORT}`);
  console.log('📡 API endpoints available:');
  console.log('   POST http://localhost:3000/api/participate');
  console.log('   POST http://localhost:3000/api/contact');
  console.log('🌐 Static site served from /public directory');
});