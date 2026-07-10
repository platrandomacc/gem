// Quick test for Limbo multiplier distribution
function generateLimboMultiplier() {
  let r = Math.random();
  if (r >= 0.35 && r <= 0.75) {
    r = 1 - Math.pow(1 - r, 1.06);
  }
  const houseEdge = 0.97;
  const multiplier = houseEdge / (1 - r);
  return Math.max(1, Math.min(Number(multiplier.toFixed(2)), 100));
}

function runTest(samples = 100) {
  const values = [];
  for (let i = 0; i < samples; i++) {
    values.push(generateLimboMultiplier());
  }

  const counts = { low: 0, mid: 0, high: 0 };
  let sum = 0;
  let min = Infinity;
  let max = -Infinity;
  let repeats = 0;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    sum += v;
    min = Math.min(min, v);
    max = Math.max(max, v);
    if (v < 2) counts.low++;
    else if (v < 10) counts.mid++;
    else counts.high++;
    if (i > 0 && values[i - 1] === v) repeats++;
  }

  console.log('Samples:', samples);
  console.log('First 20 samples:', values.slice(0, 20).map(v => v.toFixed(2)).join(', '));
  console.log('Min:', min.toFixed(2), 'Max:', max.toFixed(2), 'Avg:', (sum / samples).toFixed(2));
  console.log('Distribution: <2x:', counts.low, ', 2-10x:', counts.mid, ', >=10x:', counts.high);
  console.log('Adjacent equal repeats:', repeats);
}

runTest(100);
