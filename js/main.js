document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".page-loader");
  const header = document.querySelector(".header");
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => loader.remove(), 500);
    }, 350);
  });

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 50);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  menuButton?.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  mobileMenu?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-image img", {
      scale: 1.12,
      duration: 2.2,
      ease: "power3.out"
    });

    gsap.from(".hero-content > *", {
      y: 30,
      opacity: 0,
      duration: .8,
      stagger: .11,
      delay: .45,
      ease: "power3.out"
    });

    gsap.from(".hero-top span, .hero-bottom span", {
      opacity: 0,
      duration: .7,
      stagger: .12,
      delay: .9
    });

    gsap.to(".hero-image img", {
      scale: 1.04,
      ease: "none",
      scrollTrigger:{
        trigger:".hero",
        start:"top top",
        end:"bottom top",
        scrub:true
      }
    });

    document.querySelectorAll(".section-tag, h2, .intro-copy, .experience-card, .stay-copy, .facilities-intro-copy, .facility-card, .gallery-item, .location-copy").forEach(el => {
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: .75,
        ease:"power3.out",
        scrollTrigger:{trigger:el,start:"top 88%"}
      });
    });

    gsap.to(".feature-image img", {
      yPercent: 5,
      ease:"none",
      scrollTrigger:{
        trigger:".feature-image",
        start:"top bottom",
        end:"bottom top",
        scrub:true
      }
    });
  }

  // Gallery carousel + lightbox.
  const gallerySection = document.querySelector(".gallery");
  const galleryTrack = document.querySelector("[data-gallery-track]");
  const galleryControls = document.querySelector(".gallery-controls");
  const galleryProgress = document.querySelector(".gallery-progress span");
  const galleryPrev = document.querySelector(".gallery-prev");
  const galleryNext = document.querySelector(".gallery-next");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox?.querySelector("img");
  const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  let autoplayTimer = null;
  let scrollEndTimer = null;
  let currentIndex = 0;
  let currentPhotos = [];
  let galleryVisible = 3;
  const pauseReasons = new Set();

  const humanizeFilename = filename => {
    const base = filename.replace(/\.[^.]+$/, "");
    return base
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const isImageFile = value => {
    const ext = value.slice(value.lastIndexOf(".")).toLowerCase();
    return imageExtensions.has(ext);
  };

  const normalizeSourcePath = value => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
    return value.replace(/^\/+/, "");
  };

  const buildPhotoRecord = value => {
    const fileName = value.split("/").pop();
    const displayName = humanizeFilename(fileName);
    return {
      src: normalizeSourcePath(value),
      name: displayName,
      alt: displayName
    };
  };

  const discoverPhotosFromListing = async () => {
    try {
      const response = await fetch("assets/photos/", { cache: "no-store" });
      if (!response.ok) return [];

      const html = await response.text();
      if (!/<html[\s>]/i.test(html) && !/<a\b/i.test(html)) return [];

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const anchors = [...doc.querySelectorAll("a[href]")];
      const hrefs = anchors
        .map(anchor => anchor.getAttribute("href") || "")
        .map(href => {
          try {
            return new URL(href, response.url).pathname.replace(/^\/+/, "");
          } catch {
            return "";
          }
        })
        .filter(Boolean)
        .filter(path => {
          const file = path.split("/").pop() || "";
          const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
          return imageExtensions.has(ext) && !file.startsWith(".");
        });

      return [...new Set(hrefs)].sort((a, b) => collator.compare(a, b));
    } catch {
      return [];
    }
  };

  const discoverPhotosFromManifest = async () => {
    try {
      const response = await fetch("assets/photos/photos.json", { cache: "no-store" });
      if (!response.ok) return [];
      const files = await response.json();
      if (!Array.isArray(files)) return [];
      return files.filter(file => typeof file === "string" && isImageFile(file)).sort((a, b) => collator.compare(a, b));
    } catch {
      return [];
    }
  };

  const getVisibleCount = () => (window.innerWidth <= 600 ? 1 : (window.innerWidth <= 900 ? 2 : 3));

  const setPaused = (reason, paused) => {
    if (paused) {
      pauseReasons.add(reason);
    } else {
      pauseReasons.delete(reason);
    }

    if (pauseReasons.size) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    if (autoplayTimer || !galleryTrack || !currentPhotos.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    autoplayTimer = window.setInterval(() => {
      advanceGallery(1, true);
    }, 4000);
  };

  const getStepSize = () => {
    const card = galleryTrack?.querySelector(".gallery-item");
    if (!card) return 0;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(galleryTrack).gap || "0") || 0;
    return cardWidth + gap;
  };

  const updateProgress = () => {
    if (!galleryProgress || !currentPhotos.length) return;

    const rawIndex = currentIndex - galleryVisible;
    const wrappedIndex = ((rawIndex % currentPhotos.length) + currentPhotos.length) % currentPhotos.length;
    const progress = currentPhotos.length <= galleryVisible ? 100 : ((wrappedIndex + galleryVisible) / currentPhotos.length) * 100;
    galleryProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  const normalizeLoopPosition = () => {
    if (!galleryTrack || !currentPhotos.length) return;

    const step = getStepSize();
    if (!step) return;

    const clonedStart = galleryVisible;
    const clonedEnd = galleryVisible + currentPhotos.length;

    const rawIndex = Math.round(galleryTrack.scrollLeft / step);
    let nextIndex = rawIndex;

    if (rawIndex < clonedStart) {
      nextIndex = rawIndex + currentPhotos.length;
      galleryTrack.scrollTo({ left: nextIndex * step, behavior: "auto" });
    } else if (rawIndex >= clonedEnd) {
      nextIndex = rawIndex - currentPhotos.length;
      galleryTrack.scrollTo({ left: nextIndex * step, behavior: "auto" });
    }

    currentIndex = nextIndex;
    updateProgress();
  };

  const syncIndexFromScroll = () => {
    if (!galleryTrack || !currentPhotos.length) return;
    const step = getStepSize();
    if (!step) return;
    currentIndex = Math.round(galleryTrack.scrollLeft / step);
    updateProgress();
  };

  const scrollToIndex = (targetIndex, smooth = true) => {
    if (!galleryTrack || !currentPhotos.length) return;
    const step = getStepSize();
    if (!step) return;

    currentIndex = targetIndex;
    galleryTrack.scrollTo({ left: targetIndex * step, behavior: smooth ? "smooth" : "auto" });
    updateProgress();
  };

  const advanceGallery = (direction = 1, smooth = true) => {
    if (!currentPhotos.length) return;
    scrollToIndex(currentIndex + direction, smooth);
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
    setPaused("lightbox", false);
  };

  const openLightbox = item => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = item.dataset.full || item.querySelector("img")?.src || "";
    lightboxImg.alt = item.dataset.alt || item.querySelector("img")?.alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    setPaused("lightbox", true);
  };

  const buildGallery = (files, startRealIndex = 0) => {
    if (!galleryTrack || !gallerySection) return;

    currentPhotos = files.map(buildPhotoRecord);
    galleryTrack.innerHTML = "";

    if (!currentPhotos.length) {
      galleryTrack.innerHTML = '<p style="margin:0;color:var(--muted);font-size:14px;">No photos found.</p>';
      galleryControls?.setAttribute("hidden", "true");
      return;
    }

    galleryControls?.removeAttribute("hidden");
    galleryVisible = getVisibleCount();
    galleryTrack.style.setProperty("--gallery-visible", String(galleryVisible));

    const visible = galleryVisible;
    const clonesBefore = currentPhotos.slice(-visible);
    const clonesAfter = currentPhotos.slice(0, visible);
    const rendered = [...clonesBefore, ...currentPhotos, ...clonesAfter];

    rendered.forEach((photo, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-item";
      button.dataset.full = photo.src;
      button.dataset.alt = photo.alt;
      button.dataset.name = photo.name;
      button.setAttribute("aria-label", `Open ${photo.name}`);
      button.innerHTML = `<img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async">`;
      galleryTrack.appendChild(button);
    });

    currentIndex = visible + Math.min(Math.max(startRealIndex, 0), Math.max(0, currentPhotos.length - 1));
    requestAnimationFrame(() => {
      scrollToIndex(currentIndex, false);
      normalizeLoopPosition();
      startAutoplay();
    });

    if (window.gsap && window.ScrollTrigger) {
      gsap.from(galleryTrack.querySelectorAll(".gallery-item"), {
        y: 20,
        opacity: 0,
        duration: .55,
        stagger: .03,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gallerySection,
          start: "top 85%"
        }
      });
    }
  };

  const initGallery = async () => {
    if (!galleryTrack) return;
    gallerySection?.setAttribute("aria-busy", "true");

    const discovered = await discoverPhotosFromListing();
    const files = discovered.length ? discovered : await discoverPhotosFromManifest();
    buildGallery(files);
    gallerySection?.setAttribute("aria-busy", "false");
  };

  galleryPrev?.addEventListener("click", () => {
    advanceGallery(-1);
    setPaused("hover", true);
    window.setTimeout(() => setPaused("hover", false), 50);
  });
  galleryNext?.addEventListener("click", () => {
    advanceGallery(1);
    setPaused("hover", true);
    window.setTimeout(() => setPaused("hover", false), 50);
  });

  galleryTrack?.addEventListener("scroll", () => {
    syncIndexFromScroll();
    if (scrollEndTimer) clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      normalizeLoopPosition();
    }, 120);
  }, { passive: true });

  galleryTrack?.addEventListener("mouseenter", () => setPaused("hover", true));
  galleryTrack?.addEventListener("mouseleave", () => setPaused("hover", false));
  galleryTrack?.addEventListener("touchstart", () => setPaused("touch", true), { passive: true });
  galleryTrack?.addEventListener("touchend", () => {
    window.setTimeout(() => setPaused("touch", false), 500);
  }, { passive: true });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (!currentPhotos.length || !galleryTrack) return;
    const realIndex = ((currentIndex - galleryVisible) % currentPhotos.length + currentPhotos.length) % currentPhotos.length;
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      buildGallery(currentPhotos.map(photo => photo.src), realIndex);
    }, 120);
  });

  document.addEventListener("keydown", e => {
    const tag = document.activeElement?.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    if (typing) return;

    if (e.key === "ArrowLeft" && currentPhotos.length) {
      e.preventDefault();
      advanceGallery(-1);
    } else if (e.key === "ArrowRight" && currentPhotos.length) {
      e.preventDefault();
      advanceGallery(1);
    } else if (e.key === "Escape") {
      closeLightbox();
    }
  });

  document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("visibilitychange", () => {
    setPaused("visibility", document.hidden);
  });

  document.addEventListener("click", e => {
    const item = e.target.closest?.(".gallery-item");
    if (!item || !galleryTrack?.contains(item)) return;
    openLightbox(item);
  });

  initGallery();
});
