export const featuredgames = [
  {
    title: 'Towers',
    slug: 'towers',
    provider: 'Flip Bet',
    rtp: '97.4%',
    category: 'Instant',
    accent: 'from-[#22C55E]/35 to-[#16A34A]/20',
    image: '/images/towers.png',
  },
  {
    title: 'Hilo',
    slug: 'hilo',
    provider: 'Flip Bet',
    rtp: '96.8%',
    category: 'Table Games',
    accent: 'from-[#3B82F6]/30 to-[#22C55E]/10',
    image: '/images/hilo.png',
  },
  {
    title: 'Mines',
    slug: 'mines',
    provider: 'Flip Bet',
    rtp: '99.5%',
    category: 'Instant',
    accent: 'from-[#16A34A]/20 to-[#22C55E]/20',
    image: '/images/mines.png',
  },
  {
    title: 'Limbo',
    slug: 'limbo',
    provider: 'Flip Bet',
    rtp: '98.7%',
    category: 'Instant',
    accent: 'from-[#16A34A]/20 to-[#22C55E]/20',
    image: '/images/limbo.png',
  },
  {
    title: 'Coinflip',
    slug: 'coinflip',
    provider: 'Flip Bet',
    rtp: '98.7%',
    category: 'Instant',
    accent: 'from-[#16A34A]/20 to-[#22C55E]/20',
    image: '/images/coinflip.png',
  },
    {
    title: 'Blackjack',
    slug: 'blackjack',
    provider: 'Flip Bet',
    rtp: '96.4%',
    category: 'Table Games',
    accent: 'from-[#16A34A]/20 to-[#22C55E]/20',
    image: '/images/blackjack.png',
  },

];

export interface GameEntry {
  title: string;
  slug: string;
  provider: string;
  rtp: string;
  category: string;
  accent: string;
  image: string;
}

export const getGameBySlug = (slug: string) => featuredgames.find((game) => game.slug === slug);

export const categories = ['Live', 'Slots', 'Table Games', 'Jackpots', 'Instant'];
export const providers = ['Lumen Studios', 'Nexora', 'Atlas Play', 'Volt', 'Cinder'];

export const leaderboards = [
  { name: 'Mina Carter', points: 28450, tier: 'Diamond' },
  { name: 'Rory Hale', points: 25210, tier: 'Gold' },
  { name: 'Kai Laurent', points: 21980, tier: 'Platinum' },
];

export const faqItems = [
  {
    question: 'How quickly can I withdraw?',
    answer: 'Most withdrawals clear within 2 to 4 hours for verified accounts, with higher limits available for VIP members.',
  },
  {
    question: 'Is the platform mobile-friendly?',
    answer: 'Yes. Every experience is optimized for phones, tablets, and desktop displays with consistent performance.',
  },
  {
    question: 'How does responsible play work?',
    answer: 'You can set deposit limits, cooling-off periods, and self-exclusion windows directly from your profile.',
  },
];
