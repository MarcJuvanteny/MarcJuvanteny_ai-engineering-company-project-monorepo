"use client";

import { useEffect } from "react";

export function LandingInteractions(): null {
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const onScroll = () => {
      if (!navbar) return;
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    reveals.forEach((el) => revealObserver.observe(el));

    const animateCounter = (el: HTMLElement) => {
      const target = Number.parseFloat(el.dataset.target || "0");
      const suffix = el.dataset.suffix || "";
      const isDecimal = target % 1 !== 0;
      const isLarge = target > 100;
      const duration = 2000;
      const start = performance.now();

      const update = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - (1 - progress) ** 3;
        const current = target * ease;

        if (isLarge) {
          el.textContent = `${Math.floor(current).toLocaleString("es-ES")}${suffix}`;
        } else if (isDecimal) {
          el.textContent = `${current.toFixed(1)}${suffix}`;
        } else {
          el.textContent = `${Math.floor(current)}${suffix}`;
        }

        if (progress < 1) window.requestAnimationFrame(update);
      };

      window.requestAnimationFrame(update);
    };

    const counters = document.querySelectorAll<HTMLElement>(".counter");
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting && !target.dataset.animated) {
            target.dataset.animated = "true";
            animateCounter(target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));

    const uxTrack = document.getElementById("uxTrack");
    const dots = Array.from(
      document.querySelectorAll<HTMLButtonElement>("#carouselDots .carousel-dot")
    );
    const progressFill = document.getElementById("carouselProgress");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    const slideCount = uxTrack ? uxTrack.children.length : 0;
    const rotateMs = 20000;
    let currentSlide = 0;
    let elapsed = 0;
    let lastTick = performance.now();
    let rafId = 0;

    const renderCarousel = (index: number) => {
      if (!uxTrack || !slideCount) return;
      currentSlide = (index + slideCount) % slideCount;
      uxTrack.setAttribute("style", `transform: translateX(-${currentSlide * 100}%);`);
      dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
    };

    const resetProgress = () => {
      elapsed = 0;
      if (progressFill) progressFill.setAttribute("style", "width:0%;");
    };

    const nextSlide = () => {
      renderCarousel(currentSlide + 1);
      resetProgress();
    };

    const prevSlide = () => {
      renderCarousel(currentSlide - 1);
      resetProgress();
    };

    prevBtn?.addEventListener("click", prevSlide);
    nextBtn?.addEventListener("click", nextSlide);

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        renderCarousel(idx);
        resetProgress();
      });
    });

    const tick = (now: number) => {
      const dt = now - lastTick;
      lastTick = now;
      elapsed += dt;

      if (progressFill) {
        const pct = Math.min((elapsed / rotateMs) * 100, 100);
        progressFill.setAttribute("style", `width:${pct}%;`);
      }

      if (elapsed >= rotateMs) nextSlide();
      rafId = window.requestAnimationFrame(tick);
    };

    renderCarousel(0);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      revealObserver.disconnect();
      counterObserver.disconnect();
      window.cancelAnimationFrame(rafId);
      prevBtn?.removeEventListener("click", prevSlide);
      nextBtn?.removeEventListener("click", nextSlide);
    };
  }, []);

  return null;
}
