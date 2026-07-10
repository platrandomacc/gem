import { useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { PageTransition } from '../components/ui/PageTransition';
import { GameControls } from '../components/hilo/GameControls';
import { HiloCard } from '../components/hilo/Card';
import { History } from '../components/hilo/History';
import { PredictionButtons } from '../components/hilo/PredictionButtons';
import { useHilo } from '../hooks/useHilo';

export default function HiloPage() {
  const {
    betAmount,
    setBetAmount,
    status,
    currentCard,
    currentMultiplier,
    potentialPayout,
    profit,
    error,
    history,
    cashoutSummary,
    isAnimating,
    canStart,
    canPredict,
    canCashOut,
    canSkip,
    startGame,
    choosePrediction,
    skipCard,
    cashOut,
    dismissCashoutSummary,
    resetGame,
    halfBet,
    doubleBet,
    higherChance,
    lowerChance,
    higherMultiplier,
    lowerMultiplier,
  } = useHilo();

  useEffect(() => {
    if (!cashoutSummary) return;
    const timer = window.setTimeout(() => {
      dismissCashoutSummary();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [cashoutSummary, dismissCashoutSummary]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
        <div className="space-y-2 rounded-[24px] border border-[#00F5FF]/15 bg-[#071520] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.32em] text-[#00F5FF] font-bold">Table game</p>
            <h1 className="text-3xl font-black text-white">Hi-Lo</h1>
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <Card className="rounded-[18px] border border-white/10 bg-[#071520] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-bold">Live draw</p>
                  </div>
                </div>

                <div className="relative flex justify-center">
                  <HiloCard card={currentCard} size="small" />
                  {/* Skip button on the edge of draw card for mobile */}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 xl:hidden">
                    <button
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-[#111821] text-sm text-white hover:opacity-90"
                      onClick={skipCard}
                      disabled={!canSkip}
                    >
                      Skip
                    </button>
                  </div>
                  {/* Desktop skip is hidden; desktop has skip removed from controls */}
                </div>

                <div className="space-y-2">
                  <div className="rounded-[14px] border border-white/10 bg-[#0D1116] p-2">
                    <History history={history} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <GameControls
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              stake={status === 'playing' ? betAmount : 0}
              currentMultiplier={currentMultiplier}
              potentialPayout={potentialPayout}
              profit={profit}
              status={status}
              error={error}
              isAnimating={isAnimating}
              canStart={canStart}
              canPredict={canPredict}
              canCashOut={canCashOut}
              higherChance={higherChance}
              lowerChance={lowerChance}
              higherMultiplier={higherMultiplier}
              lowerMultiplier={lowerMultiplier}
              onPredict={choosePrediction}
              onStart={startGame}
              onCashOut={cashOut}
              onHalf={halfBet}
              onDouble={doubleBet}
            />
          </div>
        </div>
      </div>

      <Modal open={Boolean(cashoutSummary)} onClose={dismissCashoutSummary} closeButton={false} compact>
        <div className="space-y-3">
          <div className="rounded-[18px] border border-[#00F5FF]/20 bg-[#071520] p-4 text-center shadow-[0_0_20px_rgba(0,245,255,0.15)]">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-black">Cashout Success</p>
            <p className="mt-2 text-3xl font-black text-white">${(cashoutSummary?.payout ?? 0).toFixed(2)}</p>
          </div>

          <div className="grid gap-2">
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#00F5FF] font-bold">Multiplier</p>
              <p className="mt-1 text-lg font-black text-white">{cashoutSummary ? `${cashoutSummary.multiplier.toFixed(2)}×` : '0.00×'}</p>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#00F5FF] font-bold">Cards drawn</p>
              <p className="mt-1 text-lg font-black text-white">{cashoutSummary?.cardsDrawn ?? 0}</p>
            </div>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
