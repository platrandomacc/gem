import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageTransition } from '../components/ui/PageTransition';
import { getGameBySlug } from '../data/content';

export default function GameInfoPage() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const game = gameSlug ? getGameBySlug(gameSlug) : undefined;

  const handlePlayNow = () => {
    if (!gameSlug) return;
    if (gameSlug === 'towers') {
      navigate('/games/towers');
      return;
    }
    if (gameSlug === 'mines') {
      navigate('/games/mines');
      return;
    }
    navigate(`/games/${gameSlug}`);
  };

  if (!game) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center text-white">
        <h1 className="text-3xl font-semibold">Game not found</h1>
        <p className="mt-3 text-sm text-[#8D95A8]">That game does not exist or is not available yet.</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card className="border-transparent p-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_0.7fr] lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[24px] border border-transparent bg-[#0E121A] p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-[20px] border border-white/10 bg-[#12141B]">
                    <img src={game.image} alt={game.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#3B82F6]">{game.category}</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">{game.title}</h1>
                    <p className="mt-2 text-sm text-[#8D95A8]">{game.provider} • RTP {game.rtp}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] border border-transparent bg-[#0B111A] p-6">
                <p className="text-sm text-[#B7BDCB]">Open your session and get straight into the action.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button onClick={handlePlayNow} className="w-full sm:w-auto">Bet</Button>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-transparent bg-[#0B111A] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[#3B82F6]">Session details</p>
              <div className="mt-4 space-y-3 text-sm text-[#B7BDCB]">
                <div className="rounded-[18px] border border-white/10 bg-[#12141B] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8D95A8]">Provider</p>
                  <p className="mt-1 font-medium text-white">{game.provider}</p>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-[#12141B] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8D95A8]">RTP</p>
                  <p className="mt-1 font-medium text-white">{game.rtp}</p>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-[#12141B] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8D95A8]">Category</p>
                  <p className="mt-1 font-medium text-white">{game.category}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
