import { Card } from '../components/ui/Card';
import { PageTransition } from '../components/ui/PageTransition';
import { Coin } from '../components/coinflip/Coin';
import { CoinControls } from '../components/coinflip/CoinControls';
import { CoinStats } from '../components/coinflip/CoinStats';
import { useCoinflip } from '../hooks/useCoinflip';

export default function CoinflipPage() {
  const {
    bet,
    setBet,
    selectedSide,
    setSelectedSide,
    status,
    result,
    message,
    error,
    stats,
    isFlipping,
    currentMultiplier,
    potentialPayout,
    canFlip,
    startFlip,
  } = useCoinflip();

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="mb-4 rounded-[24px] border border-[#00F5FF]/15 bg-[#071520] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-bold">Classic 50/50 Game</p>
            <h1 className="text-2xl font-black text-white sm:text-3xl mt-1">Coin Flip</h1>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-4">
            <Card className="border-white/5 p-4 sm:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#00F5FF] font-bold">LIVE COIN STAGE</p>
                </div>
                <Coin status={status} result={result} selectedSide={selectedSide} isFlipping={isFlipping} />
              </div>
            </Card>

            <CoinStats stats={stats} />
          </div>

          <div className="space-y-4">
            <CoinControls
              bet={bet}
              setBet={setBet}
              selectedSide={selectedSide}
              setSelectedSide={setSelectedSide}
              currentMultiplier={currentMultiplier}
              potentialPayout={potentialPayout}
              status={status}
              message={message}
              error={error}
              isFlipping={isFlipping}
              canFlip={canFlip}
              startFlip={startFlip}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
