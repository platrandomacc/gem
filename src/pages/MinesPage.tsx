import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { GameControls } from '../components/mines/GameControls';
import { MineBoard } from '../components/mines/MineBoard';
import { useMines } from '../hooks/useMines';

export default function MinesPage() {
  const {
    betAmount,
    setBetAmount,
    mineCount,
    setMineCount,
    board,
    status,
    safePicks,
    multiplier,
    profit,
    canCashOut,
    betError,
    isLoading,
    resultSummary,
    history,
    payout,
    remainingTiles,
    previewMultiplier,
    previewPayout,
    riskLabel,
    totalSafeTiles,
    startGame,
    revealTile,
    explodedIndex,
    cashOut,
    resetRound,
    halfBet,
    doubleBet,
    dismissResult,
  } = useMines();

  useEffect(() => {
    if (!resultSummary) return;
    const timer = window.setTimeout(() => {
      dismissResult();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [resultSummary, dismissResult]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-6 lg:px-6">
        <div className="mb-4 rounded-[24px] border border-[#00F5FF]/15 bg-[#071520] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-bold">Arcade Game</p>
              <h1 className="text-2xl font-black text-white sm:text-3xl mt-1">Mines</h1>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3 sm:space-y-4">
            <Card hover={false} className="p-3 sm:p-5 border-white/10 bg-[#071520]">
              <div className="mb-3 flex flex-col gap-1.5 sm:mb-4 sm:gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold text-[#E2F8FF] sm:text-sm">5 × 5 Grid • {mineCount} Mines Hidden</p>
                </div>
                <div className="rounded-full border border-[#00F5FF]/20 bg-[#0C202F] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00F5FF] sm:px-4 sm:py-2">
                  {status === 'playing' ? `${safePicks} picked` : 'Ready to Climb'}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[240px] items-center justify-center rounded-[20px] border border-[#00F5FF]/10 bg-[#0C202F]/20 sm:min-h-[320px]"
                  >
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#00F5FF]/30 border-t-[#00F5FF] sm:h-12 sm:w-12" />
                      <p className="mt-3 text-xs font-bold text-[#00F5FF] sm:mt-4 sm:text-sm tracking-wide">PREPARING GRID…</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="board"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="overflow-hidden rounded-[20px] border border-[#00F5FF]/10 bg-[#03080C] p-2 sm:p-4"
                  >
                    <MineBoard board={board} onReveal={revealTile} disabled={status !== 'playing'} status={status} explodedIndex={explodedIndex} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <GameControls
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              mineCount={mineCount}
              setMineCount={setMineCount}
              betError={betError}
              previewMultiplier={previewMultiplier}
              previewPayout={previewPayout}
              riskLabel={riskLabel}
              canStart={status !== 'loading' && status !== 'playing'}
              isLoading={isLoading}
              onStart={startGame}
              canCashOut={canCashOut && safePicks > 0}
              cashoutAmount={payout}
              cashoutMultiplier={multiplier}
              onCashOut={cashOut}
              onHalfBet={halfBet}
              onDoubleBet={doubleBet}
            />
          </div>
        </div>
      </div>

      <Modal open={Boolean(resultSummary)} onClose={dismissResult} closeButton={false} compact>
        <div className="space-y-4">
          <div className="rounded-[18px] border border-[#00F5FF]/20 bg-[#071520] p-4 text-center shadow-[0_0_20px_rgba(0,245,255,0.15)]">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-bold">{resultSummary?.type === 'cashout' ? 'Cashout Payout' : 'Round ended'}</p>
            <p className="mt-2 text-3xl font-black text-white">${(resultSummary?.payout ?? 0).toFixed(2)}</p>
          </div>
          <div className="grid gap-2">
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3 flex justify-between items-center">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD3FC]/70 font-bold">Multiplier</p>
              <p className="text-base font-black text-[#00F5FF]">{resultSummary ? `${resultSummary.multiplier.toFixed(2)}×` : '0.00×'}</p>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3 flex justify-between items-center">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD3FC]/70 font-bold">Diamonds</p>
              <p className="text-base font-black text-white">{resultSummary?.safePicks ?? 0}</p>
            </div>
          </div>
        </div>
      </Modal>

    </PageTransition>
  );
}
