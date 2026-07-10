import { ReactNode, useEffect, useState } from 'react';
import { Bell, ChevronDown, Crown, LogOut, ShieldCheck, Wallet, Send, Plus, Trophy, MessageSquare, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useWallet } from '../../hooks/useWallet';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Games', to: '/games' },
  { label: 'Leaderboards', to: '/leaderboards' },
  { label: 'VIP', to: '/vip' },
  { label: 'Wallet', to: '/wallet' },
];

function normalizeAvatarUrl(avatar?: string, discordId?: string) {
  if (!avatar) return '';
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  if (!discordId) return '';
  return `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png?size=256`;
}

export function Layout({ children }: LayoutProps) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [desktopChatOpen, setDesktopChatOpen] = useState(false);
  const [userName, setUserName] = useState('Player');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { balance, resetBalance, initialBalance } = useWallet();

  const walletDropdown = walletOpen ? (
    <div className="absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 w-[280px] sm:w-[340px] overflow-hidden rounded-[20px] border border-[#00F5FF]/20 bg-[#071520] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
      <div className="border-b border-white/10 px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3 text-[#A0A8BC]">
          <div className="flex h-9 sm:h-11 w-9 sm:w-11 items-center justify-center rounded-lg sm:rounded-2xl bg-[#00F5FF]/15 text-[#00F5FF] flex-shrink-0">
            <Wallet size={16} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-[#7DD3FC]/70">Wallet summary</p>
            <p className="mt-1 text-base sm:text-lg font-bold text-white">${balance.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="max-h-64 sm:max-h-72 overflow-y-auto px-2 sm:px-3 py-2 sm:py-3">
        <ul className="space-y-2 sm:space-y-3">
          {[
            { code: 'USDT', name: 'Tether', balance: '$524.20', image: '/images/usdt.png' },
            { code: 'BTC', name: 'Bitcoin', balance: '0.018 BTC', image: '/images/btc.png' },
            { code: 'ETH', name: 'Ethereum', balance: '0.24 ETH', image: '/images/eth.png' },
            { code: 'SOL', name: 'Solana', balance: '12.1 SOL', image: '/images/solona.png' },
            { code: 'LTC', name: 'Litecoin', balance: '3.05 LTC', image: '/images/ltc.png' },
          ].map((currency) => (
            <li key={currency.code}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[14px] sm:rounded-[18px] border border-transparent bg-[#0C202F] px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-white transition duration-175 ease-out hover:bg-[#00F5FF]/5 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-none bg-transparent sm:h-9 sm:w-9">
                    <img
                      src={currency.image}
                      alt={currency.code}
                      className="h-full w-full object-contain bg-transparent"
                    />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <p className="font-semibold text-white text-xs sm:text-sm">{currency.code}</p>
                    <p className="text-xs text-[#7DD3FC]/50">{currency.name}</p>
                  </div>
                </div>
                <span className="font-semibold text-white text-xs sm:text-sm flex-shrink-0 ml-2">{currency.balance}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/10 px-3 sm:px-4 py-3 sm:py-4">
        <button
          type="button"
          onClick={() => {
            resetBalance();
            setWalletOpen(false);
          }}
          className="w-full rounded-[16px] border border-[#00F5FF]/20 bg-[#0C202F] px-3 py-2 text-sm font-semibold text-white transition hover:border-[#00F5FF]/40 hover:bg-[#00F5FF]/10"
        >
          Reset balance to ${initialBalance.toFixed(2)}
        </button>
      </div>
    </div>
  ) : null;

  useEffect(() => {
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll && current > 80);
      lastScroll = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('flipbet-user');
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser) as { name?: string; email?: string; avatar?: string; discordId?: string };
      if (parsedUser.name) {
        setUserName(parsedUser.name);
      }
      if (parsedUser.avatar) {
        setAvatarUrl(normalizeAvatarUrl(parsedUser.avatar, parsedUser.discordId));
      }
      if (parsedUser.email) {
        setIsLoggedIn(true);
      }
    } catch {
      window.localStorage.removeItem('flipbet-user');
    }
  }, []);

  useEffect(() => {
    const handleRequireAuth = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      setAuthMode('login');
      setAuthOpen(true);
      setAuthMessage(customEvent.detail?.message || 'Please log in to play this game.');
    };

    window.addEventListener('require-auth', handleRequireAuth as EventListener);
    return () => window.removeEventListener('require-auth', handleRequireAuth as EventListener);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authType = params.get('auth');

    if (authType === 'discord') {
      const name = params.get('name') || 'Discord User';
      const email = params.get('email') || '';
      const discordId = params.get('id') || '';
      const avatar = params.get('avatar') || '';
      const nextUser = { name, email, discordId, avatar };
      window.localStorage.setItem('flipbet-user', JSON.stringify(nextUser));
      setUserName(name);
      setAvatarUrl(normalizeAvatarUrl(avatar, discordId));
      setIsLoggedIn(true);
      setAuthOpen(false);
      setAuthMessage('');
      const nextUrl = `${window.location.pathname}${window.location.hash}`;
      window.history.replaceState({}, '', nextUrl);
    }
  }, []);

  const handleDiscordLogin = (mode: 'login' | 'register' = 'login') => {
    setIsAuthenticating(true);
    setAuthMode(mode);
    setAuthMessage(mode === 'register' ? 'Redirecting you to Discord to create your account...' : 'Redirecting you to Discord for secure sign-in...');
    const frontendUrl = window.location.origin;
    const authUrl = new URL('/api/discord/login', frontendUrl);
    authUrl.searchParams.set('frontend', frontendUrl);
    authUrl.searchParams.set('mode', mode);
    window.location.href = authUrl.toString();
  };

  const handleLogout = () => {
    window.localStorage.removeItem('flipbet-user');
    setIsLoggedIn(false);
    setUserName('Player');
    setAvatarUrl('');
    setAuthMessage('');
  };

  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const fetchChat = async () => {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch chat', err);
    }
  };

  useEffect(() => {
    fetchChat();
    const chatInterval = setInterval(fetchChat, 2500);
    return () => {
      clearInterval(chatInterval);
    };
  }, []);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const userPayload = {
      level: isLoggedIn ? 42 : 1,
      username: userName,
      message: userMessage,
      color: isLoggedIn ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#14B8A6]/10 text-[#00F5FF] border-[#00F5FF]/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    };

    setUserMessage('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });
      if (res.ok) {
        fetchChat();
      }
    } catch (err) {
      console.error('Failed to send chat', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#02070f] text-white">
      {/* LEFT SIDEBAR - Desktop */}
      {desktopChatOpen ? (
        <aside className="hidden lg:flex flex-col w-[320px] bg-[#030c16] border-r border-white/5 p-4 sticky top-0 h-screen overflow-y-auto shrink-0 select-none">
          {/* FLIPBET Logo */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <span className="text-xl font-black uppercase tracking-[0.15em] text-white">
            FLIP<span className="text-[#00F5FF] filter drop-shadow-[0_0_8px_rgba(0,245,255,0.7)]">B</span>ET
          </span>
          <span className="rounded-full bg-[#9EFF00]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#9EFF00] border border-[#9EFF00]/20">
            PRO
          </span>
        </div>

        {/* Lobby Chat Widget (Taller now that rain pot is removed) */}
        <div className="flex flex-col rounded-2xl border border-white/5 bg-[#081522] p-4 h-[calc(100vh-100px)] shadow-md">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#7DD3FC]/70">
              <MessageSquare size={18} className="text-[#00F5FF]" />
              <span>Lobby Chat</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-black text-[#9EFF00] uppercase tracking-wider bg-[#9EFF00]/10 px-2 py-0.5 rounded-full border border-[#9EFF00]/20">
              <span className="h-1.5 w-1.5 bg-[#9EFF00] rounded-full animate-ping" />
              Live
            </span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-3.5 text-xs scrollbar-thin">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${msg.color}`}>
                      {msg.level}
                    </span>
                    <span className="font-bold text-white/95">{msg.username}</span>
                  </div>
                  <span className="text-[9px] text-white/30 font-mono">{msg.time}</span>
                </div>
                <p className="pl-1.5 text-white/70 leading-relaxed font-medium break-all">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChat} className="pt-2 border-t border-white/5 flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="flex-1 h-10 rounded-xl border border-white/10 bg-[#01060b] px-3.5 text-xs text-white outline-none focus:border-[#00F5FF]/50 transition placeholder-white/20"
            />
            <button
              type="submit"
              className="h-10 w-10 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 hover:bg-[#00F5FF]/20 text-[#00F5FF] flex items-center justify-center transition"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </aside>
      ) : null}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#02070f]">
        <header className={`sticky top-0 z-50 transition-transform duration-175 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
          <div className="mx-auto flex w-full items-center justify-between gap-2 border-b border-white/5 bg-[#030c16]/90 px-4 py-3.5 shadow-lg backdrop-blur sm:gap-4 md:px-6">
            
            {/* Logo / Title (Visible on Mobile) */}
            <div className="flex items-center gap-2 lg:hidden">
              <span className="text-lg font-black uppercase tracking-[0.15em] text-white">
                FLIP<span className="text-[#00F5FF]">B</span>ET
              </span>
            </div>



            {/* Nav links */}
            <nav className="hidden items-center gap-1.5 lg:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-1.5 text-xs font-black tracking-wider uppercase transition ${
                      isActive 
                        ? 'bg-[#00F5FF]/15 text-[#00F5FF] shadow-[inset_0_0_0_1px_rgba(0,245,255,0.2)]' 
                        : 'text-[#7DD3FC]/70 hover:bg-white/[0.04] hover:text-[#00F5FF]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Wallet & Auth status */}
            <div className="flex items-center gap-2">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMenuOpen((state) => !state)}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#081522] text-white transition hover:border-[#00F5FF]/40"
              >
                <ChevronDown size={18} className="transition" style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Desktop chat toggle */}
              <button
                type="button"
                onClick={() => setDesktopChatOpen((state) => !state)}
                className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#081522] text-white transition hover:border-[#00F5FF]/40"
                aria-label="Toggle chat"
              >
                {desktopChatOpen ? <X size={18} /> : <MessageSquare size={18} />}
              </button>

              {/* Wallet block */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setWalletOpen((state) => !state)}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#00F5FF]/20 bg-[#081522] px-3 text-xs text-white transition hover:border-[#00F5FF]/40"
                >
                  <Wallet size={14} className="text-[#00F5FF]" />
                  <span className="font-bold">${balance.toFixed(2)}</span>
                  <ChevronDown size={12} className="text-[#7DD3FC]/50 transition" style={{ transform: walletOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {walletDropdown}
              </div>

              {/* Logged in vs Guest */}
              {isLoggedIn ? (
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#00F5FF]/20 bg-[#081522] p-1.5 pr-3 text-xs text-white">
                  <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#14B8A6] to-[#00F5FF]">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-[#03080C]">{userName.slice(0, 2)}</span>
                    )}
                  </div>
                  <span className="font-bold text-[#E2F8FF] max-w-[80px] truncate">{userName}</span>
                  <button type="button" onClick={handleLogout} className="rounded-full p-1 text-[#7DD3FC]/60 transition hover:bg-white/[0.06] hover:text-white" aria-label="Logout">
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="h-9 px-3.5 text-xs rounded-xl border border-[#00F5FF]/20 text-white font-bold"
                    onClick={() => handleDiscordLogin('login')}
                  >
                    Login
                  </Button>
                  <button
                    onClick={() => handleDiscordLogin('register')}
                    className="h-9 px-4 rounded-xl bg-[#9EFF00] hover:bg-[#8EEF00] text-[#03080C] text-xs font-black tracking-widest uppercase transition shadow-[0_0_15px_rgba(158,255,0,0.3)] hover:scale-[1.02]"
                  >
                    SIGN
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile responsive navigation dropdown */}
          {menuOpen ? (
            <div className="lg:hidden border-t border-white/5 bg-[#030c16]/95 px-4 py-3 space-y-3 shadow-xl">
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-2 text-xs font-bold transition ${
                        isActive ? 'bg-[#081522] text-[#00F5FF]' : 'text-[#7DD3FC]/70 hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>


            </div>
          ) : null}
        </header>

        {/* Modal block */}
        <Modal
          open={authOpen}
          title={authMode === 'login' ? 'Welcome back' : 'Create your account'}
          onClose={() => setAuthOpen(false)}
        >
          <div className="flex rounded-full border border-white/10 bg-[#0C202F] p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthMessage('');
              }}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-bold transition ${authMode === 'login' ? 'bg-[#00F5FF] text-[#03080C]' : 'text-[#7DD3FC]/70'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthMessage('');
              }}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-bold transition ${authMode === 'register' ? 'bg-[#00F5FF] text-[#03080C]' : 'text-[#7DD3FC]/70'}`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-[18px] border border-[#00F5FF]/20 bg-[#071520] p-4 text-sm text-[#7DD3FC]">
              <div className="flex items-center gap-2 text-[#00F5FF]">
                <ShieldCheck size={16} />
                <span className="font-bold">Secure Discord sign-in</span>
              </div>
              <p className="mt-2 leading-6">
                {authMode === 'login'
                  ? 'Use your Discord account to sign in to FLIPBET instantly.'
                  : 'Use Discord to create your account and jump straight into your wallet and VIP access.'}
              </p>
            </div>

            <Button fullWidth onClick={() => handleDiscordLogin(authMode)} disabled={isAuthenticating}>
              {isAuthenticating ? 'Redirecting...' : 'Continue with Discord'}
            </Button>

            {authMessage ? <p className="text-sm text-[#7DD3FC]/70">{authMessage}</p> : null}
          </div>
        </Modal>

        {/* Page Children render */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#030c16]/40 px-6 py-8 text-xs text-[#8D95A8] mt-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-black tracking-[0.18em] text-white">
                FLIP<span className="text-[#00F5FF]">B</span>ET
              </p>
              <p className="mt-1 text-xs text-[#7DD3FC]/50">Best Crypto Casino Out There.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-bold">
              <a href="/responsible-gambling" className="transition hover:text-white">Responsible Gambling</a>
              <a href="/support" className="transition hover:text-white">Support Helpdesk</a>
            </div>
          </div>
        </footer>
      </div>

      {/* MOBILE FLOATING CHAT BUTTON */}
      <button
        type="button"
        onClick={() => setMobileChatOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#00F5FF] text-[#03080C] shadow-[0_4px_24px_rgba(0,245,255,0.55)] transition hover:scale-[1.08] active:scale-95"
        id="floating-mobile-chat-btn"
      >
        <MessageSquare size={30} />
      </button>

      {/* MOBILE CHAT DRAWER */}
      {mobileChatOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileChatOpen(false)} />
          
          {/* Drawer content */}
          <div className="relative w-80 max-w-[90%] bg-[#030c16] h-full p-4 flex flex-col border-l border-white/10">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2">
              <span className="text-sm font-black uppercase tracking-wider text-white">Lobby Chat</span>
              <button
                type="button"
                onClick={() => setMobileChatOpen(false)}
                className="text-xs font-bold text-white/40 hover:text-white px-2 py-1 rounded bg-white/5"
              >
                Close
              </button>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 py-2 scrollbar-thin">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border ${msg.color}`}>
                        {msg.level}
                      </span>
                      <span className="font-bold text-white/95 text-xs">{msg.username}</span>
                    </div>
                    <span className="text-[8px] text-white/30 font-mono">{msg.time}</span>
                  </div>
                  <p className="pl-1.5 text-white/70 text-xs leading-relaxed font-medium break-all">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSendChat} className="pt-2 border-t border-white/5 flex gap-2">
              <input
                type="text"
                placeholder="Type message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="flex-1 h-10 rounded-xl border border-white/10 bg-[#01060b] px-3 text-xs text-white outline-none focus:border-[#00F5FF]/50"
              />
              <button
                type="submit"
                className="h-10 w-10 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 hover:bg-[#00F5FF]/20 text-[#00F5FF] flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
