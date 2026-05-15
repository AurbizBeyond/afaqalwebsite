// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(13, 27, 42, 0.98)';
    } else {
      navbar.style.background = 'rgba(13, 27, 42, 0.95)';
    }
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ===== HERO CAROUSEL =====
function initCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!slides.length) return;

  let current = 0;
  let interval;

  function goTo(n) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startInterval() {
    interval = setInterval(next, 5000);
  }

  function resetInterval() {
    clearInterval(interval);
    startInterval();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetInterval(); });
  });

  const nextBtn = document.querySelector('.carousel-next');
  const prevBtn = document.querySelector('.carousel-prev');
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetInterval(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetInterval(); });

  startInterval();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .service-full-card, .testimonial-card, .about-feature, .contact-item, .why-us-item, .value-item, .contact-detail, .stat-item').forEach(el => {
    el.classList.add('animate-ready');
    observer.observe(el);
  });

  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .animate-ready {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-ready:nth-child(2) { transition-delay: 0.1s; }
    .animate-ready:nth-child(3) { transition-delay: 0.2s; }
    .animate-ready:nth-child(4) { transition-delay: 0.3s; }
    .animate-ready:nth-child(5) { transition-delay: 0.1s; }
    .animate-ready:nth-child(6) { transition-delay: 0.2s; }
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ===== FORM HANDLER =====
function initForms() {
  document.querySelectorAll('.enquiry-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        const success = form.closest('.contact-form, .contact-form-card')?.querySelector('.form-success');
        if (success) {
          form.style.display = 'none';
          success.style.display = 'block';
        } else {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
          setTimeout(() => {
            btn.textContent = 'Send Message';
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
          }, 3000);
        }
      }, 1200);
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCarousel();
  initScrollAnimations();
  initCounters();
  initForms();
});
