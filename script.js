const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const leadForm = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");
const sliders = document.querySelectorAll("[data-slider]");

sliders.forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    if (!slides.length) {
        return;
    }

    if (slides.length < 2) {
        prevBtn?.setAttribute("hidden", "true");
        nextBtn?.setAttribute("hidden", "true");
    }

    let current = 0;

    const render = () => {
        slides.forEach((slide, index) => {
            slide.style.display = index === current ? "block" : "none";
        });
    };

    const shift = (step) => {
        current = (current + step + slides.length) % slides.length;
        render();
    };

    render();
    prevBtn?.addEventListener("click", () => shift(-1));
    nextBtn?.addEventListener("click", () => shift(1));
});

function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
}

function openMobileMenu() {
    mobileMenu.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.textContent = "✕";
}

menuToggle.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) {
        closeMobileMenu();
        return;
    }
    openMobileMenu();
});

scrollButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        const targetId = button.getAttribute("data-scroll-target");
        const target = document.getElementById(targetId);
        if (!target) return;

        if (button.tagName === "A") {
            event.preventDefault();
        }
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMobileMenu();
    });
});

leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";
    formStatus.className = "form-status loading";
    formStatus.textContent = "Отправляем заявку...";

    try {
        const response = await fetch(leadForm.action, {
            method: "POST",
            body: new FormData(leadForm),
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Formspree request failed");
        }

        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить заявку";
        formStatus.className = "form-status success";
        formStatus.textContent =
            "Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.";
        leadForm.reset();
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить заявку";
        formStatus.className = "form-status error";
        formStatus.textContent =
            "Не удалось отправить заявку. Попробуйте еще раз.";
    } finally {
        setTimeout(() => {
            formStatus.className = "form-status";
            formStatus.textContent = "";
        }, 4000);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
        closeMobileMenu();
    }
});
