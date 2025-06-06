    document.addEventListener("DOMContentLoaded", function () {
        const menuToggle = document.createElement("button");
        menuToggle.classList.add("menu-toggle");
        menuToggle.innerHTML = "&#9776;"; // Hamburger menu icon
        document.querySelector(".navbar").insertBefore(menuToggle, document.querySelector(".navbar .menu"));

        menuToggle.addEventListener("click", function () {
            const menu = document.querySelector(".navbar .menu");
            menu.classList.toggle("show");
        });

        // Ensure navigation buttons work correctly
        document.querySelectorAll(".menu button").forEach(button => {
            button.addEventListener("click", function () {
                window.location.href = this.getAttribute("data-page");
            });
        });
    });