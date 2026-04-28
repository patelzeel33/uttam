/**
 * Local API dev server - runs the Vercel serverless functions locally
 * using a lightweight HTTP server. Only used for local development.
 * In production, Vercel handles /api/* automatically.
 *
 * Run with: node api-server.cjs
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
  console.log('✅ Loaded .env.local');
}

// Register ts-node for TypeScript support
require('ts-node').register({
  project: path.join(__dirname, 'tsconfig.api.json'),
  transpileOnly: true,
});

const PORT = process.env.API_PORT || 3001;

// Route map: METHOD /path -> handler file
const routes = {
  'POST /api/register':            './api/register.ts',
  'POST /api/admin/login':         './api/admin/login.ts',
  'GET /api/admin/applicants':     './api/admin/applicants.ts',
  'PATCH /api/admin/update-status':'./api/admin/update-status.ts',
  'GET /api/health':               './api/health.ts',
};

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { resolve({}); }
    });
  });
}

http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const query = Object.fromEntries(new URLSearchParams(req.url.split('?')[1] || ''));
  
  // CORS for all
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const key = `${req.method} ${url}`;
  const handlerFile = routes[key];

  if (!handlerFile) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `No handler for ${key}` }));
    return;
  }

  try {
    const body = await parseBody(req);
    const handler = require(path.resolve(__dirname, handlerFile)).default;

    // Build a minimal Vercel-compatible req/res
    const fakeReq = Object.assign(req, { body, query });
    const chunks = [];
    let statusCode = 200;
    const headers = {};

    const fakeRes = {
      status(code) { statusCode = code; return fakeRes; },
      setHeader(k, v) { headers[k] = v; return fakeRes; },
      json(data) {
        res.writeHead(statusCode, { ...headers, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      },
      end(data) {
        res.writeHead(statusCode, headers);
        res.end(data || '');
      },
    };

    await handler(fakeReq, fakeRes);
  } catch (err) {
    console.error(`[${key}] Error:`, err.stack || err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}).listen(PORT, () => {
  console.log(`\n🚀 API server running on http://localhost:${PORT}`);
  console.log('   Routes:');
  Object.keys(routes).forEach(r => console.log(`   ${r}`));
  console.log('\n   In another terminal run: npm run dev\n');
});
