document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Animation d'entrée avec GSAP (Style i.html)
    if (typeof gsap !== 'undefined') {
        gsap.from(".hero-content h1", {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: "power4.out",
            delay: 0.2
        });

        gsap.from(".hero-image", {
            duration: 1.5,
            x: 100,
            opacity: 0,
            ease: "power4.out",
            delay: 0.5
        });
    }

    // 1. Apparition fluide au défilement (Scroll Reveal)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // On cible les cartes et le hero pour l'animation
    document.querySelectorAll('.domain-card, .hero-content, .stats-card, .testimonial-card, .news-card, .news-filters, .hero, .partner-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // 2. Animation des chiffres (Compteur de l'impact)
    const animateNumbers = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Lancer le compteur pour le chiffre "2847"
    const impactNum = document.querySelector('.impact-number');
    if(impactNum) {
        animateNumbers(impactNum, 0, 100, 2000);
    }

    // 3. Effet de "Hover" Glassmorphism (Inclinaison 3D légère)
    const cards = document.querySelectorAll('.domain-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { x, y, width, height } = card.getBoundingClientRect();
            const dx = e.clientX - (x + width / 2);
            const dy = e.clientY - (y + height / 2);
            card.style.transform = `perspective(1000px) rotateX(${-dy / 20}deg) rotateY(${dx / 20}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // 4. Navigation active fluide
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 5. Menu Burger Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-links');

    if (menuToggle && navContainer) {
        menuToggle.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Fermer le menu automatiquement quand on clique sur un lien
        navContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navContainer.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });
    }

    // 6. Gestion du Mode Sombre / Clair
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const updateThemeIcon = (isDark) => {
        if (themeToggle) {
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    };

    const setTheme = (theme, save = true) => {
        const isDark = theme === 'dark';
        body.classList.toggle('dark-mode', isDark);
        updateThemeIcon(isDark);
        if (save) localStorage.setItem('theme', theme);
    };

    // Initialisation
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme, false);
    } else {
        setTheme(systemPrefersDark.matches ? 'dark' : 'light', false);
    }

    // Écouteur pour les changements du système (mode automatique réactif)
    systemPrefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isNowDark = !body.classList.contains('dark-mode');
            setTheme(isNowDark ? 'dark' : 'light', true);
        });
    }

    // 7. Filtrage des actualités
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                newsCards.forEach(card => {
                    const category = card.dataset.category;
                    card.style.display = (filter === 'all' || filter === category) ? 'flex' : 'none';
                });
            });
        });
    }
});