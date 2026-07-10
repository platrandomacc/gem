import { Clock3, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { featuredgames, faqItems, GameEntry } from '../data/content';

interface RecentGame extends Pick<GameEntry, 'title' | 'slug' | 'provider' | 'image'> {
  lastPlayed: number;
}

export default function HomePage() {
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem('recent-played-games');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as RecentGame[];
      const sorted = parsed.slice().sort((a, b) => b.lastPlayed - a.lastPlayed);
      setRecentGames(sorted.slice(0, 3));
    } catch {
      window.localStorage.removeItem('recent-played-games');
    }
  }, []);

  const recentTitle = useMemo(() => {
    if (recentGames.length === 0) return 'No recent plays yet';
    return 'Resume your latest games';
  }, [recentGames]);

  const formatLastPlayed = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes <= 0) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <section>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[24px] border border-[#00F5FF]/15 bg-[radial-gradient(circle_at_top_left,_rgba(0,245,255,0.15),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.15),_transparent_30%),linear-gradient(135deg,#071520_0%,#0C202F_60%,#03080C_100%)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:p-6 md:p-8"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#00F5FF] font-bold">
            <Sparkles size={16} className="animate-pulse" />
            LIVE AQUATIC ARENA ACTIVE
          </div>
          <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-white">
            A refined front row to premium gambling.
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#E2F8FF]/80">
            Discover live tables, elevated slots, and sharp sports markets with an electrified aqua experience built for modern players.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link to="/games" className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-2xl bg-gradient-to-r from-[#00F5FF] via-[#14B8A6] to-[#00D8F6] px-6 text-sm font-black text-[#03080C] transition duration-200 ease-out hover:scale-[1.02] shadow-[0_8px_25px_rgba(0,245,255,0.35)]">
              Explore Games
            </Link>
            <Link to="/vip" className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-2xl border border-[#00F5FF]/20 bg-[#0C202F] px-5 text-sm font-bold text-white transition duration-200 ease-out hover:border-[#00F5FF]/40 hover:bg-[#0C202F]/80 hover:scale-[1.02]">
              View VIP Status
            </Link>
          </div>
          <div className="mt-6 sm:mt-10 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-[#7DD3FC]/70">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">24/7 Live Dealers</div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Rapid Withdrawals</div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Protected Play Tools</div>
          </div>
        </motion.div>
      </section>

      <section>
        <SectionHeading title="Originals" subtitle="A curated mix of premium titles and live table energy" action={<Button variant="ghost" className="px-0 text-xs sm:text-sm">Browse all</Button>} />

        <div className="md:hidden">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrolling-touch">
            {featuredgames.map((game, index) => (
              <Link key={game.title} to={`/games/info/${game.slug}`} className="min-w-[45%] sm:min-w-[35%] snap-center overflow-hidden rounded-[10px] sm:rounded-[12px] border border-transparent hover:border-[#00F5FF]/40 bg-[#071520]">
                <div className={`relative aspect-[4/5]`}>
                  <img src={game.image} alt={game.title} className="h-full w-full object-contain object-center transition-transform duration-200 ease-out" style={{ willChange: 'transform, opacity' }} />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-2 text-center text-xs text-[#7DD3FC]/70">Swipe to explore</div>
        </div>

        <div className="hidden md:grid gap-2 sm:gap-3 md:grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))]">
          {featuredgames.map((game, index) => (
            <motion.article key={game.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="relative group overflow-hidden rounded-[12px] border border-white/5 hover:border-[#00F5FF]/40 bg-[#071520] shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all">
              <div className={`relative aspect-[4/5] bg-gradient-to-br ${game.accent}`}>
                <img src={game.image} alt={game.title} className="h-full w-full object-contain object-center mix-blend-screen transition-transform duration-200 ease-out group-hover:scale-[1.04]" style={{ willChange: 'transform, opacity' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03080C] to-transparent" />
                <div className="absolute left-3 sm:left-4 top-3 sm:top-4 rounded-full border border-transparent bg-[#03080C]/90 px-2.5 sm:px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00F5FF]">{game.category}</div>
              </div>
              <Link to={`/games/info/${game.slug}`} aria-label={`Open ${game.title}`} className="absolute inset-0 z-10" />
              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">{game.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#7DD3FC]/60 truncate">{game.provider}</p>
                  </div>
                  <div className="rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-[#10B981] flex-shrink-0">{game.rtp}</div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[#7DD3FC]/70">
                  <Clock3 size={12} className="sm:w-4 sm:h-4 text-[#00F5FF]" />
                  <span className="hidden sm:inline">20 min avg.</span>
                  <span className="sm:hidden">8m</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section>
        <Card className="bg-[#071520] border-white/10">
          <SectionHeading title="Recently played" subtitle={recentTitle} />
          <div className="space-y-2 sm:space-y-3">
            {recentGames.length > 0 ? (
              recentGames.map((game) => (
                <div key={game.slug} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-[12px] sm:rounded-[16px] border border-white/5 hover:border-[#00F5FF]/30 bg-[#0C202F] px-3 sm:px-4 py-3 sm:py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-14 w-14 overflow-hidden rounded-[14px] border border-white/10 bg-[#03080C]">
                      <img src={game.image} alt={game.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm sm:text-base truncate">{game.title}</p>
                      <p className="text-xs sm:text-sm text-[#7DD3FC]/60 truncate">{game.provider}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#00F5FF] font-bold">Last played {formatLastPlayed(game.lastPlayed)}</p>
                    </div>
                  </div>
                  <Link to={`/games/${game.slug}`} className="inline-flex h-10 items-center justify-center rounded-full bg-[#00F5FF] hover:bg-[#00D8F6] px-5 text-xs font-black uppercase tracking-[0.24em] text-[#03080C] transition duration-150 sm:w-auto w-full text-center">
                    Resume
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-[#00F5FF]/20 bg-[#03080C]/40 p-6 text-center text-sm text-[#7DD3FC]/70">
                <p className="text-white">Your recent plays will appear here once you open a game.</p>
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="flex items-center justify-between rounded-[20px] sm:rounded-[24px] border border-[#00F5FF]/15 bg-[#071520] p-4 sm:p-6 md:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.18)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Leaderboards</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#7DD3FC]/70">Check weekly rankings and elite performance</p>
        </div>
        <Link to="/leaderboards" className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-5 text-sm font-bold text-[#00F5FF] transition duration-200 ease-out hover:border-[#00F5FF]/40 hover:bg-[#00F5FF]/20">
          View Rankings
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-[#071520] border-white/10">
          <SectionHeading title="Live performance" subtitle="Transparency at a glance" />
          <div className="grid gap-2 sm:gap-3 grid-cols-3">
            {[
              { label: 'Avg. RTP', value: '96.9%' },
              { label: 'Active tables', value: '128' },
              { label: 'Secure payouts', value: '99.2%' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[12px] sm:rounded-[16px] border border-white/5 bg-[#0C202F] p-2 sm:p-4 text-center">
                <p className="text-lg sm:text-2xl font-black text-[#00F5FF]">{stat.value}</p>
                <p className="mt-1 text-xs sm:text-sm text-[#7DD3FC]/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#071520] border-white/10">
          <SectionHeading title="Frequently asked questions" subtitle="Concise answers for a premium experience" />
          <div className="space-y-2 sm:space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="rounded-[12px] sm:rounded-[16px] border border-white/5 bg-[#0C202F] p-3 sm:p-4 group">
                <summary className="cursor-pointer list-none text-xs sm:text-sm font-bold text-white hover:text-[#00F5FF] transition">{item.question}</summary>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-[#7DD3FC]/70">{item.answer}</p>
              </details>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
