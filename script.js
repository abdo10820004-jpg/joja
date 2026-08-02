// ============================================================
// UTIL
// ============================================================
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// NAV: scrolled state + scroll progress heart
// ============================================================
const siteNav = document.getElementById('siteNav');
const scrollHeart = document.getElementById('scrollHeart');
const heartPath = scrollHeart.querySelector('path');
const heartLength = heartPath.getTotalLength ? heartPath.getTotalLength() : 90;
heartPath.style.strokeDasharray = heartLength;

function onScroll() {
  siteNav.classList.toggle('scrolled', window.scrollY > 40);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
  const offset = heartLength - progress * heartLength;
  heartPath.style.strokeDashoffset = offset;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ============================================================
// HERO TYPING EFFECT
// ============================================================
const heroTyping = document.getElementById('heroTyping');
const typingText = 'For My Best Friend ❤️';

function typeText() {
  if (reducedMotion) {
    heroTyping.textContent = typingText;
    return;
  }
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.innerHTML = '&nbsp;';

  function step() {
    if (i <= typingText.length) {
      heroTyping.textContent = typingText.slice(0, i);
      heroTyping.appendChild(cursor);
      i++;
      setTimeout(step, 55);
    } else {
      setTimeout(() => cursor.remove(), 1200);
    }
  }
  setTimeout(step, 300);
}
typeText();

// ============================================================
// MOUSE PARALLAX ON HERO GLOWS
// ============================================================
const heroGlows = document.querySelectorAll('.hero-glow');
const hero = document.getElementById('hero');
if (!reducedMotion) {
  hero.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    heroGlows.forEach((glow, i) => {
      const depth = (i + 1) * 12;
      glow.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
}

// ============================================================
// RIPPLE BUTTON EFFECT
// ============================================================
document.querySelectorAll('.ripple-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// ============================================================
// OPEN MY HEART -> smooth scroll to About
// ============================================================
document.getElementById('openHeartBtn').addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// ============================================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================================
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ============================================================
// QUOTES CAROUSEL
// ============================================================
const quoteCards = document.querySelectorAll('.quote-card');
const quotesDotsWrap = document.getElementById('quotesDots');
let quoteIndex = 0;
let quoteTimer;

quoteCards.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => showQuote(i));
  quotesDotsWrap.appendChild(dot);
});
const dots = quotesDotsWrap.querySelectorAll('span');

function showQuote(index) {
  quoteCards[quoteIndex].classList.remove('active');
  dots[quoteIndex].classList.remove('active');
  quoteIndex = index;
  quoteCards[quoteIndex].classList.add('active');
  dots[quoteIndex].classList.add('active');
}

function nextQuote() {
  showQuote((quoteIndex + 1) % quoteCards.length);
}

if (quoteCards.length) {
  quoteCards[0].classList.add('active');
  if (!reducedMotion) {
    quoteTimer = setInterval(nextQuote, 4500);
  }
}

// ============================================================
// AMBIENT CANVAS: fireflies / hearts drifting whole page
// ============================================================
const ambientCanvas = document.getElementById('ambient-canvas');
const actx = ambientCanvas.getContext('2d');
let ambientParticles = [];

function resizeAmbient() {
  ambientCanvas.width = window.innerWidth * devicePixelRatio;
  ambientCanvas.height = window.innerHeight * devicePixelRatio;
  ambientCanvas.style.width = window.innerWidth + 'px';
  ambientCanvas.style.height = window.innerHeight + 'px';
  actx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resizeAmbient();
window.addEventListener('resize', resizeAmbient);

const AMBIENT_COUNT = window.innerWidth < 700 ? 16 : 30;
const shapes = ['heart', 'sparkle', 'dot'];

function makeParticle() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 6 + Math.random() * 10,
    speedY: 0.15 + Math.random() * 0.35,
    driftX: Math.random() * 0.6 - 0.3,
    swaySeed: Math.random() * Math.PI * 2,
    opacity: 0.15 + Math.random() * 0.35,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    hue: Math.random() > 0.5 ? '#F7A8BC' : '#E8C4A0',
  };
}
for (let i = 0; i < AMBIENT_COUNT; i++) ambientParticles.push(makeParticle());

function drawHeart(ctx, x, y, size, color, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(0, 2, -6, -6, -12, -2);
  ctx.bezierCurveTo(-18, 2, -12, 10, 0, 18);
  ctx.bezierCurveTo(12, 10, 18, 2, 12, -2);
  ctx.bezierCurveTo(6, -6, 0, 2, 0, 6);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawSparkle(ctx, x, y, size, color, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, -size); ctx.lineTo(0, size);
  ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
  ctx.stroke();
  ctx.restore();
}

