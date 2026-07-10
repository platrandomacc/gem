import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageTransition } from '../components/ui/PageTransition';
import { getGameBySlug } from '../data/content';

export default function GamePlayPage() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const game = gameSlug ? getGameBySlug(gameSlug) : undefined;

  useEffect(() => {
    if (!game) return;

    const stored = window.localStorage.getItem('recent-played-games');
    const current = stored ? (JSON.parse(stored) as Array<{ slug: string; title: string; provider: string; image: string; lastPlayed: number }>) : [];
    const updated = [
      { slug: game.slug, title: game.title, provider: game.provider, image: game.image, lastPlayed: Date.now() },
      ...current.filter((item) => item.slug !== game.slug),
    ].slice(0, 5);
    window.localStorage.setItem('recent-played-games', JSON.stringify(updated));
  }, [game]);

  if (!game) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center text-white">
        <h1 className="text-3xl font-semibold">Game not found</h1>
        <p className="mt-3 text-sm text-[#8D95A8]">That game does not exist or is not available yet.</p>
      </div>
    );
  }

  const handleBackToInfo = () => {
    if (!gameSlug) return;
    navigate(`/games/info/${gameSlug}`);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card className="border-transparent p-6">
          <div className="space-y-6">
            <div className="rounded-[24px] border border-transparent bg-[#0E121A] p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-[20px] border border-white/10 bg-[#12141B]">
                  <img src={game.image} alt={game.title} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[#3B82F6]">Now playing</p>
                  <h1 className="mt-2 text-3xl font-semibold text-white">{game.title}</h1>
                  <p className="mt-2 text-sm text-[#8D95A8]">{game.provider} • RTP {game.rtp}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-transparent bg-[#0B111A] p-6">
              <p className="text-sm text-[#B7BDCB]">Your game session is ready. Continue playing in the embedded experience below.</p>
              <div className="mt-6 rounded-[24px] border border-white/10 bg-[#111821]/90 p-6">
                <div className="h-80 rounded-[20px] bg-[#0D1116] text-center text-sm text-[#8D95A8] flex items-center justify-center">
                  <p>Game frame placeholder for {game.title}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="w-full sm:w-auto">Restart</Button>
                <Button variant="secondary" onClick={handleBackToInfo} className="w-full sm:w-auto">Back to info</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
