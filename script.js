/* ═══════════════════════════════════════════════════
   HALDWANI SPORTS — script.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── 1. DOM REFERENCES ─────────────────────────────── */
const navbar          = document.getElementById('navbar');
const hamburger       = document.getElementById('hamburger');
const navLinks        = document.getElementById('navLinks');
const mobileOverlay   = document.getElementById('mobileOverlay');
const backTop         = document.getElementById('backTop');
const modalBackdrop   = document.getElementById('modalBackdrop');
const modalClose      = document.getElementById('modalClose');
const prevBtn         = document.getElementById('prevBtn');
const nextBtn         = document.getElementById('nextBtn');
const sliderDots      = document.getElementById('sliderDots');
const testimonialsTrack = document.getElementById('testimonialsTrack');
const productsGrid    = document.getElementById('productsGrid');
const filterBtns      = document.querySelectorAll('.filter-btn');
const statNums        = document.querySelectorAll('.stat-num');
const allNavLinks     = document.querySelectorAll('.nav-link');
const sections        = document.querySelectorAll('section[id], footer[id]');


/* ─── 2. NAVBAR: SCROLL EFFECT ─────────────────────── */
function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // Run once on load


/* ─── 3. MOBILE HAMBURGER MENU ──────────────────────── */
function openMenu() {
  hamburger.classList.add('active');
  navLinks.classList.add('open');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('active') ? closeMenu() : openMenu();
});

mobileOverlay.addEventListener('click', closeMenu);

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMenu();
    closeModal();
  }
});


/* ─── 4. SMOOTH SCROLLING & ACTIVE LINK ─────────────── */
/**
 * Update active nav link based on current scroll position.
 * Highlights the link whose section is nearest the top of the viewport.
 */
function updateActiveLink() {
  let current = '';
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    if (section.offsetTop <= scrollY) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


/* ─── 5. SCROLL REVEAL ANIMATIONS ──────────────────── */
/**
 * Uses IntersectionObserver to add the 'visible' class
 * when elements with .reveal-up or .reveal-left enter the viewport.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal-up, .reveal-left').forEach(el => {
  revealObserver.observe(el);
});


/* ─── 6. ANIMATED COUNTERS ──────────────────────────── */
/**
 * Counts from 0 to target value with ease-out effect
 * when the stat section enters the viewport.
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOutCubic(progress) * target);
    el.textContent = value.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Trigger counters when stats section is visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(animateCounter);
        statsObserver.disconnect(); // Only once
      }
    });
  },
  { threshold: 0.3 }
);

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);


/* ─── 7. PRODUCT FILTER TABS ────────────────────────── */
/**
 * Filters product cards by data-category attribute.
 * Cards that don't match get the 'hidden' class.
 */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const cards  = productsGrid.querySelectorAll('.product-card');

    cards.forEach((card, i) => {
      const match = filter === 'all' || card.dataset.category === filter;

      if (match) {
        card.classList.remove('hidden');
        // Stagger re-reveal
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* ─── 8. TESTIMONIALS SLIDER ────────────────────────── */
(function initSlider() {
  if (!testimonialsTrack) return;

  const cards       = testimonialsTrack.querySelectorAll('.testi-card');
  const totalCards  = cards.length;
  let   currentIdx  = 0;
  let   autoPlayTimer;

  /**
   * Returns how many cards to show at once based on viewport width.
   */
  function visibleCount() {
    return window.innerWidth <= 480 ? 1 : 2;
  }

  /**
   * Returns total number of "slides" (positions) for the track.
   */
  function totalSlides() {
    return Math.max(0, totalCards - visibleCount() + 1);
  }

  /**
   * Builds the dot indicators inside #sliderDots.
   */
  function buildDots() {
    sliderDots.innerHTML = '';
    const count = totalSlides();
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      sliderDots.appendChild(dot);
    }
  }

  /**
   * Moves the track to a given index.
   */
  function goTo(index) {
    const slides = totalSlides();
    currentIdx = Math.max(0, Math.min(index, slides - 1));

    // Calculate the offset: each card width + gap (20px)
    const cardWidth = cards[0].offsetWidth + 20;
    testimonialsTrack.style.transform = `translateX(-${currentIdx * cardWidth}px)`;

    // Update dots
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIdx);
    });
  }

  function next() {
    const slides = totalSlides();
    goTo(currentIdx + 1 >= slides ? 0 : currentIdx + 1);
  }

  function prev() {
    const slides = totalSlides();
    goTo(currentIdx - 1 < 0 ? slides - 1 : currentIdx - 1);
  }

  function startAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(next, 4500);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  // Init
  buildDots();
  startAutoPlay();

  prevBtn.addEventListener('click', () => { stopAutoPlay(); prev(); startAutoPlay(); });
  nextBtn.addEventListener('click', () => { stopAutoPlay(); next(); startAutoPlay(); });

  // Pause on hover
  testimonialsTrack.addEventListener('mouseenter', stopAutoPlay);
  testimonialsTrack.addEventListener('mouseleave', startAutoPlay);

  // Touch/swipe support
  let touchStartX = 0;
  testimonialsTrack.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  testimonialsTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
    startAutoPlay();
  }, { passive: true });

  // Rebuild on resize
  window.addEventListener('resize', () => {
    buildDots();
    goTo(0);
  });
})();


