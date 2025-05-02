// Configurações de logo
const CONFIG = {
  // Caminhos das imagens do logo
  logoPath: {
    // Tema escuro
    darkSticky: './images/logo-yellow-pink.webp',   // Header normal tema escuro (amarelo)
    darkNormal: './images/logo-blue-pink.webp',     // Header sticky tema escuro (fica azul)
    darkFooter: './images/logo-yellow-pink.webp',   // Footer tema escuro

    // Tema claro
    lightNormal: './images/logo-blue-pink.webp',    // Header normal tema claro (branco)
    lightSticky: './images/logo-white-pink.webp',   // Header sticky tema claro (fica azul)
    lightFooter: './images/logo-blue-pink.webp'     // Footer tema claro
  }
};

// Função para atualizar o logo do header
function updateLogo() {
  const logo = document.getElementById('header-logo');
  if (!logo) return; // Evita erro se não encontrar a logo

  const currentTheme = document.body.getAttribute('data-theme');
  const isScrolled = document.querySelector('.header')?.classList.contains('scrolled');

  // Define qual imagem usar em cada cenário
  let newSrc;

  if (currentTheme === 'light') {
    // No tema claro
    newSrc = isScrolled ? CONFIG.logoPath.lightSticky : CONFIG.logoPath.lightNormal;
  } else {
    // No tema escuro
    newSrc = isScrolled ? CONFIG.logoPath.darkSticky : CONFIG.logoPath.darkNormal;
  }

  // Atualiza só se necessário
  if (logo.src.split('/').pop() !== newSrc.split('/').pop()) {
    logo.src = newSrc;
  }
}

// Função para atualizar o logo do footer
function updateFooterLogo() {
  const footerLogo = document.querySelector('.footer-logo img');
  if (!footerLogo) return;

  const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
  footerLogo.src = isDarkTheme ? CONFIG.logoPath.darkFooter : CONFIG.logoPath.lightFooter;
}

// Preloader
window.addEventListener('load', function () {
  const preloader = document.getElementById('preloader');
  preloader.classList.add('fade-out');
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

// Navigation.js - Solução completa para o header e navegação
document.addEventListener('DOMContentLoaded', function () {
  // Elementos principais
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');

  // Mobile Menu Toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navbar.classList.toggle('active');

      // Atualizar cores do menu mobile quando ativado/desativado
      updateMobileMenuColors();
    });
  }

  // 1. Função para atualizar a aparência do header no scroll
  function updateHeaderOnScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Atualizar logo quando necessário
    updateLogo();

    // Atualizar cores do menu toggle
    updateToggleMenuColor();
  }

  // 2. Função melhorada para destacar o link de navegação ativo
  function highlightActiveLink() {
    const scrollPosition = window.scrollY + 100;

    // Encontrar a seção mais próxima do topo da janela
    let currentSection = '';
    let minDistance = Infinity;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - header.offsetHeight;
      const sectionHeight = section.offsetHeight;
      const distance = Math.abs(scrollPosition - sectionTop);

      // Se estamos dentro da seção ou é a mais próxima até agora
      if ((scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) ||
        distance < minDistance) {
        currentSection = section.getAttribute('id');
        minDistance = distance;
      }
    });

    // Limpar todas as classes ativas
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Adicionar classe ativa ao link correspondente
    if (currentSection) {
      const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }

  // Função para atualizar cores do menu mobile
  function updateMobileMenuColors() {
    const isMobileNavActive = navbar.classList.contains('active');

    if (isMobileNavActive) {
      // Forçar cores para o menu mobile quando aberto
      navLinks.forEach(link => {
        link.style.color = '#ffffff'; // Branco para ambos os temas
      });

      // Ajustar cor das barras do toggle quando menu está aberto
      if (menuToggle) {
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.backgroundColor = '#ffffff';
        });
      }
    } else {
      // Resetar para estilos CSS padrão quando menu está fechado
      navLinks.forEach(link => {
        link.style.color = '';
      });

      // Ajustar cor das barras do toggle com base no tema e scroll
      updateToggleMenuColor();
    }
  }

  // Função para ajustar cor do toggle menu
  function updateToggleMenuColor() {
    if (!menuToggle) return;

    const currentTheme = document.body.getAttribute('data-theme');
    const isScrolled = header.classList.contains('scrolled');
    const spans = menuToggle.querySelectorAll('span');

    if (isScrolled) {
      // Na versão scrolled, sempre ter barras brancas
      spans.forEach(span => {
        span.style.backgroundColor = '#f5f7ff';
      });
    } else if (currentTheme === 'light') {
      // No tema claro não scrolled, barras azuis
      spans.forEach(span => {
        span.style.backgroundColor = '#051259';
      });
    } else {
      // No tema escuro não scrolled com header amarelo, barras azuis
      spans.forEach(span => {
        span.style.backgroundColor = '#051259';
      });
    }
  }

  // 3. Função para rolagem suave e controle de cliques
  function setupSmoothScrolling() {
    // Para links de navegação
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        // Fechar menu móvel
        if (menuToggle && navbar) {
          menuToggle.classList.remove('active');
          navbar.classList.remove('active');
        }

        // Remover todas as classes ativas primeiro
        navLinks.forEach(navLink => {
          navLink.classList.remove('active');
        });

        // Adicionar classe ativa apenas ao link clicado
        this.classList.add('active');

        // Obter o alvo de destino
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Cálculo preciso da posição
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          // Realizar rolagem suave
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Atualizar URL
          history.pushState(null, null, targetId);
        }

        // Atualizar cores do menu mobile após fechar
        updateMobileMenuColors();
      });
    });

    // Para outros links de âncora
    document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Atualizar URL
          history.pushState(null, null, targetId);

          // Atualizar navegação
          const navLink = document.querySelector(`.nav-link[href="${targetId}"]`);
          if (navLink) {
            navLinks.forEach(link => {
              link.classList.remove('active');
            });
            navLink.classList.add('active');
          }
        }
      });
    });
  }

  // 4. Inicializar todas as funções
  function initNavigation() {
    // Aplicar tratamento de scroll
    window.addEventListener('scroll', function () {
      updateHeaderOnScroll();
      highlightActiveLink();
    });

    // Preparar rolagem suave
    setupSmoothScrolling();

    // Executar uma vez na inicialização
    updateHeaderOnScroll();
    highlightActiveLink();
    updateToggleMenuColor();

    // Tratar redimensionamento da janela
    window.addEventListener('resize', function () {
      highlightActiveLink();
      updateToggleMenuColor();
    });
  }

  // Iniciar toda a navegação
  initNavigation();
});


