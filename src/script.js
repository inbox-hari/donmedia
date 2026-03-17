document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const beeMascot = document.getElementById("bee-mascot");
  const butterflyMascot = document.getElementById("butterfly-mascot");
  const grasshopperMascot = document.getElementById("grasshopper-mascot");

  if (mobileMenu) {
    mobileMenu.setAttribute("aria-hidden", "true");
  }
  if (menuBackdrop) {
    menuBackdrop.setAttribute("aria-hidden", "true");
  }

  function openMenu() {
    if (!mobileMenu || !menuBackdrop) {
      return;
    }
    mobileMenu.classList.add("active");
    menuBackdrop.classList.add("active");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuBackdrop.setAttribute("aria-hidden", "false");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
    }
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    if (!mobileMenu || !menuBackdrop) {
      return;
    }
    mobileMenu.classList.remove("active");
    menuBackdrop.classList.remove("active");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuBackdrop.setAttribute("aria-hidden", "true");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", closeMenu);
  }

  if (beeMascot || butterflyMascot || grasshopperMascot) {
    const waveClass = "bee-wave";
    const eyeTargets = [];
    let pendingFrame = null;
    let latestPoint = null;

    if (beeMascot) {
      eyeTargets.push({
        element: beeMascot,
        varX: "--bee-eye-x",
        varY: "--bee-eye-y",
        maxOffset: 2.5,
      });
    }

    if (grasshopperMascot) {
      eyeTargets.push({
        element: grasshopperMascot,
        varX: "--grass-eye-x",
        varY: "--grass-eye-y",
        maxOffset: 1.2,
      });
    }

    if (butterflyMascot) {
      eyeTargets.push({
        element: butterflyMascot,
        varX: "--butterfly-eye-x",
        varY: "--butterfly-eye-y",
        maxOffset: 1.6,
      });
    }

    const applyEyePosition = () => {
      pendingFrame = null;
      if (!latestPoint) {
        eyeTargets.forEach((target) => {
          target.element.style.setProperty(target.varX, "0px");
          target.element.style.setProperty(target.varY, "0px");
        });
        return;
      }

      eyeTargets.forEach((target) => {
        const rect = target.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (latestPoint.x - centerX) / (rect.width / 2);
        const dy = (latestPoint.y - centerY) / (rect.height / 2);
        const clampedX = Math.max(-1, Math.min(1, dx));
        const clampedY = Math.max(-1, Math.min(1, dy));

        target.element.style.setProperty(
          target.varX,
          `${clampedX * target.maxOffset}px`,
        );
        target.element.style.setProperty(
          target.varY,
          `${clampedY * target.maxOffset}px`,
        );
      });
    };

    const scheduleEyeUpdate = (point) => {
      latestPoint = point;
      if (pendingFrame) {
        return;
      }
      pendingFrame = window.requestAnimationFrame(applyEyePosition);
    };

    if (beeMascot) {
      const triggerWave = () => {
        beeMascot.classList.remove(waveClass);
        void beeMascot.offsetWidth;
        beeMascot.classList.add(waveClass);
        window.setTimeout(() => {
          beeMascot.classList.remove(waveClass);
        }, 900);
      };

      beeMascot.addEventListener("click", triggerWave);
      beeMascot.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          triggerWave();
        }
      });
    }

    window.addEventListener("mousemove", (event) => {
      scheduleEyeUpdate({ x: event.clientX, y: event.clientY });
    });

    window.addEventListener(
      "touchmove",
      (event) => {
        if (!event.touches || !event.touches.length) {
          return;
        }
        const touch = event.touches[0];
        scheduleEyeUpdate({ x: touch.clientX, y: touch.clientY });
      },
      { passive: true },
    );

    window.addEventListener("mouseleave", () => scheduleEyeUpdate(null));
    window.addEventListener("touchend", () => scheduleEyeUpdate(null));
  }



  // Dropdown toggle functionality
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const parentLi = this.closest(".dropdown");
      if (!parentLi) return;
      const dropdownMenu = parentLi.querySelector(".dropdown-menu");

      // Close other open dropdowns if there are multiple
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        if (dropdown !== parentLi) {
          dropdown.classList.remove("open");
          const menu = dropdown.querySelector(".dropdown-menu");
          if (menu) menu.classList.remove("show");
          const trigger = dropdown.querySelector(".dropdown-toggle");
          if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
          }
        }
      });

      parentLi.classList.toggle("open");
      if (dropdownMenu) {
        dropdownMenu.classList.toggle("show");
      }
      toggle.setAttribute(
        "aria-expanded",
        parentLi.classList.contains("open") ? "true" : "false",
      );
    });
  });

  // Close dropdowns if clicked outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("open");
        const menu = dropdown.querySelector(".dropdown-menu");
        if (menu) menu.classList.remove("show");
        const trigger = dropdown.querySelector(".dropdown-toggle");
        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
        }
      });
    }
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Thank you for your message! We will get back to you soon.");
    });
  }

  /* PDF Reader logic moved to React (FlipbookReader.jsx) */


  const categoryButtons = document.querySelectorAll(".category-grid .duo-btn");
  if (categoryButtons.length) {
    const hoverClasses = [
      "duo-hover-pop",
      "duo-hover-tilt",
      "duo-hover-bounce",
      "duo-hover-wiggle",
    ];
    const cycleClass = "duo-hover-bounce";
    const categoryGrid = document.querySelector(".category-grid");

    const clearHoverClasses = (button) => {
      hoverClasses.forEach((hoverClass) => button.classList.remove(hoverClass));
    };

    const applyCycleHover = (button) => {
      clearHoverClasses(button);
      button.classList.add(cycleClass);
    };

    categoryButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        applyCycleHover(button);
      });

      button.addEventListener("mouseleave", () => {
        clearHoverClasses(button);
      });
    });

    let cycleIndex = 0;
    let clearTimer = null;
    let cycleTimer = null;
    let isPaused = false;

    const runCycle = () => {
      if (isPaused) {
        return;
      }
      categoryButtons.forEach((button) => clearHoverClasses(button));
      const button = categoryButtons[cycleIndex % categoryButtons.length];
      if (!button) {
        return;
      }
      applyCycleHover(button);
      if (clearTimer) {
        window.clearTimeout(clearTimer);
      }
      clearTimer = window.setTimeout(() => {
        clearHoverClasses(button);
      }, 650);
      cycleIndex += 1;
    };

    runCycle();
    cycleTimer = window.setInterval(runCycle, 1000);

    if (categoryGrid) {
      categoryGrid.addEventListener("mouseenter", () => {
        isPaused = true;
        if (cycleTimer) {
          window.clearInterval(cycleTimer);
          cycleTimer = null;
        }
        if (clearTimer) {
          window.clearTimeout(clearTimer);
          clearTimer = null;
        }
      });

      categoryGrid.addEventListener("mouseleave", () => {
        isPaused = false;
        runCycle();
        if (!cycleTimer) {
          cycleTimer = window.setInterval(runCycle, 1000);
        }
      });
    }
  }
});
