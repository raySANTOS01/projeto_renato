const WA_NUMBER = '558581178648';
const baseMessage = 'Olá Renato! Vim pelo site e gostaria de fazer uma cotação de plano de saúde.';
const waUrl = (message) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

document.querySelectorAll('[data-wa]').forEach(el => el.href = waUrl(baseMessage));
document.querySelectorAll('[data-wa-msg]').forEach(el => el.href = waUrl(el.dataset.waMsg));

document.getElementById('leadForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const age = document.getElementById('age').value.trim();
  const type = document.getElementById('type').value;
  const message = `Olá Renato! Vim pelo site e quero uma cotação.\n\nNome: ${name}\nWhatsApp: ${phone || 'não informado'}\nIdade: ${age || 'não informado'}\nInteresse: ${type}`;
  window.open(waUrl(message), '_blank', 'noopener,noreferrer');
});

const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${Math.min(100, (window.scrollY / max) * 100)}%`;
}, {passive:true});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

// Showcase carousel: autoplay + arrows + dots + touch/swipe + pause on hover/focus
const slider = document.getElementById('showcaseSlider');
const track = document.getElementById('showcaseTrack');
const slides = [...document.querySelectorAll('.showcase-slide')];
const dotsWrap = document.getElementById('sliderDots');
const progressBar = document.getElementById('sliderProgress');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
let currentSlide = 0;
let autoplayTimer = null;
let touchStartX = 0;
let touchStartY = 0;
const SLIDE_TIME = 5200;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
  dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});
const dots = [...document.querySelectorAll('.slider-dot')];

function resetProgress() {
  if (!progressBar) return;
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${SLIDE_TIME}ms linear`;
      progressBar.style.width = '100%';
    });
  });
}

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translate3d(-${currentSlide * 100}%,0,0)`;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  resetProgress();
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
  slider?.classList.add('is-paused');
  if (progressBar) progressBar.style.animationPlayState = 'paused';
}

function startAutoplay() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_TIME);
  slider?.classList.remove('is-paused');
  resetProgress();
}

prevBtn?.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoplay(); });
nextBtn?.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoplay(); });
slider?.addEventListener('mouseenter', stopAutoplay);
slider?.addEventListener('mouseleave', startAutoplay);
slider?.addEventListener('focusin', stopAutoplay);
slider?.addEventListener('focusout', startAutoplay);

slider?.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
  stopAutoplay();
}, {passive:true});
slider?.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
    goToSlide(currentSlide + (dx < 0 ? 1 : -1));
  }
  startAutoplay();
}, {passive:true});

goToSlide(0);
startAutoplay();
