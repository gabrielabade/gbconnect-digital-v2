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
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
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

  // Função para sincronizar corretamente os efeitos visuais dos links ativos
  function syncActiveLinks() {
    // Esta função garante que apenas um link tenha a classe 'active'
    // e que o efeito visual seja consistente
    const activeLinks = document.querySelectorAll('.nav-link.active');

    // Se houver mais de um link ativo, manter apenas o mais recente
    if (activeLinks.length > 1) {
      // Remover a classe de todos exceto o último
      for (let i = 0; i < activeLinks.length - 1; i++) {
        activeLinks[i].classList.remove('active');
      }
    }
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
    // Ajustar ponto de referência para melhor detecção
    const scrollPosition = window.scrollY + (window.innerHeight * 0.15); // 15% da altura da janela

    // Armazenar informações sobre todas as seções
    const sectionsData = [];

    // Coletar dados de todas as seções
    sections.forEach(section => {
      const id = section.getAttribute('id');
      const top = section.offsetTop - header.offsetHeight - 10; // Pequeno offset adicional
      const bottom = top + section.offsetHeight;
      const height = section.offsetHeight;
      const middle = top + (height / 2);

      sectionsData.push({
        id: id,
        top: top,
        bottom: bottom,
        middle: middle,
        height: height
      });
    });

    // Ordenar seções verticalmente (do topo para baixo)
    sectionsData.sort((a, b) => a.top - b.top);

    // Encontrar seção atual usando algoritmo mais preciso
    let currentSection = '';

    // 1. Primeiro, verificar se estamos dentro de alguma seção
    let inSection = false;
    for (const section of sectionsData) {
      if (scrollPosition >= section.top && scrollPosition < section.bottom) {
        currentSection = section.id;
        inSection = true;
        break;
      }
    }

    // 2. Se não estamos dentro de nenhuma seção, encontrar a mais próxima
    if (!inSection) {
      let closestSection = null;
      let minDistance = Infinity;

      for (const section of sectionsData) {
        // Calcular distância absoluta entre o ponto de scroll e o meio da seção
        const distance = Math.abs(scrollPosition - section.middle);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = section;
        }
      }

      if (closestSection) {
        currentSection = closestSection.id;
      }
    }

    // 3. Aplicar classe ativa apenas se encontrou uma seção
    if (currentSection) {
      // Remover classes ativas de todos os links
      navLinks.forEach(link => {
        link.classList.remove('active');
      });

      // Adicionar classe ativa ao link correspondente
      const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        // Sincronizar links ativos após adicionar a classe
        syncActiveLinks();
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
    // Flag para controlar se o destaque automático deve ser pausado
    let isManualScroll = false;
    let manualScrollTimeout;

    // Para links de navegação
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        // Fechar menu móvel
        if (menuToggle && navbar) {
          menuToggle.classList.remove('active');
          navbar.classList.remove('active');
        }

        // Pausar o destaque automático temporariamente
        isManualScroll = true;
        clearTimeout(manualScrollTimeout);

        // Remover todas as classes ativas primeiro
        navLinks.forEach(navLink => {
          navLink.classList.remove('active');
        });

        // Adicionar classe ativa apenas ao link clicado
        this.classList.add('active');
        // Sincronizar links ativos
        syncActiveLinks();

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

          // Reativar o destaque automático após a conclusão da rolagem
          manualScrollTimeout = setTimeout(() => {
            isManualScroll = false;
          }, 1000); // Tempo suficiente para completar a animação
        }

        // Atualizar cores do menu mobile após fechar
        updateMobileMenuColors();
      });
    });

    // Modificar a função highlightActiveLink para respeitar a flag
    window.highlightActiveLink = function () {
      // Se estiver em rolagem manual, não faça nada
      if (isManualScroll) return;

      // O restante da função continua igual...
      // Ajustar ponto de referência para melhor detecção
      const scrollPosition = window.scrollY + (window.innerHeight * 0.15); // 15% da altura da janela

      // Armazenar informações sobre todas as seções
      const sectionsData = [];

      // Coletar dados de todas as seções
      sections.forEach(section => {
        const id = section.getAttribute('id');
        const top = section.offsetTop - header.offsetHeight - 10; // Pequeno offset adicional
        const bottom = top + section.offsetHeight;
        const height = section.offsetHeight;
        const middle = top + (height / 2);

        sectionsData.push({
          id: id,
          top: top,
          bottom: bottom,
          middle: middle,
          height: height
        });
      });

      // Ordenar seções verticalmente (do topo para baixo)
      sectionsData.sort((a, b) => a.top - b.top);

      // Encontrar seção atual usando algoritmo mais preciso
      let currentSection = '';

      // 1. Primeiro, verificar se estamos dentro de alguma seção
      let inSection = false;
      for (const section of sectionsData) {
        if (scrollPosition >= section.top && scrollPosition < section.bottom) {
          currentSection = section.id;
          inSection = true;
          break;
        }
      }

      // 2. Se não estamos dentro de nenhuma seção, encontrar a mais próxima
      if (!inSection) {
        let closestSection = null;
        let minDistance = Infinity;

        for (const section of sectionsData) {
          // Calcular distância absoluta entre o ponto de scroll e o meio da seção
          const distance = Math.abs(scrollPosition - section.middle);

          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        }

        if (closestSection) {
          currentSection = closestSection.id;
        }
      }

      // 3. Aplicar classe ativa apenas se encontrou uma seção
      if (currentSection) {
        // Remover classes ativas de todos os links
        navLinks.forEach(link => {
          link.classList.remove('active');
        });

        // Adicionar classe ativa ao link correspondente
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          // Sincronizar links ativos
          syncActiveLinks();
        }
      }
    }

    // Para outros links de âncora (mantido igual)
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
            // Sincronizar links ativos
            syncActiveLinks();
          }
        }
      });
    });
  }

  // Ajustar também a inicialização do scroll para usar a função corrigida
  function initNavigation() {
    // Aplicar tratamento de scroll com throttling para melhor performance
    let scrollTimeout;

    window.addEventListener('scroll', function () {
      updateHeaderOnScroll();

      // Usar throttling para melhorar a performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        if (typeof window.highlightActiveLink === 'function') {
          window.highlightActiveLink();
        }
      }, 100);
    });

    // Preparar rolagem suave
    setupSmoothScrolling();

    // Executar uma vez na inicialização
    updateHeaderOnScroll();
    if (typeof window.highlightActiveLink === 'function') {
      window.highlightActiveLink();
    }
    updateToggleMenuColor();

    // Tratar redimensionamento da janela
    window.addEventListener('resize', function () {
      if (typeof window.highlightActiveLink === 'function') {
        window.highlightActiveLink();
      }
      updateToggleMenuColor();
    });
  }

  // Iniciar toda a navegação
  initNavigation();

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

  // Inicializar Accordion (corrigido)
  function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (accordionHeaders.length === 0) return;

    accordionHeaders.forEach(header => {
      // Remover manipuladores anteriores para evitar duplicação
      const newHeader = header.cloneNode(true);
      header.parentNode.replaceChild(newHeader, header);

      newHeader.addEventListener('click', function () {
        const accordionItem = this.parentElement;
        const accordionContent = this.nextElementSibling;
        const icon = this.querySelector('i');

        // Toggle active class
        accordionItem.classList.toggle('active');

        // Toggle content visibility
        if (accordionItem.classList.contains('active')) {
          accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';

          if (icon) {
            icon.classList.remove('bx-plus');
            icon.classList.add('bx-minus');
          }
        } else {
          accordionContent.style.maxHeight = '0';

          if (icon) {
            icon.classList.add('bx-plus');
            icon.classList.remove('bx-minus');
          }
        }

        // Fechar outros items
        document.querySelectorAll('.accordion-item').forEach(item => {
          if (item !== accordionItem && item.classList.contains('active')) {
            item.classList.remove('active');

            const content = item.querySelector('.accordion-content');
            if (content) {
              content.style.maxHeight = '0';
            }

            const itemIcon = item.querySelector('.accordion-header i');
            if (itemIcon) {
              itemIcon.classList.add('bx-plus');
              itemIcon.classList.remove('bx-minus');
            }
          }
        });
      });
    });
  }

  // Inicialização de links sociais (corrigido)
  function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links a');

    socialLinks.forEach(link => {
      // Garantir que links externos funcionem corretamente
      const href = link.getAttribute('href');

      if (href && (href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('http://'))) {
        // Não fazer nada - deixar o comportamento padrão para links externos
      } else if (href && href.startsWith('#')) {
        // Para links internos de navegação, garantir que o scroll suave funcione
        link.addEventListener('click', function (e) {
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

            // Atualizar URL
            history.pushState(null, null, targetId);
          }
        });
      }
    });
  }

  // Inicializar accordion e links sociais
  initAccordion();
  initSocialLinks();

  
  // Theme Toggle aprimorado com sincronização do sistema
  function initThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');

    // Detecção de preferência do sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Verifica armazenamento local OU preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');

    // Define tema inicial
    document.body.setAttribute('data-theme', currentTheme);

    // Update theme toggle icons
    updateThemeIcons(currentTheme);

    // Ensure logos are updated on page load
    updateLogo();
    updateFooterLogo();

    // Adiciona um ouvinte para mudanças na preferência do sistema
    prefersDarkScheme.addEventListener('change', (e) => {
      // Só muda automaticamente se o usuário não tiver definido uma preferência manual
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        updateThemeIcons(newTheme);
        updateLogo();
        updateFooterLogo();

        // Atualiza cores de interface
        updateInterfaceColors(newTheme);
      }
    });

    // Add event listeners to theme toggles
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);

        // Atualizar também as cores do menu toggle e navbar
        updateInterfaceColors(newTheme);
      });
    });

    // Função auxiliar para atualizar cores da interface
    function updateInterfaceColors(theme) {
      setTimeout(() => {
        const header = document.querySelector('.header');
        const navbar = document.querySelector('.navbar');

        if (navbar && navbar.classList.contains('active')) {
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
            const isScrolled = header && header.classList.contains('scrolled');

            if (isScrolled) {
              spans.forEach(span => {
                span.style.backgroundColor = '#f5f7ff';
              });
            } else if (theme === 'light') {
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
    }
  }

  function updateThemeIcons(theme) {
    const themeToggles = document.querySelectorAll('.theme-toggle');

    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      if (!icon) return;

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

  // Initialize Theme Toggle
  initThemeToggle();

  // Initialize Swipers
  function initSwipers() {
    if (typeof Swiper === 'undefined') {
      console.error('Swiper is not defined. Check if the script is loaded correctly.');
      return;
    }

    // Portfolio Swiper
    try {
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
    } catch (error) {
      console.error('Error initializing portfolio slider:', error);
    }

    // Testimonials Swiper
    try {
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
    } catch (error) {
      console.error('Error initializing testimonials slider:', error);
    }
  }

  // Initialize all swipers after the page is fully loaded
  window.addEventListener('load', function () {
    setTimeout(initSwipers, 500); // Slight delay to ensure DOM is fully ready
  });
});

// WhatsApp Form Submission
function sendToWhatsApp() {
  // Form validation
  const name = document.getElementById('name')?.value.trim();
  const company = document.getElementById('company')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  // Check if all required elements exist
  if (!name || !phone || !email || !message) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return false;
  }

  // Get selected services - versão atualizada para os checkboxes personalizados
  const servicesChecked = document.querySelectorAll('input[name="service"]:checked');
  const services = Array.from(servicesChecked)
    .map(checkbox => {
      const serviceValue = checkbox.value;
      let serviceName = '';

      switch (serviceValue) {
        case 'site':
          serviceName = 'Site Profissional';
          break;
        case 'google':
          serviceName = 'Google Meu Negócio';
          break;
        case 'redes':
          serviceName = 'Gestão de Redes Sociais';
          break;
      }

      return serviceName;
    })
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

// Adicionar classe 'selected' para opções de serviço quando selecionadas
document.addEventListener('DOMContentLoaded', function () {
  const serviceOptions = document.querySelectorAll('.service-option');

  serviceOptions.forEach(option => {
    const checkbox = option.querySelector('input[type="checkbox"]');

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
  });
});

// Exit Popup
function initExitPopup() {
  const exitPopup = document.getElementById('exitPopup');
  if (!exitPopup) return;

  const closePopupBtn = document.querySelector('.popup-close');
  const dismissBtn = document.querySelector('.popup-dismiss');

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
  if (typeof ScrollReveal === 'undefined') {
    console.warn('ScrollReveal is not defined. Check if the script is loaded correctly.');
    return;
  }

  try {
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

    // Contact Section - atualizado para nova estrutura
    sr.reveal('.contact-left', { origin: 'left', delay: 200 });
    sr.reveal('.contact-form', { origin: 'right', delay: 300 });
  } catch (error) {
    console.error('Error initializing ScrollReveal:', error);
  }
}

// Initialize ScrollReveal after the page is loaded
window.addEventListener('load', initScrollReveal);

// Particles Animation - VERSÃO OTIMIZADA E PROFISSIONAL
function initParticles() {
  console.log('Initializing particles...');
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context from canvas!');
    return;
  }

  // Definir tamanho do canvas precisamente
  function setCanvasSize() {
    const container = canvas.parentElement;
    if (!container) {
      console.error('Canvas parent element not found!');
      return;
    }

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
  }

  setCanvasSize();
  window.addEventListener('resize', () => {
    setCanvasSize();
    initParticleSystem(); // Reinicializar partículas quando o tamanho mudar
  });

  // Detecção de tema para adaptação de cores
  const isDarkTheme = () => document.body.getAttribute('data-theme') !== 'light';

  // Configuração de partículas adaptativa ao tema
  function getThemeColors() {
    if (isDarkTheme()) {
      return ['rgba(242, 48, 120, 0.5)', 'rgba(207, 243, 5, 0.5)', 'rgba(255, 255, 255, 0.3)'];
    } else {
      return ['rgba(5, 18, 89, 0.4)', 'rgba(242, 48, 120, 0.3)', 'rgba(0, 0, 0, 0.1)'];
    }
  }

  // Configurações responsivas
  const getParticleCount = () => window.innerWidth < 768 ? 50 : (window.innerWidth < 1200 ? 80 : 100);
  const getConnectionDistance = () => window.innerWidth < 768 ? 100 : 150;
  const getMouseRadius = () => window.innerWidth < 768 ? 80 : 120;

  // Configurações dinâmicas
  let particleCount = getParticleCount();
  let connectionDistance = getConnectionDistance();
  let particles = [];
  let colors = getThemeColors();

  // Posição do mouse para interação
  const mouse = {
    x: null,
    y: null,
    radius: getMouseRadius()
  };

  // Rastrear movimento do mouse
  window.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Detectar toque na tela para dispositivos móveis
  window.addEventListener('touchmove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  });

  // Resetar posição do mouse quando inativo
  window.addEventListener('mouseout', function () {
    mouse.x = null;
    mouse.y = null;
  });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('touchend', function () {
    setTimeout(function () {
      mouse.x = null;
      mouse.y = null;
    }, 100);
  });

  // Classe de Partícula melhorada
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 15) + 5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.speedY = Math.random() * 0.8 - 0.4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.angle = Math.random() * 360;
      this.pulsate = Math.random() * 0.05 + 0.01;
      this.pulsateDirection = Math.random() > 0.5 ? 1 : -1;
      this.originalSize = this.size;
    }

    // Atualizar cor quando o tema mudar
    updateColor() {
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      // Movimentação com rotação suave
      this.angle += 0.2;
      this.x += this.speedX + Math.sin(this.angle * Math.PI / 180) * 0.05;
      this.y += this.speedY + Math.cos(this.angle * Math.PI / 180) * 0.05;

      // Pulsar tamanho para efeito de vida
      this.size += this.pulsate * this.pulsateDirection;
      if (this.size > this.originalSize * 1.5 || this.size < this.originalSize * 0.7) {
        this.pulsateDirection *= -1;
      }

      // Inverter direção nas bordas com suavidade
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX = -this.speedX * 0.95;
        this.x = Math.max(0, Math.min(this.x, canvas.width));
      }

      if (this.y < 0 || this.y > canvas.height) {
        this.speedY = -this.speedY * 0.95;
        this.y = Math.max(0, Math.min(this.y, canvas.height));
      }

      // Interação com mouse aprimorada
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const pushFactor = 0.65;

          this.speedX += forceDirectionX * force * pushFactor;
          this.speedY += forceDirectionY * force * pushFactor;

          // Aumentar temporariamente o tamanho quando interagindo
          this.size = Math.min(this.size * 1.03, this.originalSize * 2.5);
        }
      }

      // Amortecimento de velocidade
      this.speedX *= 0.96;
      this.speedY *= 0.96;

      // Retorno suave à posição original
      if (Math.abs(this.x - this.baseX) > 150 || Math.abs(this.y - this.baseY) > 150) {
        const dx = this.baseX - this.x;
        const dy = this.baseY - this.y;
        this.speedX += dx * 0.0005 * this.density;
        this.speedY += dy * 0.0005 * this.density;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Inicializar partículas
  function initParticleSystem() {
    particles.length = 0; // Limpar partículas existentes
    particleCount = getParticleCount();
    connectionDistance = getConnectionDistance();
    mouse.radius = getMouseRadius();
    colors = getThemeColors();

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    console.log(`Created ${particles.length} particles`);
  }

  // Desenhar linhas conectando partículas próximas com gradientes
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = 1 - (distance / connectionDistance);

          // Gradiente para linhas mais interessantes
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );

          // Extrai as cores base das partículas para o gradiente
          gradient.addColorStop(0, particles[i].color);
          gradient.addColorStop(1, particles[j].color);

          ctx.beginPath();
          ctx.strokeStyle = isDarkTheme()
            ? `rgba(255, 255, 255, ${opacity * 0.25})`
            : `rgba(5, 18, 89, ${opacity * 0.15})`;
          ctx.lineWidth = Math.min(particles[i].size, particles[j].size) * 0.3;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Loop de animação aprimorado
  function animate() {
    // Efeito de rastro suave
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adicionar desvanecimento para rastro sutil
    ctx.fillStyle = isDarkTheme()
      ? 'rgba(5, 25, 69, 0.04)'
      : 'rgba(245, 247, 255, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Primeiro desenhar as conexões para ficarem abaixo das partículas
    connectParticles();

    // Depois desenhar as partículas
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  // Iniciar sistema de partículas
  initParticleSystem();
  animate();

  console.log('Particles animation started successfully');

  // Monitorar mudanças de tema para adaptar cores
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === 'data-theme') {
        colors = getThemeColors();
        particles.forEach(particle => particle.updateColor());
      }
    });
  });

  observer.observe(document.body, { attributes: true });

  // Verificação para garantir que partículas estejam visíveis
  setTimeout(() => {
    const pixelCheck = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1);
    const hasContent = pixelCheck.data[3] > 0;
    if (!hasContent) {
      console.warn('Particles may not be visible. Checking canvas state...');
      console.log('Canvas dimensions:', canvas.width, canvas.height);
      console.log('Particle count:', particles.length);
    }
  }, 1000);
}