let t = 0;
function animateAmbient() {
  actx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  t += 0.01;
  ambientParticles.forEach((p) => {
    p.y -= p.speedY;
    p.x += Math.sin(t + p.swaySeed) * 0.4 + p.driftX * 0.2;
    if (p.y < -20) {
      p.y = window.innerHeight + 20;
      p.x = Math.random() * window.innerWidth;
    }
    if (p.shape === 'heart') {
      drawHeart(actx, p.x, p.y, p.size, p.hue, p.opacity);
    } else if (p.shape === 'sparkle') {
      drawSparkle(actx, p.x, p.y, p.size * 0.7, p.hue, p.opacity);
    } else {
      actx.save();
      actx.globalAlpha = p.opacity;
      actx.beginPath();
      actx.arc(p.x, p.y, p.size * 0.25, 0, Math.PI * 2);
      actx.fillStyle = p.hue;
      actx.fill();
      actx.restore();
    }
  });
  if (!reducedMotion) requestAnimationFrame(animateAmbient);
}
if (!reducedMotion) animateAmbient();
else {
  // draw a single static frame
  animateAmbient();
}

// ============================================================
// FINAL SECTION: glowing pulsing heart on canvas
// ============================================================
const heartCanvas = document.getElementById('heartCanvas');
const hctx = heartCanvas.getContext('2d');
let heartParticles = [];

function resizeHeartCanvas() {
  const rect = heartCanvas.parentElement.getBoundingClientRect();
  heartCanvas.width = rect.width * devicePixelRatio;
  heartCanvas.height = rect.height * devicePixelRatio;
  heartCanvas.style.width = rect.width + 'px';
  heartCanvas.style.height = rect.height + 'px';
  hctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function heartPoint(angle, scale) {
  const x = 16 * Math.pow(Math.sin(angle), 3);
  const y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
  return { x: x * scale, y: y * scale };
}

function buildHeartParticles() {
  heartParticles = [];
  const count = 140;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const scale = 6 + Math.random() * 1.2;
    const pt = heartPoint(angle, scale);
    heartParticles.push({
      baseX: pt.x,
      baseY: pt.y,
      angleSeed: Math.random() * Math.PI * 2,
      size: 1.5 + Math.random() * 2,
    });
  }
}
buildHeartParticles();

let heartTime = 0;
function animateHeart() {
  const rect = heartCanvas.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height * 0.42;
  hctx.clearRect(0, 0, rect.width, rect.height);

  heartTime += 0.02;
  const pulse = 1 + Math.sin(heartTime * 2) * 0.04;

  // glow
  const grad = hctx.createRadialGradient(cx, cy, 10, cx, cy, 160);
  grad.addColorStop(0, 'rgba(255, 182, 193, 0.35)');
  grad.addColorStop(1, 'rgba(255, 182, 193, 0)');
  hctx.fillStyle = grad;
  hctx.beginPath();
  hctx.arc(cx, cy, 170, 0, Math.PI * 2);
  hctx.fill();

  heartParticles.forEach((p) => {
    const wob = Math.sin(heartTime + p.angleSeed) * 2;
    const x = cx + (p.baseX + wob) * pulse;
    const y = cy + (p.baseY + wob) * pulse;
    hctx.save();
    hctx.globalAlpha = 0.75;
    hctx.beginPath();
    hctx.arc(x, y, p.size, 0, Math.PI * 2);
    hctx.fillStyle = '#FFD1DC';
    hctx.shadowColor = '#FFB6C1';
    hctx.shadowBlur = 10;
    hctx.fill();
    hctx.restore();
  });

  requestAnimationFrame(animateHeart);
}

// only animate final heart when section visible (perf)
let heartAnimating = false;
const letterSection = document.getElementById('letter');
const letterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !heartAnimating) {
      heartAnimating = true;
      resizeHeartCanvas();
      animateHeart();
    }
  });
}, { threshold: 0.1 });
letterObserver.observe(letterSection);
window.addEventListener('resize', () => { if (heartAnimating) resizeHeartCanvas(); });

// ============================================================
// CONFETTI ON "SEND LOVE"
// ============================================================
const confettiBtn = document.getElementById('confettiBtn');
confettiBtn.addEventListener('click', () => {
  launchConfetti();
});

function launchConfetti() {
  const colors = ['#FFB6C1', '#FFD1DC', '#F7A8BC', '#E8C4A0', '#FFFFFF'];
  const symbols = ['❤', '✦', '🌸'];
  const count = 46;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const useSymbol = Math.random() > 0.5;
    el.textContent = useSymbol ? symbols[Math.floor(Math.random() * symbols.length)] : '';
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.top = '60%';
    el.style.zIndex = 999;
    el.style.pointerEvents = 'none';
    el.style.fontSize = useSymbol ? (10 + Math.random() * 14) + 'px' : '0';
    if (!useSymbol) {
      el.style.width = '8px';
      el.style.height = '8px';
      el.style.borderRadius = '50%';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
    } else {
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
    }
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 260;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 120;
    const rotate = Math.random() * 720 - 360;
    const duration = 1400 + Math.random() * 900;

    el.animate(
      [
        { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotate}deg)`, opacity: 0 },
      ],
      { duration, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' }
    );
    setTimeout(() => el.remove(), duration + 50);
  }
}

// ============================================================
// MUSIC TOGGLE
// ============================================================
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let musicPlaying = false;

musicToggle.addEventListener('click', () => {
  if (!musicPlaying) {
    bgMusic.play().catch(() => {
      // file likely not provided yet — fail silently
    });
    musicToggle.classList.add('playing');
    musicPlaying = true;
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
    musicPlaying = false;
  }
});
