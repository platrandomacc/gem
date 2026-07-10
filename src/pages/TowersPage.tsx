import { useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { BetButton } from '../components/ui/BetButton';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { PageTransition } from '../components/ui/PageTransition';
import { DifficultyDropdown } from '../components/DifficultyDropdown';
import { BetInput } from '../components/BetInput';
import { AutoModeToggle } from '../components/AutoModeToggle';
import { TowerGrid } from '../components/TowerGrid';
import { useTowerGame } from '../hooks/useTowerGame';
import { difficultyModes } from '../utils/multipliers';

export default function TowersPage() {
  const {
    balance,
    bet,
    setBet,
    betError,
    difficulty,
    setDifficulty,
    difficultyMode,
    mode,
    tower,
    currentFloor,
    status,
    message,
    currentMultiplier,
    nextFloorMultiplier,
    payout,
    soundSrc,
    resultSummary,
    startGame,
    climb,
    revealTile,
    cashOut,
    resetRound,
    dismissResult,
    canStart,
    canClimb,
    canCashOut,
    setMode,
    halfBet,
    doubleBet,
  } = useTowerGame();

  useEffect(() => {
    if (!resultSummary) return;
    const timer = window.setTimeout(() => {
      dismissResult();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [resultSummary, dismissResult]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-3 py-5 min-h-[calc(100vh-6rem)] sm:px-4 sm:py-6">
        <div className="mb-4">
        </div>
        <div className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr] items-start">
          <section className="space-y-4 flex flex-col">
            <Card hover={false} className="p-3 bg-[#071520] border-white/10">
              <div className="space-y-2 flex flex-col h-full">
                {tower.length > 0 ? (
                  <div className="flex-1 min-h-0">
                    <TowerGrid
                      floors={tower}
                      currentFloor={currentFloor}
                      status={status}
                      soundSrc={soundSrc}
                      onSelectTile={(floorId, tileId) => {
                        if (floorId === currentFloor + 1) revealTile(tileId);
                      }}
                    />
                  </div>
                ) : (
                  <div className="rounded-[18px] border border-dashed border-[#00F5FF]/25 bg-[#03080C]/40 p-8 text-center text-sm text-[#7DD3FC]/70">
                    <p>Start a run to reveal the floors and begin your climb.</p>
                  </div>
                )}
              </div>
            </Card>

            {/* tower map moved above; this card previously held the board */}
          </section>

          <aside className="space-y-3 pr-0 sm:pr-2">
            <Card hover={false} className="p-3 bg-[#071520] border-white/10">
              <div className="grid gap-3">
                <div className="space-y-2">
                  <div className="rounded-[20px] border border-white/5 bg-[#0C202F] p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <BetButton
                        amount={bet}
                        onClick={startGame}
                        disabled={!canStart}
                        className={`w-full py-5 rounded-[16px] text-sm font-bold tracking-wide transition-all duration-200 ${
                          canStart
                            ? 'shadow-[0_8px_25px_rgba(0,245,255,0.25)] hover:shadow-[0_12px_35px_rgba(0,245,255,0.45)]'
                            : 'cursor-not-allowed opacity-50'
                        }`}
                      />
                      <Button
                        onClick={cashOut}
                        disabled={!canCashOut}
                        variant={canCashOut ? 'primary' : 'secondary'}
                        className={`w-full h-11 min-h-11 px-5 py-0 text-sm font-bold tracking-wide transition-all duration-300 rounded-[16px] ${
                          canCashOut
                            ? 'bg-gradient-to-r from-[#00F5FF] via-[#14B8A6] to-[#00F5FF] text-[#03080C] font-black shadow-[0_0_30px_rgba(0,245,255,0.55)] hover:shadow-[0_0_45px_rgba(0,245,255,0.7)] hover:scale-[1.04] border-none animate-pulse'
                            : 'cursor-not-allowed opacity-40'
                        }`}
                      >
                        {canCashOut ? (
                          <span className="flex flex-col items-center justify-center line-height-[1.1]">
                            <span className="text-[10px] uppercase tracking-widest opacity-90">Instant Cashout</span>
                            <span className="text-xs font-black">${payout.toFixed(2)} ({currentMultiplier.toFixed(2)}×)</span>
                          </span>
                        ) : (
                          'Cashout'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-[20px] border border-white/10 bg-[#03080C]/80 p-3.5">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#00F5FF] font-black">Difficulty Settings</p>
                    <div className="mt-2">
                      <DifficultyDropdown value={difficulty} onChange={setDifficulty} />
                    </div>
                  </div>

                  <div>
                    <BetInput value={bet} onChange={setBet} onHalf={halfBet} onDouble={doubleBet} error={betError} />
                  </div>
                </div>
              </div>
            </Card>

          </aside>
        </div>
      </div>

      <Modal open={Boolean(resultSummary)} onClose={dismissResult} closeButton={false} compact>
        <div className="space-y-3">
          <div className="rounded-[18px] border border-[#00F5FF]/20 bg-[#071520] p-4 text-center shadow-[0_0_20px_rgba(0,245,255,0.15)]">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-black">Payout</p>
            <p className="mt-2 text-3xl font-black text-white">${(resultSummary?.payout ?? 0).toFixed(2)}</p>
          </div>

          <div className="grid gap-2">
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#00F5FF] font-bold">Multiplier</p>
              <p className="mt-1 text-lg font-black text-white">{resultSummary ? `${resultSummary.multiplier.toFixed(2)}×` : '0.00×'}</p>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#00F5FF] font-bold">Tiles</p>
              <p className="mt-1 text-lg font-black text-white">{resultSummary?.tilesRevealed ?? 0}</p>
            </div>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
