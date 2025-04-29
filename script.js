// Preloader
window.addEventListener('load', function () {
  const preloader = document.getElementById('preloader');
  preloader.classList.add('fade-out');
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle) {
  menuToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navbar.classList.toggle('active');
  });
}

// Close menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navbar.classList.remove('active');
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without reload
      history.pushState(null, null, targetId);
    }
  });
});

// Header scroll effect
window.addEventListener('scroll', function () {
  const header = document.querySelector('.header');
  const scrollPosition = window.scrollY;

  if (scrollPosition > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Active menu item on scroll
function setActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  let currentSection = '';
  const scrollPosition = window.scrollY;
  const headerHeight = document.querySelector('.header').offsetHeight;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 100;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNavLink);

// Theme Toggle
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

  // Set initial theme
  document.body.setAttribute('data-theme', currentTheme);

  // Update theme toggle icons
  updateThemeIcons(currentTheme);

  // Add event listeners to theme toggles
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const themeToggles = document.querySelectorAll('.theme-toggle');

  themeToggles.forEach(toggle => {
    const icon = toggle.querySelector('i');

    if (theme === 'dark') {
      icon.classList.remove('bx-moon');
      icon.classList.add('bx-sun');
    } else {
      icon.classList.remove('bx-sun');
      icon.classList.add('bx-moon');
    }
  });
}

initThemeToggle();

// Initialize Swipers
function initSwipers() {
  // Portfolio Swiper
  new Swiper('.portfolio-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
    effect: 'slide',
    speed: 600,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.portfolio-slider .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.portfolio-slider .swiper-button-next',
      prevEl: '.portfolio-slider .swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
    on: {
      init: function () {
        setTimeout(() => this.update(), 100);
      }
    }
  });

  // Testimonials Swiper
  new Swiper('.testimonials-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    speed: 800,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.testimonials-slider .swiper-pagination',
      clickable: true,
    }
  });
}

// Initialize all swipers after the page is fully loaded
window.addEventListener('load', initSwipers);

// Accordion
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const accordionItem = header.parentElement;
    const accordionContent = header.nextElementSibling;
    const icon = header.querySelector('i');

    // Toggle active class
    accordionItem.classList.toggle('active');

    // Toggle icon
    if (icon) {
      icon.classList.toggle('bx-plus');
      icon.classList.toggle('bx-minus');
    }

    // Toggle content visibility
    if (accordionItem.classList.contains('active')) {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
    } else {
      accordionContent.style.maxHeight = '0';
    }

    // Close other accordion items
    document.querySelectorAll('.accordion-item').forEach(item => {
      if (item !== accordionItem && item.classList.contains('active')) {
        item.classList.remove('active');

        const itemIcon = item.querySelector('.accordion-header i');
        if (itemIcon) {
          itemIcon.classList.add('bx-plus');
          itemIcon.classList.remove('bx-minus');
        }

        const content = item.querySelector('.accordion-content');
        content.style.maxHeight = '0';
      }
    });
  });
});

// WhatsApp Form Submission
function sendToWhatsApp() {
  // Form validation
  const form = document.getElementById('contactForm');
  const name = document.getElementById('name').value.trim();
  const company = document.getElementById('company').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Validation checks
  if (!name || !phone || !email || !message) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return false;
  }

  // Get selected services
  const services = Array.from(document.querySelectorAll('input[name="service"]:checked'))
    .map(checkbox => checkbox.nextElementSibling.textContent.trim())
    .join(", ");

  // Format WhatsApp message
  const whatsappMessage = `Olá, meu nome é *${name}*!  
───────────────  
📋 *Dados do Contato*  
- Empresa: *${company || "Não informada"}*  
- Email: *${email}*  
- Telefone: *${phone}*  
- Serviços: *${services || "Não especificado"}*  
  
💬 *Mensagem*  
${message}  
  
Gostaria de mais informações. Aguardo seu retorno!`;

  // Redirect to WhatsApp with the message
  window.open(`https://wa.me/5548991056014?text=${encodeURIComponent(whatsappMessage)}`, "_blank");

  return true;
}

