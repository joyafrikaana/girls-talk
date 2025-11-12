// scripts.js - externalized from index.html

// Initialize the mission Swiper, mentors slider, hamburger (safe no-op if not present),
// and reveal-on-scroll animations. All initializers are defensive (no-ops when
// the DOM elements or libraries are missing).

(function () {
    function initMissionSwiper() {
      if (typeof Swiper === "undefined") return;

      try {
        new Swiper(".mission-swiper", {
          slidesPerView: 2,
          spaceBetween: 12,
          loop: true,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2, spaceBetween: 20 },
          },
        });
      } catch (err) {
        console.warn("Swiper init failed:", err);
      }
    }

    function initMentorsSlider() {
      const slider = document.querySelector(".mentors-slider");
      const dotsContainer = document.querySelector(".slider-dots");
      const cards = document.querySelectorAll(".mentor-card");
      if (!slider || !dotsContainer || cards.length === 0) return;

      let currentSlide = 0;

      function getCardsPerSlide() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
      }

      function getTotalSlides() {
        return Math.max(1, Math.ceil(cards.length / getCardsPerSlide()));
      }

      function generateDots() {
        dotsContainer.innerHTML = "";
        const total = getTotalSlides();
        for (let i = 0; i < total; i++) {
          const btn = document.createElement("button");
          btn.className = "dot";
          btn.dataset.index = i;
          if (i === 0) btn.classList.add("active");
          dotsContainer.appendChild(btn);
        }
      }

      function updateSlider(index) {
        const per = getCardsPerSlide();
        const first = cards[0];
        const style = window.getComputedStyle(first);
        const marginRight = parseFloat(style.marginRight || 0);
        const marginLeft = parseFloat(style.marginLeft || 0);
        const cardWidth = first.offsetWidth + marginLeft + marginRight;

        slider.style.transform = `translateX(-${index * cardWidth * per}px)`;

        document
          .querySelectorAll(".dot")
          .forEach((d) => d.classList.remove("active"));
        const active = document.querySelector(`.dot[data-index="${index}"]`);
        if (active) active.classList.add("active");
        currentSlide = index;
      }

      function setup() {
        generateDots();
        updateSlider(0);
      }

      dotsContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains("dot")) return;
        const idx = Number(e.target.dataset.index);
        updateSlider(idx);
      });

      let auto = setInterval(() => {
        const next = (currentSlide + 1) % getTotalSlides();
        updateSlider(next);
      }, 4000);

      window.addEventListener("resize", () => {
        clearInterval(auto);
        setup();
        auto = setInterval(() => {
          const next = (currentSlide + 1) % getTotalSlides();
          updateSlider(next);
        }, 4000);
      });

      setup();
    }

    function initHamburger() {
      // Safe no-op if the markup doesn't include a hamburger/nav id used earlier.
      const hamburger = document.querySelector(".hamburger");
      const header = document.querySelector("header.nav");
      const nav = document.querySelector("header nav");
      if (!hamburger || !header || !nav) return;

      const openNav = () => {
        header.classList.add("open");
        hamburger.classList.add("is-open");
        hamburger.setAttribute("aria-expanded", "true");
        hamburger.innerHTML = "\u2715";
        nav.style.display = "flex";
      };

      const closeNav = () => {
        header.classList.remove("open");
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.innerHTML = "&#9776;";
        nav.style.display = "none";
      };

      hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        if (header.classList.contains("open")) closeNav();
        else openNav();
      });

      document.addEventListener("click", (e) => {
        if (!header.contains(e.target) && header.classList.contains("open"))
          closeNav();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && header.classList.contains("open")) {
          closeNav();
          hamburger.focus();
        }
      });
    }

    function initAnimations() {
      // page load class
      setTimeout(() => document.body.classList.add("is-loaded"), 60);

      const els = document.querySelectorAll(".animate-on-scroll");
      if (!els || els.length === 0) return;

      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      els.forEach((el) => obs.observe(el));
    }

    document.addEventListener('DOMContentLoaded', () => {
      initMissionSwiper();
      initMentorsSlider();
      initHamburger();
      initAnimations();
    });
  })();
