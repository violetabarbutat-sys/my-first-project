(() => {
  if (window.__beautyZoneAppInitialized) {
    return;
  }

  window.__beautyZoneAppInitialized = true;

  document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector("[data-mobile-menu-open]");
    const closeButton = document.querySelector("[data-mobile-menu-close]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");
    const mobileMenuLinks = mobileMenu?.querySelectorAll("a") ?? [];

    const openMenu = () => {
      mobileMenu.classList.add("is-open");
      document.body.classList.add("is-scroll-locked");
      menuButton.setAttribute("aria-expanded", "true");
      mobileMenu.setAttribute("aria-hidden", "false");
    };

    const closeMenu = () => {
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("is-scroll-locked");
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    };

    if (menuButton && closeButton && mobileMenu) {
      menuButton.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-open")) {
          closeMenu();
          return;
        }

        openMenu();
      });

      closeButton.addEventListener("click", closeMenu);
      mobileMenuLinks.forEach((link) => link.addEventListener("click", closeMenu));

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      });
    }

    const modal = document.querySelector("[data-modal]");
    const modalBtnOpen = document.querySelector("[data-modal-open]");
    const modalBtnClose = document.querySelector("[data-modal-close]");

    if (modal && modalBtnOpen && modalBtnClose) {
      const setModalState = (isOpen) => {
        modal.classList.toggle("is-hidden", !isOpen);
        modal.setAttribute("aria-hidden", String(!isOpen));
        modalBtnOpen.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("is-scroll-locked", isOpen);
      };

      modalBtnOpen.addEventListener("click", () => setModalState(true));
      modalBtnClose.addEventListener("click", () => setModalState(false));

      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          setModalState(false);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.classList.contains("is-hidden")) {
          setModalState(false);
        }
      });
    }

    const dots = document.querySelectorAll(".dot");
    const cards = document.querySelectorAll(".services-card");
    const prevButton = document.querySelector(".prev-button");
    const nextButton = document.querySelector(".next-button");
    const servicesSlider = document.querySelector(".services-slider");

    if (dots.length && cards.length && prevButton && nextButton && servicesSlider) {
      let currentCardIndex = 0;
      let selectedProcedureIndex = 0;

      const swiper = window.Swiper
        ? new Swiper(".services-slider", {
            loop: false,
            slidesPerView: 1,
            spaceBetween: 32,
            allowTouchMove: false,
            breakpoints: {
              768: {
                slidesPerView: 2,
              },
              1100: {
                slidesPerView: 3,
              },
            },
          })
        : { slideTo: () => {} };

      const updateProcedures = () => {
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === selectedProcedureIndex);
        });

        cards.forEach((card, index) => {
          card.classList.toggle("current", index === currentCardIndex);
          if (index !== currentCardIndex) {
            card.classList.remove("active", "is-flipping");
          }

          card.querySelectorAll(".services-card__back li").forEach((procedure, procedureIndex) => {
            procedure.classList.toggle("active", procedureIndex === selectedProcedureIndex);
          });
        });
      };

      const resetCardsFlip = () => {
        cards.forEach((card) => {
          card.classList.remove("active", "is-flipping");
        });
      };

      const replayCurrentCardFlip = () => {
        const currentCard = cards[currentCardIndex];

        resetCardsFlip();
        updateProcedures();
        currentCard.querySelector(".services-card__inner").offsetWidth;

        requestAnimationFrame(() => {
          currentCard.classList.add("active", "is-flipping");
        });
      };

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          selectedProcedureIndex = index;
          replayCurrentCardFlip();
        });
      });

      prevButton.addEventListener("click", () => {
        currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        resetCardsFlip();
        swiper.slideTo(currentCardIndex);
        updateProcedures();
      });

      nextButton.addEventListener("click", () => {
        currentCardIndex = (currentCardIndex + 1) % cards.length;
        resetCardsFlip();
        swiper.slideTo(currentCardIndex);
        updateProcedures();
      });

      updateProcedures();
    }

    const fullNamePattern = /^[A-Za-zА-Яа-яІіЇїЄєҐґ'’`-]+\s+[A-Za-zА-Яа-яІіЇїЄєҐґ'’`-]+$/;
    const phonePattern = /^\+380\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateForm = (form) => {
      const fullName = form.querySelector('input[type="text"]');
      const phone = form.querySelector('input[type="tel"]');
      const email = form.querySelector('input[type="email"]');

      if (!fullName || !phone || !email) {
        return true;
      }

      fullName.setCustomValidity("");
      phone.setCustomValidity("");
      email.setCustomValidity("");

      if (!fullNamePattern.test(fullName.value.trim())) {
        fullName.setCustomValidity("Enter first and last name as two words.");
      }

      if (!phonePattern.test(phone.value.trim())) {
        phone.setCustomValidity("Enter phone number in the format +380XXXXXXXXX.");
      }

      if (!emailPattern.test(email.value.trim())) {
        email.setCustomValidity("Enter a valid email address containing @.");
      }

      return form.checkValidity();
    };

    document.querySelectorAll(".form").forEach((form) => {
      form.addEventListener("input", () => {
        validateForm(form);
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateForm(event.currentTarget) || !event.currentTarget.reportValidity()) {
          return;
        }

        event.currentTarget.reset();
      });
    });
  });
})();