// Exit Popup
function initExitPopup() {
  const exitPopup = document.getElementById('exitPopup');
  const closePopupBtn = document.querySelector('.popup-close');
  const dismissBtn = document.querySelector('.popup-dismiss');

  if (!exitPopup) return;

  // Close popup function
  function closePopup() {
    exitPopup.classList.remove('show');
  }

  // Show popup when user tries to leave
  let showOnce = false;
  let sessionShown = sessionStorage.getItem('exitPopupShown') === 'true';

  // Don't show if already shown in this session
  if (sessionShown) return;

  // Set timer to show popup after 30 seconds
  setTimeout(() => {
    if (!showOnce && document.visibilityState === 'visible') {
      exitPopup.classList.add('show');
      sessionStorage.setItem('exitPopupShown', 'true');
      showOnce = true;
    }
  }, 30000);

  // Show popup when mouse leaves the window
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 5 && !showOnce && window.scrollY > 100) {
      exitPopup.classList.add('show');
      sessionStorage.setItem('exitPopupShown', 'true');
      showOnce = true;
    }
  });

  // Close button events
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', closePopup);
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', closePopup);
  }

  // Close when clicking outside
  exitPopup.addEventListener('click', (e) => {
    if (e.target === exitPopup) {
      closePopup();
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && exitPopup.classList.contains('show')) {
      closePopup();
    }
  });
}

// Initialize exit popup after page is loaded
window.addEventListener('load', initExitPopup);

// Scroll Reveal Animations
function initScrollReveal() {
  if (typeof ScrollReveal === 'undefined') return;

  const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 800,
    delay: 200,
    reset: false,
    easing: 'ease-in-out'
  });

  // Hero Section
  sr.reveal('.hero-title', { origin: 'top', delay: 200 });
  sr.reveal('.hero-subtitle', { origin: 'top', delay: 300 });
  sr.reveal('.hero-stats', { delay: 400 });
  sr.reveal('.mini-services', { delay: 500 });
  sr.reveal('.hero-cta', { delay: 600 });
  sr.reveal('.trust-badges', { delay: 700 });
  sr.reveal('.social-links', { delay: 800 });
  sr.reveal('.hero-image', { origin: 'right', delay: 300 });

  // About Section
  sr.reveal('.about-image', { origin: 'left', delay: 200 });
  sr.reveal('.about-text', { origin: 'right', delay: 300 });

  // Services Section
  sr.reveal('.service-card', { interval: 200 });
  sr.reveal('.site-type-card', { interval: 150 });

  // Process Section
  sr.reveal('.timeline-item', { interval: 200 });
  sr.reveal('.trust-feature', { interval: 150 });

  // Portfolio Section
  sr.reveal('.portfolio-slider', { delay: 200 });

  // Testimonials Section
  sr.reveal('.testimonials-slider', { delay: 200 });

  // FAQ Section
  sr.reveal('.accordion-item', { interval: 150 });

  // Contact Section
  sr.reveal('.contact-info', { origin: 'left', delay: 200 });
  sr.reveal('.contact-form', { origin: 'right', delay: 300 });
}

// Initialize ScrollReveal after the page is loaded
window.addEventListener('load', initScrollReveal);

// Particles Animation
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Set canvas size
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);

  // Particle configuration
  const particleCount = window.innerWidth < 768 ? 50 : 100;
  const particles = [];
  const colors = ['#f23078', '#051259', '#cff305'];

  // Mouse position for interaction
  const mouse = {
    x: null,
    y: null,
    radius: window.innerWidth < 768 ? 80 : 120
  };

  // Track mouse movement
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  // Reset mouse position when inactive
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      // Move particles
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX = -this.speedX;
      }

      if (this.y < 0 || this.y > canvas.height) {
        this.speedY = -this.speedY;
      }

      // Interaction with mouse
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;

          this.speedX += forceDirectionX * force;
          this.speedY += forceDirectionY * force;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
    }
  }

  // Initialize particles
  function initParticleSystem() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connecting lines between close particles
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = 1 - (distance / 120);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(5, 18, 89, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    connectParticles();
    requestAnimationFrame(animate);
  }

  // Start particle animation
  initParticleSystem();
  animate();
}

// Initialize particles after the page is loaded
window.addEventListener('load', initParticles);