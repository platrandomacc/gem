import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // Global chat in-memory storage
  interface ChatMessage {
    id: number;
    level: number;
    username: string;
    message: string;
    time: string;
    color: string;
  }
  const globalChatMessages: ChatMessage[] = [];

  app.get('/api/chat', (req, res) => {
    res.json(globalChatMessages);
  });

  app.post('/api/chat', (req, res) => {
    const { level, username, message, color } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).send('Message is empty');
    }
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMessage: ChatMessage = {
      id: Date.now(),
      level: Number(level) || 1,
      username: String(username || 'Guest'),
      message: String(message).slice(0, 200), // Limit character length
      time: timeStr,
      color: String(color || 'bg-gray-500/10 text-gray-400 border-gray-500/20')
    };
    globalChatMessages.push(newMessage);
    if (globalChatMessages.length > 100) {
      globalChatMessages.shift();
    }
    res.status(201).json(newMessage);
  });

  // Relax CSP for development and direct deployment in AI Studio
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: ws: wss: *; connect-src 'self' ws: wss: *; img-src 'self' data: https://cdn.discordapp.com https://media.discordapp.net *;"
    );
    next();
  });

  // Discord OAuth Login
  app.get('/api/discord/login', (req, res) => {
    const frontendUrl = req.query.frontend;
    const mode = req.query.mode;
    
    // In AI Studio, we want to default redirect to the current request's host/origin rather than localhost:5173
    const host = req.get('host');
    const protocol = req.secure ? 'https' : 'http';
    const defaultRedirect = `${protocol}://${host}`;
    
    const redirectTo = frontendUrl && typeof frontendUrl === 'string'
      ? frontendUrl
      : defaultRedirect;

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

  // Discord OAuth Callback
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

      const tokenData: any = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error('Failed to get Discord access token.');
      }

      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user: any = await userResponse.json();

      const host = req.get('host');
      const protocol = req.secure ? 'https' : 'http';
      const defaultRedirect = `${protocol}://${host}`;
      
      const redirectTarget = state ? decodeURIComponent(String(state)) : defaultRedirect;
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

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 3000);
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });

  server.on('error', (error: any) => {
    if (error && typeof error === 'object' && error.code === 'EADDRINUSE') {
      console.log(`Server port ${port} is already in use.`);
      return;
    }
    console.error(error);
    process.exit(1);
  });
}

startServer();
