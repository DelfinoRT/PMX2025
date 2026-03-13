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
        button.addEventListener("click", function (e) {
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
