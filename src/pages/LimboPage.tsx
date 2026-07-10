import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { PageTransition } from '../components/ui/PageTransition';
import { BetControls } from '../components/limbo/BetControls';
import MultiplierDisplay from '../components/limbo/MultiplierDisplay';
import { Modal } from '../components/ui/Modal';
import { useLimbo } from '../hooks/useLimbo';
import { formatMultiplier } from '../utils/limboRandom';

export default function LimboPage() {
  const {
    balance,
    betAmount,
    setBetAmount,
    targetMultiplier,
    setTargetMultiplier,
    status,
    roundResult,
    history,
    stats,
    error,
    payoutPreview,
    profitPreview,
    canPlay,
    playRound,
    cashoutNow,
    cashoutSummary,
    dismissCashoutSummary,
    isRolling,
    seed,
    nonce,
    rollingMultiplier,
  } = useLimbo();

  useEffect(() => {
    if (!cashoutSummary) return;
    const t = setTimeout(() => dismissCashoutSummary(), 1000);
    return () => clearTimeout(t);
  }, [cashoutSummary, dismissCashoutSummary]);


  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4">
        <div className="space-y-2 rounded-[24px] border border-[#00F5FF]/15 bg-[#071520] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.32em] text-[#00F5FF] font-black">Instant Game</p>
            <h1 className="text-3xl font-black text-white">Limbo</h1>
            <p className="text-sm text-[#7DD3FC]/80">Place a bet and reveal the final multiplier.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.15fr]">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[22px] border border-white/10 bg-[#071520] p-5">
              <div className="flex items-center justify-between text-sm text-[#7DD3FC]/70">
                <span>Balance</span>
                <span className="font-bold text-white">${balance.toFixed(2)}</span>
              </div>
              <div className="mt-4">
                <div className="rounded-[16px] border border-white/10 bg-[#0C202F] p-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#00F5FF] font-black">Result</p>
                  <p className={`mt-2 text-lg font-bold ${roundResult?.won ? 'text-[#10B981]' : roundResult ? 'text-[#F87171]' : 'text-white'}`}>
                    {roundResult
                      ? formatMultiplier(roundResult.won ? roundResult.targetMultiplier : roundResult.rolledMultiplier)
                      : isRolling
                        ? 'Rolling…'
                        : '—'}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <MultiplierDisplay isRolling={isRolling} value={roundResult?.rolledMultiplier ?? rollingMultiplier ?? 1} resultValue={roundResult?.rolledMultiplier ?? undefined} status={status} won={roundResult?.won} />
              </div>
              <Modal open={Boolean(cashoutSummary)} onClose={dismissCashoutSummary} closeButton={false} compact>
                <div className="space-y-3">
                  <div className="rounded-[18px] border border-[#00F5FF]/20 bg-[#071520] p-4 text-center shadow-[0_0_20px_rgba(0,245,255,0.15)]">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-black">Cashout</p>
                    <p className="mt-2 text-3xl font-black text-white">${(cashoutSummary?.payout ?? 0).toFixed(2)}</p>
                  </div>

                  <div className="grid gap-2">
                    <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#00F5FF] font-bold">Multiplier</p>
                      <p className="mt-1 text-lg font-black text-white">{cashoutSummary ? `${cashoutSummary.multiplier.toFixed(2)}×` : '0.00×'}</p>
                    </div>
                  </div>
                </div>
              </Modal>
              {roundResult ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                   <div className="rounded-[16px] border border-white/5 bg-[#0C202F] p-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD3FC]/70">Profit / Loss</p>
                    <p className={`mt-2 text-lg font-semibold ${roundResult.profit >= 0 ? 'text-[#10B981]' : 'text-[#F87171]'}`}>
                      {roundResult.profit >= 0 ? '+' : ''}${roundResult.profit.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-white/5 bg-[#0C202F] p-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD3FC]/70">Cashout</p>
                    <p className="mt-2 text-lg font-semibold text-white">${roundResult.payout.toFixed(2)}</p>
                  </div>
                  <div className="rounded-[16px] border border-white/5 bg-[#0C202F] p-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD3FC]/70">Outcome</p>
                    <p className={`mt-2 text-lg font-semibold ${roundResult.won ? 'text-[#10B981]' : 'text-[#F87171]'}`}>{roundResult.won ? 'Win' : 'Loss'}</p>
                  </div>
                </div>
              ) : null}
            </motion.div>

          </div>

          <BetControls
            betAmount={betAmount}
            onBetChange={setBetAmount}
            targetMultiplier={targetMultiplier}
            onTargetChange={setTargetMultiplier}
            onPlay={playRound}
            onCashout={cashoutNow}
            inputDisabled={isRolling}
            buttonDisabled={!canPlay}
            error={error}
          />
        </div>
      </div>
    </PageTransition>
  );
}
