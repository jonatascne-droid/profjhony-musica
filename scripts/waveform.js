/* ===================================================
   PROFESOR JHONY — waveform.js
   Canvas audio-frequency visualizer for Hero background
   =================================================== */
(function () {
  const canvas = document.getElementById('waveform');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, bars, animId, t = 0;
  const BAR_COUNT = 64;
  const COLOR_A = '232, 163, 61';  /* amber */
  const COLOR_B = '232, 96, 76';   /* coral */

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildBars();
  }

  function buildBars() {
    bars = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      bars.push({
        phase: Math.random() * Math.PI * 2,
        speed: 0.012 + Math.random() * 0.02,
        amp:   0.25 + Math.random() * 0.7,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const baseY   = H - 60;
    const gap     = W / BAR_COUNT;
    const maxH    = Math.min(H * 0.22, 170);

    for (let i = 0; i < BAR_COUNT; i++) {
      const b = bars[i];
      const wobble = Math.sin(t * b.speed + b.phase) * 0.5 + 0.5;
      const envelope = Math.sin((i / BAR_COUNT) * Math.PI); /* taller in the middle */
      const barH = Math.max(3, wobble * b.amp * maxH * envelope);

      const x = i * gap + gap * 0.22;
      const w = gap * 0.56;

      const mix = i / BAR_COUNT;
      const color = `rgba(${lerpColor(mix)}, ${0.10 + envelope * 0.22})`;

      ctx.fillStyle = color;
      roundRect(ctx, x, baseY - barH, w, barH, w / 2);
      ctx.fill();

      /* mirrored, softer, below the baseline */
      ctx.fillStyle = `rgba(${lerpColor(mix)}, ${0.04 + envelope * 0.08})`;
      roundRect(ctx, x, baseY, w, barH * 0.4, w / 2);
      ctx.fill();
    }

    t += 1;
    animId = requestAnimationFrame(draw);
  }

  function lerpColor(mix) {
    const a = COLOR_A.split(',').map(Number);
    const b = COLOR_B.split(',').map(Number);
    const r = Math.round(a[0] + (b[0] - a[0]) * mix);
    const g = Math.round(a[1] + (b[1] - a[1]) * mix);
    const bl = Math.round(a[2] + (b[2] - a[2]) * mix);
    return `${r}, ${g}, ${bl}`;
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });

  window.addEventListener('resize', resize);

  resize();
  draw();
})();
