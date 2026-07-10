import { Card } from '../ui/Card';
import type { CardData } from '../../types/card';

interface DeckProps {
  cardsRemaining: number;
  currentCard: CardData | null;
}

export function Deck({ cardsRemaining, currentCard }: DeckProps) {
  return (
    <Card className="border-white/5 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#3B82F6]">Bet</p>
            <h2 className="text-lg font-semibold text-white">Current stake</h2>
          </div>
          <div className="rounded-full bg-[#111821] px-3 py-2 text-xs uppercase tracking-[0.24em] text-[#8D95A8]">{cardsRemaining} cards left</div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-[#0D1116] p-4">
          <div className="space-y-2 text-sm text-[#B7BDCB]">
            <p>The game begins with the first card shown. Predict if the next draw will be higher or lower.</p>
            <p className="text-white">Current card: {currentCard ? `${currentCard.rank} ${currentCard.suit}` : 'None'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
