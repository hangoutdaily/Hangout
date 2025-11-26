import confetti from 'canvas-confetti';

export function launchConfetti() {
  const duration = 1200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      startVelocity: 28,
      spread: 70,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
