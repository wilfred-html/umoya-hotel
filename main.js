/* ==========================================
   UMOYA HOTEL — MAIN JAVASCRIPT
   ========================================== */

// ==========================================
// NAVIGATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // Active Navigation Link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Hide/Show Navigation on Scroll
  let lastScroll = 0;
  const nav = document.querySelector('.nav');
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      nav.classList.remove('hidden');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down
      nav.classList.add('hidden');
    } else {
      // Scrolling up
      nav.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  });
  
  // ==========================================
  // INTERSECTION OBSERVER - REVEAL ANIMATIONS
  // ==========================================
  
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  // ==========================================
  // LIGHTBOX
  // ==========================================
  
  let currentImageIndex = 0;
  let galleryImages = [];
  
  function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;
    
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Collect all gallery images
    galleryImages = Array.from(galleryItems).map(item => item.src);
    
    // Open lightbox on image click
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        currentImageIndex = index;
        openLightbox(this.src);
      });
    });
    
    // Close lightbox
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Navigation
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrevImage();
      });
    }
    
    if (lightboxNext) {
      lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        showNextImage();
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    });
    
    function openLightbox(src) {
      lightboxImage.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    function showPrevImage() {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImage.src = galleryImages[currentImageIndex];
    }
    
    function showNextImage() {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      lightboxImage.src = galleryImages[currentImageIndex];
    }
  }
  
  initLightbox();
  
  // ==========================================
  // NEWSLETTER FORM
  // ==========================================
  
  const newsletterForm = document.querySelector('.footer-newsletter');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input');
      const email = input.value;
      
      if (email) {
        alert('Thank you for subscribing! We'll keep you updated on Umoya Hotel.');
        input.value = '';
      }
    });
  }
  
  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==========================================
  // PAGE TRANSITIONS (internal links)
  // ==========================================

  document.body.classList.add('page-enter');

  const internalLinks = document.querySelectorAll('a[href]');
  internalLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;

    const isHash = href.startsWith('#');
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    const isNewTab = a.getAttribute('target') === '_blank';

    if (isHash || isExternal || isNewTab) return;

    a.addEventListener('click', (e) => {
      // allow cmd/ctrl click
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      window.setTimeout(() => {
        window.location.href = href;
      }, 260);
    });
  });

  // ==========================================
  // PARALLAX (subtle) for marked elements
  // ==========================================

  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        el.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }

});
