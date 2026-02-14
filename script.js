/* ============================================================
   FRIEND VALENTINE'S — SHARED JAVASCRIPT
   Sparkle canvas, floating hearts, navigation, fade-in
   ============================================================ */

// ── Sparkle Canvas ────────────────────────────────────────
function initSparkles() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  const COLORS = [
    '#ff6eb4', '#ffb3d9', '#b57bee', '#d9b8ff',
    '#6ec6ff', '#b8e4ff', '#72e8c2', '#ffe566',
    '#ffffff', '#ffb899',
  ];

  function spawnParticle(x, y, burst) {
    return {
      x:     x  ?? Math.random() * W,
      y:     y  ?? Math.random() * H,
      size:  burst ? 2 + Math.random() * 4 : 1 + Math.random() * 2.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: burst ? 0.9 + Math.random() * 0.1 : 0.3 + Math.random() * 0.7,
      alphaDir: -1,
      alphaSpeed: burst ? 0.015 + Math.random() * 0.02 : 0.005 + Math.random() * 0.01,
      vx:    (Math.random() - 0.5) * (burst ? 3 : 0.3),
      vy:    burst ? -1 - Math.random() * 3 : -0.1 - Math.random() * 0.4,
      spin:  Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.15,
      star:  Math.random() > 0.4,
      burst: burst ?? false,
    };
  }

  function drawStar(ctx, x, y, r, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outer = r, inner = r * 0.4;
      const oA = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const iA = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(Math.cos(oA) * outer, Math.sin(oA) * outer);
      else         ctx.lineTo(Math.cos(oA) * outer, Math.sin(oA) * outer);
      ctx.lineTo(Math.cos(iA) * inner, Math.sin(iA) * inner);
    }
    ctx.closePath();
    ctx.restore();
  }

  // Seed background particles
  resize();
  for (let i = 0; i < 70; i++) particles.push(spawnParticle());

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles = particles.filter(p => p.alpha > 0.02 && p.y > -20);

    // Replenish background sparkles
    while (particles.filter(p => !p.burst).length < 70) particles.push(spawnParticle());

    particles.forEach(p => {
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (!p.burst && p.alpha < 0.1) p.alphaDir = 1;
      if (!p.burst && p.alpha > 0.9) p.alphaDir = -1;
      p.x += p.vx;
      p.y += p.vy;
      p.spin += p.spinSpeed;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.star) {
        drawStar(ctx, p.x, p.y, p.size, p.spin);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
  window.addEventListener('resize', resize);

  // Click burst
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 18; i++) {
      particles.push(spawnParticle(e.clientX, e.clientY, true));
    }
  });
}

// ── Floating Hearts ───────────────────────────────────────
const HEART_CHARS  = ['♥', '♡', '💕', '💖', '💗', '✦', '★', '✿', '⭐'];
const HEART_COLORS = ['#ff6eb4', '#b57bee', '#6ec6ff', '#72e8c2', '#ffe566', '#ffb899'];

function createHeart(container, forced = false) {
  const el    = document.createElement('span');
  el.classList.add('heart');
  el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];

  const size  = 0.8 + Math.random() * 1.6;
  const left  = Math.random() * 100;
  const dur   = 7 + Math.random() * 10;
  const delay = forced ? Math.random() * 3 : Math.random() * 8;
  const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];

  el.style.cssText = `
    left: ${left}%;
    font-size: ${size}rem;
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
    color: ${color};
    filter: drop-shadow(0 0 4px ${color}bb);
  `;

  container.appendChild(el);
  setTimeout(() => el.remove(), (dur + delay) * 1000);
}

function initHearts(mult = 1) {
  const container = document.querySelector('.hearts-container');
  if (!container) return;
  for (let i = 0; i < Math.round(12 * mult); i++) createHeart(container, true);
  setInterval(() => {
    createHeart(container);
    if (Math.random() > 0.5) createHeart(container);
  }, Math.round(1600 / mult));
}

// Exported for burst use
window.burstHearts = function(mult = 3) {
  const container = document.querySelector('.hearts-container');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el    = document.createElement('span');
      el.classList.add('heart');
      el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${1 + Math.random() * 2}rem;
        animation-duration: ${5 + Math.random() * 7}s;
        animation-delay: ${Math.random() * 0.5}s;
        color: ${color};
        filter: drop-shadow(0 0 6px ${color});
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 12000);
    }, i * 50);
  }
  setInterval(() => {
    createHeart(container);
    createHeart(container);
  }, 600);
};

// ── Fade-In Observer ──────────────────────────────────────
function initFadeIn() {
  const obs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ── Active Nav ────────────────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// ── Page Transitions ──────────────────────────────────────
function initPageTransition() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;
  setTimeout(() => overlay.classList.remove('active'), 60);
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href.startsWith('http') && !href.startsWith('#')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => window.location.href = href, 450);
      });
    }
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSparkles();
  initHearts();
  initFadeIn();
  setActiveNav();
  initPageTransition();
});
