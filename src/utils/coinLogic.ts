import { CoinSide } from '../types/coin';

export const generateFlipOutcome = (): CoinSide => {
  const randomByte = crypto?.getRandomValues?.(new Uint8Array(1))?.[0] ?? Math.floor(Math.random() * 256);
  return randomByte % 2 === 0 ? 'heads' : 'tails';
};
