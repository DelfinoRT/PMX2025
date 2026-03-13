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
});
