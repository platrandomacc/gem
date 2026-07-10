export function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];
  const random = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      return crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff;
    }
    return Math.random();
  };

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
