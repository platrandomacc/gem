function safePlay(src: string) {
  try {
    const a = new Audio(src);
    a.volume = 0.9;
    a.play().catch(() => {
      // ignore playback errors (autoplay restrictions)
    });
    return a;
  } catch (e) {
    // no-op
  }

  return null;
}

// Play the flip sound when a prediction is chosen. Using existing safekey.mp3 as the flip sound.
export function playDeal() {
  safePlay('/audios/safekey.mp3');
}

export function playCorrect() {
  safePlay('/audios/safekey.mp3');
}

export function playWrong() {
  safePlay('/audios/losskey.mp3');
}

export function playCashout() {
  safePlay('/audios/cashout.mp3');
}

// Specific Hi-Lo flip sound (user requested hiloflip.mp3)
export function playHiloFlip() {
  // prefer hiloflip if available; fallback to safekey
  safePlay('/audios/hiloflip.mp3');
}

export function playReveal() {
  safePlay('/audios/safemine.mp3');
}

export function playMine() {
  safePlay('/audios/minesbomb.mp3');
}

export function playStart() {
  safePlay('/audios/safekey.mp3');
}

export function playTowerComplete() {
  safePlay('/audios/towercomplete.mp3');
}

export function playSpin() {
  return safePlay('/audios/limbospin.mp3');
}

export function playWin() {
  return undefined;
}

export function playLose() {
  return undefined;
}
