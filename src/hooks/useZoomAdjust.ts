import { useEffect } from 'react';

function getScale(): number {
  if (typeof window === 'undefined') return 1;
  // Best-effort zoom detection order:
  // 1. visualViewport.scale (mobile/pinch zoom)
  // 2. measure CSS inch to detect desktop zoom reliably
  // 3. fallback to devicePixelRatio
  const vv = (window as any).visualViewport;
  if (vv && typeof vv.scale === 'number' && isFinite(vv.scale) && vv.scale > 0) {
    return Math.max(0.5, Math.min(2, vv.scale));
  }

  try {
    const div = document.createElement('div');
    div.style.width = '1in';
    div.style.height = '1in';
    div.style.position = 'absolute';
    div.style.left = '-100%';
    document.body.appendChild(div);
    const pxPerInch = div.getBoundingClientRect().width;
    document.body.removeChild(div);
    // 96 CSS px per inch at 100% zoom
    const scale = pxPerInch / 96;
    if (isFinite(scale) && scale > 0) return Math.max(0.5, Math.min(3, scale));
  } catch {
    // ignore
  }

  const dpr = window.devicePixelRatio || 1;
  return Math.max(0.5, Math.min(3, dpr));
}

export default function useZoomAdjust() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let last = 1;

    function applyScale(scale: number) {
      // We want to counteract browser zoom so UI looks consistent.
      // Compute an explicit pixel font-size based on the current computed root size
      // and the inverse of zoom. This is more reliable than percentage strings.
      const computed = window.getComputedStyle(document.documentElement).fontSize || '16px';
      const basePx = Number(computed.replace('px', '')) || 16;
      const inv = 1 / scale;
      const next = Math.round(basePx * inv * 100) / 100; // keep two decimals
      const px = `${next}px`;
      if (document.documentElement.style.fontSize !== px) {
        document.documentElement.style.fontSize = px;
      }
    }

    function handle() {
      const scale = getScale();
      if (scale === last) return;
      last = scale;
      applyScale(scale);
    }

    // Initial
    applyScale(getScale());

    // Listen to visualViewport if available (provides scale changes on zoom)
    const vv = (window as any).visualViewport;
    if (vv && typeof vv.addEventListener === 'function') {
      vv.addEventListener('resize', handle);
      vv.addEventListener('scroll', handle);
      vv.addEventListener('change', handle);
    } else {
      // Fallback: listen to window resize and devicePixelRatio changes via matchMedia
      window.addEventListener('resize', handle);
      try {
        const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        // when devicePixelRatio changes, this media query may match/unmatch
        mq.addEventListener?.('change', handle);
      } catch {
        // ignore
      }
    }

    // Cleanup
    return () => {
      if (vv && typeof vv.removeEventListener === 'function') {
        vv.removeEventListener('resize', handle);
        vv.removeEventListener('scroll', handle);
        vv.removeEventListener('change', handle);
      } else {
        window.removeEventListener('resize', handle);
      }
      // Reset font-size to default on unmount
      document.documentElement.style.fontSize = '';
    };
  }, []);
}
