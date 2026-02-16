/* ==========================================
   UMOYA HOTEL — V3 JS
   Minimal. Purposeful. No bloat.
   ========================================== */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  
  // ---- NAV SCROLL BEHAVIOR ----
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  // ---- MOBILE NAV ----
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
    });
    
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    reveals.forEach(el => observer.observe(el));
  }

  // ---- LIGHTBOX ----
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentIndex = 0;
  const images = [];

  galleryItems.forEach((img, i) => {
    images.push(img.src);
    img.parentElement.addEventListener('click', () => {
      currentIndex = i;
      openLightbox();
    });
  });

  function openLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = images[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  });
  
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + images.length) % images.length; lightboxImg.src = images[currentIndex]; }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % images.length; lightboxImg.src = images[currentIndex]; }
  });
});