/* ─── 9. QUICK VIEW MODAL ───────────────────────────── */
/**
 * Opens the modal and populates it with product data
 * stored in data-* attributes on the clicked button.
 * Also wires the "Order on WhatsApp" button inside the modal.
 */
function openModal(btn) {
  const name  = btn.dataset.name  || '';
  const price = btn.dataset.price || '';
  const img   = btn.dataset.img   || '';
  const desc  = btn.dataset.desc  || '';
  const cat   = btn.closest('.product-card')?.querySelector('.product-cat')?.textContent || 'Product';

  document.getElementById('modalName').textContent  = name;
  document.getElementById('modalPrice').textContent = price;
  document.getElementById('modalDesc').textContent  = desc;
  document.getElementById('modalCat').textContent   = cat;

  const modalImg = document.getElementById('modalImg');
  modalImg.src = img;
  modalImg.alt = name;

  // Wire the WhatsApp button inside the modal
  const waBtn = document.getElementById('modalWaBtn');
  if (waBtn) {
    // Remove old listener by cloning
    const fresh = waBtn.cloneNode(true);
    waBtn.parentNode.replaceChild(fresh, waBtn);
    fresh.addEventListener('click', () => {
      closeModal();
      orderViaWhatsApp(name, price, cat);
    });
  }

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => {
  if (e.target === modalBackdrop) closeModal();
});

// Expose openModal globally (used by inline onclick)
window.openModal = openModal;


/* ─── 10. WHATSAPP ORDERING SYSTEM ─────────────────── */

/**
 * Core WhatsApp configuration
 */
const WA_CONFIG = {
  number: '918755338593',   // Country code (91) + number
  storeName: 'Haldwani Sports',
};

/**
 * Builds the WhatsApp deep-link URL with a pre-filled order message.
 * @param {string} productName
 * @param {string} price
 * @param {string} category
 * @returns {string} Full wa.me URL
 */
function buildWALink(productName, price, category) {
  const message =
    `Hi ${WA_CONFIG.storeName}! 👋\n\n` +
    `I'd like to order the following:\n\n` +
    `🛒 *${productName}*\n` +
    `📂 Category: ${category}\n` +
    `💰 Price: ${price}\n\n` +
    `Please confirm availability and share delivery details.\n\n` +
    `Thank you!`;

  return `https://wa.me/${WA_CONFIG.number}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp with a pre-filled order message and
 * briefly shows a toast confirmation to the user.
 * @param {string} productName
 * @param {string} price
 * @param {string} category
 */
function orderViaWhatsApp(productName, price, category) {
  const url = buildWALink(productName, price, category);
  window.open(url, '_blank', 'noopener,noreferrer');
  showWAToast(productName);
}

/**
 * Shows a brief "Opening WhatsApp…" toast notification.
 * @param {string} productName
 */
function showWAToast(productName) {
  // Remove existing toast if any
  const existing = document.querySelector('.wa-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'wa-toast';
  toast.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Opening WhatsApp for <strong>${productName}</strong>…`;
  document.body.appendChild(toast);

  // Trigger show after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Auto-dismiss after 3.5 s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// Attach click handlers to all WhatsApp order buttons on product cards
document.querySelectorAll('.wa-order-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const name     = this.dataset.name     || 'Product';
    const price    = this.dataset.price    || '';
    const category = this.dataset.category || 'Sports';
    orderViaWhatsApp(name, price, category);
  });
});


/* ─── 11. BACK TO TOP BUTTON ────────────────────────── */
function handleBackTop() {
  if (window.scrollY > 400) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleBackTop, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─── 12. CATEGORY CARD IMAGE FIX ──────────────────── */
/**
 * Category cards use a CSS custom property --bg for the
 * background image (set inline on the element).  This works
 * without JS; this block is just a safety net to ensure
 * the image is always applied correctly via JS as well.
 */
document.querySelectorAll('.cat-card').forEach(card => {
  const bg = card.style.getPropertyValue('--bg');
  if (bg) {
    card.style.backgroundImage = bg;
  }
});


/* ─── 13. HERO PARALLAX (light, performance-safe) ───── */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  // Only on large screens where the effect looks good
  if (window.innerWidth < 768) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        // Move image upward at 30% scroll speed for depth
        heroImg.style.transform = `scale(1.0) translateY(${scrolled * 0.3}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ─── 14. INIT LOG ──────────────────────────────────── */
console.log(
  '%cHaldwani Sports 🏆',
  'font-size:16px;font-weight:bold;color:#e8291c;'
);
console.log(
  '%cQuality Sportswear & Equipment at Reasonable Prices.',
  'font-size:12px;color:#aaa;'
);
