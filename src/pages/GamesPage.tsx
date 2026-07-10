import { Filter, Heart, Search, SlidersHorizontal, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { categories, featuredgames, providers } from '../data/content';

const categoryTabs = ['All', 'Favorites', ...categories];

export default function GamesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeProvider, setActiveProvider] = useState('All');
  const [sortBy, setSortBy] = useState<'Popular' | 'RTP' | 'New'>('Popular');
  const [favoriteTitles, setFavoriteTitles] = useState<string[]>([]);

  const toggleFavorite = (event: React.MouseEvent<HTMLButtonElement>, title: string) => {
    event.stopPropagation();
    event.preventDefault();
    setFavoriteTitles((current) => {
      const next = current.includes(title) ? current.filter((item) => item !== title) : [...current, title];
      window.localStorage.setItem('favorite-games', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const storedFavorites = window.localStorage.getItem('favorite-games');
    if (!storedFavorites) return;

    try {
      const parsed = JSON.parse(storedFavorites) as string[];
      if (Array.isArray(parsed)) {
        setFavoriteTitles(parsed);
      }
    } catch {
      window.localStorage.removeItem('favorite-games');
    }
  }, []);

  const filteredGames = useMemo(() => {
    const list = featuredgames.map((game) => ({ ...game, favorite: favoriteTitles.includes(game.title) }));
    const query = search.toLowerCase();
    return list
      .filter((game) => {
        if (activeCategory === 'All') return true;
        if (activeCategory === 'Favorites') return game.favorite;
        return game.category.includes(activeCategory);
      })
      .filter((game) => (activeProvider === 'All' ? true : game.provider === activeProvider))
      .filter((game) => game.title.toLowerCase().includes(query) || game.provider.toLowerCase().includes(query))
      .sort((a, b) => {
        if (sortBy === 'RTP') return Number(b.rtp.replace('%', '')) - Number(a.rtp.replace('%', ''));
        if (sortBy === 'New') return b.title.localeCompare(a.title);
        return 0;
      });
  }, [activeCategory, activeProvider, favoriteTitles, search, sortBy]);

  return (
    <div className="space-y-6">
      <Card className="border-[#00F5FF]/15 bg-[#071520] p-4 shadow-[0_12px_45px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#00F5FF] font-black">Lobby</p>
            <h1 className="mt-2 text-3xl font-black text-white">Curated Games and Tables</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0C202F] px-3 py-2 text-sm text-[#7DD3FC]/70">
            <Search size={16} className="text-[#00F5FF]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search games" placeholder="Search titles or providers" className="w-56 bg-transparent outline-none text-white placeholder-[#7DD3FC]/40" />
          </div>
        </div>
      </Card>

      <div className="sticky top-20 z-40 rounded-[20px] border border-[#00F5FF]/15 bg-[#03080C]/85 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === category ? 'bg-[#00F5FF] text-[#03080C] shadow-[0_0_20px_rgba(0,245,255,0.35)]' : 'bg-[#0C202F] text-[#7DD3FC]/70 hover:text-white'}`}>
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <select aria-label="Sort results" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'Popular' | 'RTP' | 'New')} className="rounded-full border border-white/10 bg-[#0C202F] px-4 py-2 text-sm text-white font-bold outline-none">
              <option value="Popular">Popular</option>
              <option value="RTP">Highest RTP</option>
              <option value="New">Newest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {['Live', 'Slots', 'Jackpots'].includes(activeCategory) && filteredGames.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#00F5FF]/20 bg-[#071520] p-10 text-center text-sm text-[#7DD3FC]/80 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <p className="text-sm uppercase tracking-[0.32em] text-[#00F5FF] font-black">{activeCategory}</p>
            <h2 className="mt-3 text-3xl font-black text-white">Coming soon</h2>
            <p className="mt-2 max-w-xl mx-auto text-[#7DD3FC]/70">We’re building the next generation of {activeCategory.toLowerCase()} experiences. Check back soon for live tables, jackpot action, and new premium content.</p>
          </div>
        ) : (
          <>
            <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-4 snap-x snap-mandatory scrolling-touch overflow-x-auto pb-1">
                {filteredGames.map((game) => (
                  <Link key={game.title} to={`/games/info/${game.slug}`} className="w-[150px] min-w-[150px] max-w-[150px] shrink-0 overflow-hidden rounded-[12px] border border-transparent hover:border-[#00F5FF]/40 bg-[#071520]">
                    <div className="aspect-[4/5]">
                      <img src={game.image} alt={game.title} className="h-full w-full object-cover transition-transform duration-200 ease-out" style={{ willChange: 'transform, opacity' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:grid gap-4 md:grid-cols-[repeat(auto-fit,_minmax(180px,_220px))] justify-items-center">
              {filteredGames.map((game) => (
                <Card key={game.title} className="relative flex h-full w-full max-w-[220px] flex-col rounded-[16px] p-3 border-white/5 bg-[#071520] hover:border-[#00F5FF]/30 transition-all">
                  <Link to={`/games/info/${game.slug}`} aria-label={`Open ${game.title}`} className="absolute inset-0 z-10" />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#00F5FF] font-black">{game.category}</p>
                      <h3 className="mt-2 text-base font-bold text-white leading-tight truncate max-w-[130px]">{game.title}</h3>
                    </div>
                    <button
                      aria-label={`${game.favorite ? 'Remove from' : 'Add to'} favorites ${game.title}`}
                      onClick={(event) => toggleFavorite(event, game.title)}
                      className={`relative z-20 rounded-full border border-transparent p-2 transition ${game.favorite ? 'bg-[#00F5FF]/15 text-[#00F5FF] hover:bg-[#00F5FF]/25' : 'bg-[#0C202F] text-[#7DD3FC]/70 hover:border-[#00F5FF]/30 hover:text-[#00F5FF]'}`}
                    >
                      <Heart size={15} fill={game.favorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="mt-3 aspect-[4/5] h-[180px] overflow-hidden rounded-[14px]">
                    <img src={game.image} alt={game.title} className="h-full w-full object-cover transition-transform duration-200 ease-out hover:scale-105" style={{ willChange: 'transform, opacity' }} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-[#7DD3FC]/60">
                    <span>{game.provider}</span>
                    <div className="flex items-center gap-1 text-[#00F5FF] font-bold">
                      <Star size={14} fill="currentColor" />
                      <span>4.9</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.28em] text-[#7DD3FC]/50">RTP</p>
                      <p className="text-xs font-bold text-[#10B981]">{game.rtp}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