// Inicializar partículas após carregamento completo
document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    console.log('Canvas found during DOMContentLoaded, waiting for full page load...');
  } else {
    console.error('Canvas element not found during DOMContentLoaded!');
  }
});

window.addEventListener('load', function () {
  console.log('Window loaded, initializing particles...');
  // Pequeno atraso para garantir que tudo esteja renderizado
  setTimeout(initParticles, 300);

  // Garantir que os logos estejam corretos após o carregamento completo
  updateLogo();
  updateFooterLogo();
});

// Solução para o problema de sobreposição dos social links
document.addEventListener('DOMContentLoaded', function () {
  // 1. Limitar a altura da seção hero e seus elementos internos
  const heroSection = document.getElementById('home');
  if (heroSection) {
    // Garantir que a altura seja explícita para conter os elementos
    heroSection.style.overflow = "hidden";
  }

  // 2. Corrigir a área dos links sociais
  const socialLinks = document.querySelector('.social-links');
  if (socialLinks) {
    // Redefinir tamanho e posição
    socialLinks.style.position = "relative";
    socialLinks.style.zIndex = "5";
    socialLinks.style.height = "auto";
    socialLinks.style.marginBottom = "0";
    socialLinks.style.paddingBottom = "0";
    socialLinks.style.bottom = "0";

    // 3. Corrigir cada link individualmente
    const links = socialLinks.querySelectorAll('a');
    links.forEach(link => {
      // Garantir que cada link tenha tamanho explícito e posição correta
      link.style.position = "relative";
      link.style.display = "inline-flex";
      link.style.alignItems = "center";
      link.style.justifyContent = "center";
      link.style.width = "4.5rem";
      link.style.height = "4.5rem";
      link.style.margin = "0 10px";
      link.style.zIndex = "10";
      link.style.pointerEvents = "auto";

      // Adicionar evento de clique direto
      link.onclick = function (e) {
        e.stopPropagation(); // Impedir propagação do evento
        window.open(this.href, '_blank');
        return false;
      };
    });
  }

  // 4. Garantir que a wave não esteja causando problemas
  const heroWave = document.querySelector('.hero-wave');
  if (heroWave) {
    heroWave.style.pointerEvents = "none"; // Desabilitar eventos na wave
  }

  // 5. Corrigir a próxima seção para ter uma separação clara
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    aboutSection.style.position = "relative";
    aboutSection.style.zIndex = "3";
    aboutSection.style.marginTop = "0";
    aboutSection.style.paddingTop = "5rem";
  }

  console.log("Fixed potential overlap issues with social links");
});