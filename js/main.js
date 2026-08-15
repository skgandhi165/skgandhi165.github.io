// ============================================================
// Hero signal trace — animated waveform on canvas
// ============================================================
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  const accent = '#0F8B8D';
  const amber = '#E8A33D';
  const gridColor = 'rgba(255,255,255,0.06)';

  // A few "signal events" — small anomaly blips that travel across
  const blips = [0.22, 0.55, 0.81];

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // background grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const rows = 5, cols = 10;
    for (let i = 1; i < rows; i++) {
      const y = (h / rows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let i = 1; i < cols; i++) {
      const x = (w / cols) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // base waveform
    ctx.beginPath();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    const mid = h / 2;
    for (let x = 0; x <= w; x++) {
      const nx = x / w;
      const y =
        mid +
        Math.sin(nx * 14 + t) * (h * 0.08) +
        Math.sin(nx * 4 + t * 0.6) * (h * 0.12);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // anomaly markers — dots that pulse along the line at fixed x positions
    blips.forEach((bx, i) => {
      const x = bx * w;
      const nx = bx;
      const y =
        mid +
        Math.sin(nx * 14 + t) * (h * 0.08) +
        Math.sin(nx * 4 + t * 0.6) * (h * 0.12);
      const pulse = (Math.sin(t * 2 + i * 2) + 1) / 2;
      ctx.beginPath();
      ctx.fillStyle = amber;
      ctx.globalAlpha = 0.4 + pulse * 0.6;
      ctx.arc(x, y, 3 + pulse * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    if (!reduceMotion) {
      t += 0.012;
      requestAnimationFrame(draw);
    }
  }
  draw();
})();

// ============================================================
// Project tag filtering
// ============================================================
(function () {
  const filterBar = document.querySelector('[data-filter-bar]');
  if (!filterBar) return;

  const pills = filterBar.querySelectorAll('.tool-pill');
  const cards = document.querySelectorAll('[data-tools]');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const tool = pill.getAttribute('data-tool');
      const isActive = pill.classList.contains('active');

      pills.forEach((p) => p.classList.remove('active'));

      if (isActive) {
        // toggling off -> show all
        cards.forEach((c) => (c.style.display = ''));
        return;
      }

      pill.classList.add('active');
      cards.forEach((card) => {
        const tools = (card.getAttribute('data-tools') || '').toLowerCase();
        card.style.display = tools.includes(tool.toLowerCase()) ? '' : 'none';
      });
    });
  });
})();
