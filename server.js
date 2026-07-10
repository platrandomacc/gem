import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' http://localhost:5173 http://localhost:4000 ws: wss:; connect-src 'self' http://localhost:5173 http://localhost:4000 ws: wss:; img-src 'self' data: https://cdn.discordapp.com https://media.discordapp.net;"
  );
  next();
});

app.get('/api/discord/login', (req, res) => {
  const frontendUrl = req.query.frontend;
  const mode = req.query.mode;
  const redirectTo = frontendUrl && typeof frontendUrl === 'string'
    ? frontendUrl
    : 'http://localhost:5173';

  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).send('Discord OAuth is not configured.');
  }

  const authUrl = new URL('https://discord.com/api/oauth2/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'identify email');
  authUrl.searchParams.set('prompt', 'consent');

  const redirectUrl = new URL(redirectTo);
  redirectUrl.searchParams.set('auth', 'discord');
  if (mode && typeof mode === 'string') {
    redirectUrl.searchParams.set('mode', mode);
  }

  res.redirect(`${authUrl.toString()}&state=${encodeURIComponent(redirectUrl.toString())}`);
});

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    return res.status(400).send('Missing Discord authorization code.');
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).send('Discord OAuth credentials are missing.');
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: String(code),
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('Failed to get Discord access token.');
    }

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = await userResponse.json();

    const redirectTarget = state ? decodeURIComponent(String(state)) : 'http://localhost:5173';
    const returnUrl = new URL(redirectTarget);
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
      : '';

    returnUrl.searchParams.set('auth', 'discord');
    returnUrl.searchParams.set('name', user.username || user.global_name || 'Discord User');
    returnUrl.searchParams.set('email', user.email || '');
    returnUrl.searchParams.set('id', user.id || '');
    returnUrl.searchParams.set('avatar', avatarUrl);

    res.redirect(returnUrl.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send('Discord authentication failed.');
  }
});

const chatMessages = [];
const sseClients = new Set();

function broadcastChatMessage(msg) {
  const payload = JSON.stringify(msg);
  for (const res of sseClients) {
    try {
      res.write(`data: ${payload}\n\n`);
    } catch (_) {
      // ignore
    }
  }
}

function requireUserHeader(req) {
  const raw = req.header('x-user');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.id || parsed.email || parsed.name)) return parsed;
  } catch (e) {
    return null;
  }
  return null;
}

app.post('/api/chat', (req, res) => {
  const user = requireUserHeader(req);
  if (!user) return res.status(401).json({ error: 'Authentication required: provide X-User header' });

  const { message } = req.body || {};
  const username = user.name || user.username || user.email || `user-${String(user.id || 'anon')}`;

  if (typeof message !== 'string' || !message.trim() || message.trim().length > 800) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const lower = message.trim().toLowerCase();
  if (username.toLowerCase().includes('bot') || lower.startsWith('[system]') || lower.includes('<script')) {
    return res.status(400).json({ error: 'Message rejected' });
  }

  const msg = { id: Date.now(), username: String(username), message: message.trim(), timestamp: Date.now() };
  chatMessages.push(msg);
  if (chatMessages.length > 1000) chatMessages.shift();

  broadcastChatMessage(msg);
  return res.status(201).json(msg);
});

app.get('/api/chat/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write(':ok\n\n');
  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

app.get('/api/chat/recent', (req, res) => {
  const limit = Math.min(200, Number(req.query.limit || 100));
  const tz = typeof req.query.tz === 'string' && req.query.tz ? req.query.tz : 'UTC';

  const recent = chatMessages.slice(-limit).map((m) => {
    let formatted = new Date(m.timestamp).toISOString();
    try {
      formatted = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date(m.timestamp));
    } catch (_) {
      // fallback
    }
    return { ...m, timeFormatted: formatted };
  });
  res.json(recent);
});

// Serve static files from dist
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = Number(process.env.PORT || 4000);

const startServer = (listenPort) => {
  const server = app.listen(listenPort, () => {
    console.log(`Auth server running on port ${listenPort}`);
  });

  server.on('error', (error) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {
      console.log(`Auth server port ${listenPort} is already in use. Continuing with the existing server.`);
      setInterval(() => undefined, 60000);
      return;
    }

    console.error(error);
    process.exit(1);
  });
};

startServer(port);
