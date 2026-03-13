document.addEventListener("DOMContentLoaded", function () {
    // Highlight active menu button based on current page
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // Try both class selectors (new and old navbar structures)
    const menuButtons = document.querySelectorAll(".navbar-menu button, .menu button");

    menuButtons.forEach(button => {
        const btnPage = button.getAttribute("data-page") || "";
        const normalizedPage = btnPage.replace(/^\//, "");

        if (normalizedPage === currentPage) {
            button.classList.add("active");
        }

        // Add click handler for navigation
        button.addEventListener("click", function () {
            const href = this.getAttribute("data-page");
            if (href && !href.startsWith('#')) {
                window.location.href = href;
            }
        });
    });

    // Mobile menu toggle with backdrop
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.navbar-menu');

    if (menuToggle && menu) {
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        document.body.appendChild(backdrop);

        // Create close button inside menu
        const closeBtn = document.createElement('button');
        closeBtn.className = 'menu-close';
        closeBtn.setAttribute('aria-label', 'Cerrar menú');
        closeBtn.innerHTML = '&times;';
        menu.prepend(closeBtn);

        function openMenu() {
            menuToggle.classList.add('active');
            menu.classList.add('open');
            backdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            menu.classList.remove('open');
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
    }

    // Logo bird-burst hover effect
    const navLogo = document.querySelector('.navbar-logo');

    if (navLogo) {
        // Bird burst configs: keyframe name, left/right direction, stagger delay, flap speed
        const burstConfigs = [
            { anim: 'burst-ul-far', flip: true,  delay: 0.00, flap: 0.85 },
            { anim: 'burst-ul',     flip: true,  delay: 0.07, flap: 0.95 },
            { anim: 'burst-left',   flip: true,  delay: 0.13, flap: 1.00 },
            { anim: 'burst-ur-far', flip: false, delay: 0.04, flap: 0.90 },
            { anim: 'burst-ur',     flip: false, delay: 0.10, flap: 0.80 },
            { anim: 'burst-right',  flip: false, delay: 0.08, flap: 1.05 },
        ];

        // Icing-palette color filters for each bird
        const birdFilters = [
            'invert(34%) sepia(55%) saturate(427%) hue-rotate(290deg) brightness(1.1) contrast(91%)',
            'invert(34%) sepia(55%) saturate(427%) hue-rotate(141deg) brightness(93%) contrast(91%)',
            'invert(34%) sepia(55%) saturate(500%) hue-rotate(50deg)  brightness(1.2) contrast(91%)',
            'invert(34%) sepia(55%) saturate(427%) hue-rotate(240deg) brightness(1.0) contrast(91%)',
            'invert(34%) sepia(55%) saturate(500%) hue-rotate(10deg)  brightness(1.1) contrast(91%)',
            'invert(34%) sepia(55%) saturate(427%) hue-rotate(200deg) brightness(0.9) contrast(91%)',
        ];

        navLogo.addEventListener('mouseenter', function () {
            if (navLogo.dataset.bursting) return;
            navLogo.dataset.bursting = '1';

            const rect = navLogo.getBoundingClientRect();
            const cx = rect.left + rect.width * 0.3;
            const cy = rect.top  + rect.height / 2;

            burstConfigs.forEach((cfg, i) => {
                const container = document.createElement('div');
                container.className = `bpc${cfg.flip ? ' fly-left' : ''}`;
                container.style.cssText = `left:${cx}px; top:${cy}px; animation:${cfg.anim} 1.3s ${cfg.delay}s ease-out forwards;`;

                const sprite = document.createElement('div');
                sprite.className = 'bird-sprite';
                sprite.style.cssText = `filter:${birdFilters[i]}; --flap-dur:${cfg.flap}s;`;

                container.appendChild(sprite);
                document.body.appendChild(container);
                setTimeout(() => container.remove(), 2000);
            });

            setTimeout(() => { delete navLogo.dataset.bursting; }, 600);
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});
