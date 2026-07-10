import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, BarChart2, Play } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageTransition } from '../components/ui/PageTransition';
import { Modal } from '../components/ui/Modal';
import { BetInput } from '../components/BetInput';
import { Button } from '../components/ui/Button';
import { useBlackjack, calculateHandValue } from '../hooks/useBlackjack';
import { CardData } from '../types/card';

const suitIcons: Record<CardData['suit'], string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const suitColors: Record<CardData['suit'], string> = {
  spades: 'text-[#0e1726]',
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-[#0e1726]',
};

// Compact Playing Card Component
function PlayingCard({ card, hidden = false }: { card: CardData; hidden?: boolean }) {
  if (hidden) {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotateY: 180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative h-20 w-14 sm:h-24 sm:w-17 rounded-xl border border-[#00F5FF]/30 bg-gradient-to-br from-[#030e1a] to-[#01060b] shadow-[0_6px_15px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden shrink-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#00f5ff_1px,transparent_1px)] [background-size:8px_8px] opacity-10" />
        <div className="absolute inset-0.5 rounded-lg border border-dashed border-[#00F5FF]/10 flex flex-col items-center justify-center bg-[#030c16]/80">
          <span className="text-[#00F5FF] text-base font-black tracking-widest animate-pulse">?</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.7, y: 10, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative h-20 w-14 sm:h-24 sm:w-17 rounded-xl bg-white border border-gray-200 shadow-[0_6px_15px_rgba(0,0,0,0.4)] flex flex-col justify-between p-1.5 text-black shrink-0"
    >
      <div className="flex items-start justify-between leading-none">
        <span className="font-black text-xs tracking-tighter">{card.rank}</span>
        <span className={`text-xs ${suitColors[card.suit]}`}>{suitIcons[card.suit]}</span>
      </div>
      <div className={`flex items-center justify-center text-2xl leading-none font-bold ${suitColors[card.suit]}`}>
        {suitIcons[card.suit]}
      </div>
      <div className="flex items-end justify-between leading-none rotate-180">
        <span className="font-black text-xs tracking-tighter">{card.rank}</span>
        <span className={`text-xs ${suitColors[card.suit]}`}>{suitIcons[card.suit]}</span>
      </div>
    </motion.div>
  );
}

export default function BlackjackPage() {
  const {
    balance,
    betAmount,
    setBetAmount,
    activeBet,
    status,
    playerHand,
    dealerHand,
    playerValue,
    dealerValue,
    isAnimating,
    message,
    error,
    stats,
    history,
    cashoutSummary,
    dismissCashoutSummary,
    canPlay,
    canHit,
    canStand,
    canDouble,
    dealCards,
    hit,
    stand,
    doubleDown,
    resetGame,
    clearHistory,
  } = useBlackjack();

  // Show only first dealer card score when it's player turn
  const visibleDealerValue = useMemo(() => {
    if (status === 'player-turn' && dealerHand.length > 0) {
      return calculateHandValue([dealerHand[0]]);
    }
    return dealerValue;
  }, [dealerHand, dealerValue, status]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-2 py-3 sm:px-3 sm:py-4 space-y-3">
        
        {/* Super Compact Slim Header */}
        <div className="rounded-[18px] border border-[#00F5FF]/15 bg-[#071520] px-3.5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-[#00F5FF] animate-pulse" />
            <h1 className="text-sm sm:text-base font-black text-white tracking-wide">Blackjack</h1>
            <span className="text-[9px] uppercase tracking-widest text-[#00F5FF]/75 bg-[#00F5FF]/5 border border-[#00F5FF]/15 px-2 py-0.5 rounded-md font-bold hidden sm:inline-block">
              Casino Classic
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/15 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
            99.6% RTP • 3:2 Payout
          </div>
        </div>

        {/* Compact Columns layout */}
        <div className="grid gap-3 xl:grid-cols-[0.72fr_0.28fr]">
          
          {/* Main Felt Arena */}
          <div className="space-y-3">
            <Card hover={false} className="border-white/5 relative p-3 sm:p-4 bg-[#071520] bg-gradient-to-b from-[#071520] to-[#030c14] overflow-hidden min-h-[310px] flex flex-col justify-between rounded-[18px] shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(#00f5ff_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
              
              {/* Dealer Felt Area */}
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#00F5FF] font-bold">Dealer Hand</p>
                    <span className="text-[8px] text-white/30 hidden sm:inline">(Must stand on 17 • Draw on 16)</span>
                  </div>
                  {dealerHand.length > 0 && (
                    <span className="font-mono text-[10px] font-black bg-[#0C202F] border border-white/5 px-2 py-0.5 rounded-md text-white/95">
                      Score: <span className="text-[#00F5FF]">{visibleDealerValue}</span>
                      {status === 'player-turn' && ' + ?'}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pb-1 min-h-[96px] items-center">
                  {dealerHand.map((card, idx) => {
                    const isHidden = status === 'player-turn' && idx === 1;
                    return (
                      <PlayingCard
                        key={card.id || idx}
                        card={card}
                        hidden={isHidden}
                      />
                    );
                  })}
                  {dealerHand.length === 0 && (
                    <div className="h-20 w-full rounded-xl border border-dashed border-white/5 bg-black/10 flex items-center justify-center text-[10px] text-white/20">
                      Place bet to receive cards...
                    </div>
                  )}
                </div>
              </div>

              {/* Center Game Status Feed */}
              <div className="relative z-10 my-1 py-0.5 flex items-center justify-center">
                <div className="rounded-lg border border-white/5 bg-[#0C202F]/60 px-2.5 py-1 text-center">
                  <p className="text-[11px] font-semibold text-[#7DD3FC] tracking-wide">{message}</p>
                </div>
              </div>

              {/* Player Felt Area */}
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#00F5FF] font-bold">Your Hand</p>
                  {playerHand.length > 0 && (
                    <span className="font-mono text-[10px] font-black bg-[#0C202F] border border-white/5 px-2 py-0.5 rounded-md text-white/95">
                      Score: <span className="text-[#9EFF00]">{playerValue}</span>
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pb-1 min-h-[96px] items-center">
                  {playerHand.map((card, idx) => (
                    <PlayingCard
                      key={card.id || idx}
                      card={card}
                    />
                  ))}
                  {playerHand.length === 0 && (
                    <div className="h-20 w-full rounded-xl border border-dashed border-white/5 bg-black/10 flex items-center justify-center text-[10px] text-white/20">
                      Ready to start round
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Rounds Timeline */}
            <div className="rounded-[18px] border border-white/10 bg-[#071520] p-3 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#7DD3FC]/70 flex items-center gap-1.5">
                  <Clock size={12} className="text-[#00F5FF]" />
                  <span>Recent Rounds</span>
                </h3>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase transition"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-xs text-white/30 italic py-1 text-center">
                  Your historic round activity will appear here.
                </p>
              ) : (
                <div className="flex gap-2 overflow-x-auto py-0.5 scrollbar-thin">
                  {history.map((round) => {
                    return (
                      <div
                        key={round.id}
                        className={`flex flex-col items-center p-2 rounded-xl border shrink-0 min-w-[95px] text-center ${
                          round.outcome === 'won'
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                            : round.outcome === 'blackjack'
                            ? 'bg-amber-500/5 border-amber-500/20 text-amber-400 font-bold shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                            : round.outcome === 'lost'
                            ? 'bg-red-500/5 border-red-500/20 text-red-400'
                            : 'bg-blue-500/5 border-blue-500/20 text-blue-400'
                        }`}
                      >
                        <span className="text-[9px] font-black uppercase tracking-wider">
                          {round.outcome === 'blackjack' ? 'BJ' : round.outcome.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs font-black mt-0.5">
                          ${round.bet.toFixed(0)} → ${round.winAmount.toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Controls Column */}
          <div className="space-y-3">
            
            {/* Betting Panel */}
            <div className="rounded-[18px] border border-white/10 bg-[#03080C]/80 p-3.5 shadow-xl backdrop-blur-md space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#00F5FF] font-black">Bet Controls</p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-[#7DD3FC]/70 px-0.5">
                  <span>Balance</span>
                  <span className="font-bold text-white">${balance.toFixed(2)}</span>
                </div>
                
                <BetInput
                  value={betAmount}
                  onChange={setBetAmount}
                  disabled={status !== 'idle'}
                  onHalf={() => setBetAmount((prev) => Math.max(1, Number((prev / 2).toFixed(2))))}
                  onDouble={() => setBetAmount((prev) => Number((prev * 2).toFixed(2)))}
                  error={error}
                />
              </div>

              {/* Unified Cyber Bet Trigger Button */}
              <div className="pt-2 border-t border-white/5">
                {status === 'idle' ? (
                  <Button
                    onClick={dealCards}
                    disabled={!canPlay || isAnimating}
                    fullWidth
                    className={`py-3 shadow-[0_4px_15px_rgba(0,245,255,0.15)] hover:shadow-[0_8px_25px_rgba(0,245,255,0.35)]`}
                    variant="primary"
                  >
                    {isAnimating ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#03080C] border-t-transparent" />
                        DEALING...
                      </span>
                    ) : (
                      `Bet $${betAmount.toFixed(2)}`
                    )}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        disabled={!canHit}
                        onClick={hit}
                        className="py-2.5 text-xs font-black"
                        variant="primary"
                      >
                        Hit
                      </Button>
                      <Button
                        type="button"
                        disabled={!canStand}
                        onClick={stand}
                        className="py-2.5 text-xs font-black"
                        variant="secondary"
                      >
                        Stand
                      </Button>
                    </div>

                    <Button
                      type="button"
                      disabled={!canDouble}
                      onClick={doubleDown}
                      fullWidth
                      className="py-2.5 text-xs font-black"
                      variant="outline"
                    >
                      Double Down (${activeBet})
                    </Button>

                    {status !== 'player-turn' && status !== 'dealer-turn' && (
                      <Button
                        type="button"
                        onClick={resetGame}
                        fullWidth
                        className="py-2 text-xs font-black"
                        variant="ghost"
                      >
                        Clear Board
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>


          </div>

        </div>
      </div>

      {/* Cashout Winner summary overlay (Identical elegant layout) */}
      <Modal open={Boolean(cashoutSummary)} onClose={dismissCashoutSummary} closeButton={false} compact>
        <div className="space-y-4">
          <div className="rounded-[18px] border border-[#00F5FF]/20 bg-[#071520] p-4 text-center shadow-[0_0_20px_rgba(0,245,255,0.15)]">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#00F5FF] font-black">
              {cashoutSummary?.outcome === 'blackjack'
                ? 'Natural Blackjack!'
                : cashoutSummary?.outcome === 'won'
                ? 'Victory Payout'
                : cashoutSummary?.outcome === 'push'
                ? 'Push - Refunded'
                : 'Round Over'}
            </p>
            <p className="mt-2 text-3xl font-black text-white">${(cashoutSummary?.payout ?? 0).toFixed(2)}</p>
          </div>

          <div className="grid gap-2 text-xs">
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3 flex justify-between items-center">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD3FC]/70 font-bold">Multiplier</p>
              <p className="text-base font-black text-[#00F5FF]">{cashoutSummary ? `${cashoutSummary.multiplier.toFixed(2)}×` : '0.00×'}</p>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3 flex justify-between items-center">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD3FC]/70 font-bold">Your Score</p>
              <p className="text-base font-black text-white">{cashoutSummary?.playerValue ?? 0}</p>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-[#0C202F] p-3 flex justify-between items-center">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD3FC]/70 font-bold">Dealer Score</p>
              <p className="text-base font-black text-white">{cashoutSummary?.dealerValue ?? 0}</p>
            </div>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
