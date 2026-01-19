    document.addEventListener("DOMContentLoaded", function () {
        // Falling feather effect

        function createFeather() {
            const feather = document.createElement('span');
            feather.innerHTML = '<span class="feather-emoji">🪶</span>';
            feather.className = 'falling-feather';
            // Random horizontal position (0-100vw)
            feather.style.left = Math.random() * 100 + 'vw';
            // Random size (scale)
            const scale = 0.7 + Math.random() * 0.7;
            feather.style.fontSize = (24 * scale) + 'px';
            // Even more transparent opacity (applied to inner span for emoji)
            const featherEmoji = feather.querySelector('.feather-emoji');
            // Range: 0.08 (very transparent) to 0.45 (less transparent)
            featherEmoji.style.opacity = (0.08 + Math.random() * 0.37).toFixed(2);
            // Slower fall: random animation duration (6-12s)
            const duration = 6 + Math.random() * 6;
            feather.style.animationDuration = duration + 's';
            // Random end height (60-100vh)
            const endY = 60 + Math.random() * 40; // percent of viewport height
            feather.style.setProperty('--endY', endY + 'vh');
            // Random delay for more natural effect
            feather.style.animationDelay = (Math.random() * 2) + 's';
            // Randomly mirror vertically (flip horizontally)
            if (Math.random() > 0.5) {
                feather.style.transform = 'scaleX(-1)';
            }
            document.body.appendChild(feather);
            // Remove after animation
            feather.addEventListener('animationend', () => feather.remove());
        }
        setInterval(createFeather, 700); // Create a feather every 0.7s (slower)

        const menuToggle = document.createElement("button");
        menuToggle.classList.add("menu-toggle");
        menuToggle.innerHTML = "&#9776;"; // Hamburger menu icon
        document.querySelector(".navbar").insertBefore(menuToggle, document.querySelector(".navbar .menu"));

        menuToggle.addEventListener("click", function () {
            const menu = document.querySelector(".navbar .menu");
            menu.classList.toggle("show");
        });


        // Highlight active menu button
        const currentPage = window.location.pathname.split("/").pop();
        document.querySelectorAll(".menu button").forEach(button => {
            const btnPage = button.getAttribute("data-page") || "";
            if (btnPage.replace(/^\//,"") === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", function () {
                window.location.href = this.getAttribute("data-page");
            });
        });

        // Typing effect for logo text
        const typingText = document.getElementById("typing-text");
        if (typingText) {
            const text = "Es algo más que criar aves, es un estilo de vida...";
            let i = 0;
            function typeLetter() {
                if (i <= text.length) {
                    typingText.textContent = text.slice(0, i);
                    i++;
                    setTimeout(typeLetter, 50); // Adjust speed here (ms per letter)
                } else {
                    setTimeout(() => {
                        i = 0;
                        typeLetter();
                    }, 3000); // Wait 3 seconds before restarting
                }
            }
            typeLetter();
        }
    });