// Destacar etapa atual do processo durante o scroll
function highlightCurrentProcessStep() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length === 0) return;

  const scrollPosition = window.scrollY + window.innerHeight / 2;

  timelineItems.forEach(item => {
    const itemTop = item.offsetTop;
    const itemHeight = item.offsetHeight;

    if (scrollPosition >= itemTop && scrollPosition < itemTop + itemHeight) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Adicione ao evento de scroll
window.addEventListener('scroll', highlightCurrentProcessStep);


// Theme Toggle
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

  // Set initial theme
  document.body.setAttribute('data-theme', currentTheme);

  // Update theme toggle icons
  updateThemeIcons(currentTheme);

  // Ensure logos are updated on page load
  updateLogo();
  updateFooterLogo();

  // Add event listeners to theme toggles
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);

      // Atualizar também as cores do menu toggle e navbar
      setTimeout(() => {
        const header = document.querySelector('.header');
        const navbar = document.querySelector('.navbar');

        if (navbar.classList.contains('active')) {
          // Se o menu mobile estiver ativo, atualizar suas cores
          const navLinks = document.querySelectorAll('.nav-link');
          navLinks.forEach(link => {
            link.style.color = '#ffffff';
          });

          if (document.querySelector('.menu-toggle')) {
            const spans = document.querySelector('.menu-toggle').querySelectorAll('span');
            spans.forEach(span => {
              span.style.backgroundColor = '#ffffff';
            });
          }
        } else {
          // Se não estiver, atualizar o menu toggle baseado no tema e scroll
          if (document.querySelector('.menu-toggle')) {
            const spans = document.querySelector('.menu-toggle').querySelectorAll('span');
            const isScrolled = header.classList.contains('scrolled');

            if (isScrolled) {
              spans.forEach(span => {
                span.style.backgroundColor = '#f5f7ff';
              });
            } else if (newTheme === 'light') {
              spans.forEach(span => {
                span.style.backgroundColor = '#051259';
              });
            } else {
              spans.forEach(span => {
                span.style.backgroundColor = '#051259';
              });
            }
          }
        }
      }, 10);
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

  // Atualiza os logos quando o tema muda
  updateLogo();
  updateFooterLogo();
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
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
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

// Garantir que os logos estejam corretos após o carregamento completo
window.addEventListener('load', function () {
  updateLogo();
  updateFooterLogo();
});