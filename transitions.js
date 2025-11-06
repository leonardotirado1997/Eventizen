/* ============================================
   GERENCIADOR DE TRANSIÇÕES ENTRE PÁGINAS
   ============================================ */

(function() {
    'use strict';

    // Configurações de transição (customizáveis)
    const TRANSITION_CONFIG = {
        duration: 500, // Duração em ms (300-800ms conforme especificado)
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Easing suave e profissional
        type: 'fade-slide' // Tipo: 'fade-slide', 'scale', 'blur'
    };

    // Detectar direção da navegação
    let navigationDirection = 'forward';
    const historyStack = [];

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Limpar overlay e classes de transição imediatamente ao carregar
        cleanupTransitions();
        
        // Adicionar classe de carregamento ao body
        document.body.classList.add('page-loaded');
        
        // Interceptar todos os links internos
        interceptLinks();
        
        // Detectar navegação do navegador (back/forward)
        window.addEventListener('popstate', handlePopState);
        
        // Adicionar logo se não existir
        ensureLogo();
        
        // Adicionar animações aos elementos principais
        animatePageElements();
    }

    // Limpar transições e overlay
    function cleanupTransitions() {
        // Remover classes de transição
        document.body.classList.remove('transitioning', 'page-exit');
        
        // Remover overlay se existir
        const overlay = document.querySelector('.transition-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 100);
        }
    }

    // Interceptar cliques em links internos
    function interceptLinks() {
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Verificar se é um link interno (HTML)
            if (href && (href.endsWith('.html') || href.startsWith('./') || href.startsWith('/'))) {
                link.addEventListener('click', function(e) {
                    // Não interceptar se for link externo ou âncora
                    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                        return;
                    }
                    
                    e.preventDefault();
                    navigateTo(href);
                });
            }
        });
    }

    // Navegar para uma nova página com transição
    function navigateTo(url) {
        // Determinar direção da navegação
        const currentUrl = window.location.pathname;
        navigationDirection = 'forward';
        
        // Salvar no histórico
        historyStack.push(currentUrl);
        
        // Adicionar classe de transição ao body
        document.body.classList.add('transitioning');
        document.body.classList.add('page-exit');
        
        // Criar overlay de transição
        const overlay = createTransitionOverlay();
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('active'), 10);
        
        // Após a animação de saída, navegar
        const exitDuration = Math.min(TRANSITION_CONFIG.duration * 0.7, 400); // 70% da duração para saída, máximo 400ms
        setTimeout(() => {
            window.location.href = url;
        }, exitDuration);
    }

    // Lidar com navegação do navegador (back/forward)
    function handlePopState(e) {
        navigationDirection = historyStack.length > 0 ? 'back' : 'forward';
        
        // Aplicar animação de entrada reversa
        document.body.classList.add('page-loaded');
        
        // Animar elementos
        animatePageElements();
    }

    // Criar overlay de transição
    function createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        return overlay;
    }

    // Garantir que a logo esteja presente em todas as páginas
    function ensureLogo() {
        // Verificar se já existe logo na página
        const existingLogo = document.querySelector('img[src*="Eventize"], img[src*="Eventize.png"], [style*="Eventize.png"], [data-alt*="Eventize"], [data-alt*="logo"]');
        if (existingLogo) {
            // Se já existe, apenas adicionar animação se não tiver
            if (!existingLogo.classList.contains('logo-animate')) {
                existingLogo.classList.add('logo-animate');
            }
            return;
        }
        
        // Não adicionar logo na página de login (index.html) se já tem logo centralizada
        if (window.location.pathname.includes('index.html') || document.title.includes('Login')) {
            const loginLogo = document.querySelector('[style*="Eventize.png"], [data-alt*="Eventize brand logo"]');
            if (loginLogo) {
                return;
            }
        }
        
        // Procurar por header ou elemento de título
        let header = document.querySelector('header');
        if (!header) {
            // Se não tem header, procurar por elementos que possam ser header
            const topBar = document.querySelector('[class*="top"], [class*="header"], [class*="TopAppBar"]');
            if (topBar) {
                header = topBar;
            } else {
                // Criar um header simples se não existir
                header = document.createElement('header');
                header.className = 'sticky top-0 z-10 flex items-center justify-center p-4 bg-background-light dark:bg-background-dark';
                const body = document.body;
                if (body.firstChild) {
                    body.insertBefore(header, body.firstChild);
                } else {
                    body.appendChild(header);
                }
            }
        }
        
        // Verificar se já tem um título centralizado (h1 ou h2)
        const title = header.querySelector('h1, h2');
        if (title) {
            // Verificar se o título não tem logo
            if (!title.querySelector('img')) {
                // Criar container flexível para logo
                const logoContainer = document.createElement('div');
                logoContainer.className = 'flex items-center justify-center flex-1';
                const logo = document.createElement('img');
                logo.src = 'Eventize.png';
                logo.alt = 'Eventize Logo';
                logo.className = 'h-6 mx-auto logo-animate';
                logo.style.maxWidth = '100px';
                logo.style.height = 'auto';
                
                // Se o título está centralizado, substituir conteúdo
                if (title.classList.contains('text-center') || title.style.textAlign === 'center') {
                    title.innerHTML = '';
                    title.appendChild(logo);
                } else {
                    // Caso contrário, adicionar logo ao lado ou substituir
                    logoContainer.appendChild(logo);
                    title.parentNode.replaceChild(logoContainer, title);
                }
            }
        } else {
            // Se não tem título, criar logo centralizada
            const logoContainer = document.createElement('div');
            logoContainer.className = 'flex items-center justify-center flex-1';
            const logo = document.createElement('img');
            logo.src = 'Eventize.png';
            logo.alt = 'Eventize Logo';
            logo.className = 'h-6 logo-animate';
            logo.style.maxWidth = '100px';
            logo.style.height = 'auto';
            logoContainer.appendChild(logo);
            
            // Adicionar ao header se não tiver filhos centrais
            const centerElement = header.querySelector('[class*="center"], [class*="flex-1"]');
            if (centerElement) {
                centerElement.appendChild(logo);
            } else {
                header.appendChild(logoContainer);
            }
        }
    }

    // Animar elementos da página ao carregar
    function animatePageElements() {
        // Adicionar animação aos elementos principais
        const mainContent = document.querySelector('main');
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
        const sections = document.querySelectorAll('section, [class*="section"]');
        
        if (mainContent) {
            mainContent.classList.add('fade-in-up');
        }
        
        // Animar cards com delay
        cards.forEach((card, index) => {
            if (index < 3) { // Limitar a 3 cards para performance
                card.classList.add(`fade-in-up-delay-${Math.min(index, 2)}`);
            }
        });
        
        // Animar seções
        sections.forEach((section, index) => {
            if (index < 2) {
                section.classList.add(`fade-in-up-delay-${Math.min(index + 1, 2)}`);
            }
        });
    }

    // Limpar classes de transição após animação
    window.addEventListener('load', function() {
        cleanupTransitions();
    });

    // Limpar também quando a página fica visível (ao voltar com back button)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            cleanupTransitions();
        }
    });

    // Limpar ao carregar completamente
    if (document.readyState === 'complete') {
        cleanupTransitions();
    }

    // Expor configuração globalmente para fácil customização
    window.PageTransitions = {
        config: TRANSITION_CONFIG,
        setDuration: function(ms) {
            if (ms >= 300 && ms <= 800) {
                TRANSITION_CONFIG.duration = ms;
            }
        },
        setType: function(type) {
            if (['fade-slide', 'scale', 'blur'].includes(type)) {
                TRANSITION_CONFIG.type = type;
            }
        }
    };

})();

