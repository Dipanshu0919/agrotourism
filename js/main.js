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

  const discoverPhotosFromListing = async (directory = "assets/photos/") => {
    try {
      const response = await fetch(directory, { cache: "no-store" });
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

  const promotionSection = document.querySelector(".offers");
  const promotionTrack = document.querySelector("[data-promotion-track]");
  const promotionViewport = document.querySelector(".promotions-showcase");
  const promotionProgress = document.querySelector(".promotion-progress span");
  const promotionCount = document.querySelector(".promotion-count");
  const promotionCategory = document.querySelector(".promotion-category");
  const promotionLightbox = document.querySelector(".promotion-lightbox");
  const promotionLightboxImage = promotionLightbox?.querySelector("img");
  let promotions = [];
  let promotionIndex = 0;
  let promotionPosition = 1;
  let promotionTouchStart = 0;
  let promotionAutoplayTimer = null;

  const promotionAlt = () => "S.K. Agro Tourism promotional poster for activities, stays and special offers";
  const promotionAssets = [
    "assets/promotions/image_83bc853e.png",
    "assets/promotions/image_9ba3984b.png",
    "assets/promotions/image_a4670b77-1.png",
    "assets/promotions/image_c8522635.png",
    "assets/promotions/image_d8d2af88.png",
    "assets/promotions/WhatsApp Image 2026-08-24 at 12.44.07 PM.jpeg"
  ];

  const updatePromotionMeta = () => {
    if (!promotions.length) return;
    promotionCategory.textContent = "Special";
    promotionCount.textContent = `${String(promotionIndex + 1).padStart(2, "0")} / ${String(promotions.length).padStart(2, "0")}`;
    if (promotionProgress) {
      promotionProgress.style.width = `${((promotionIndex + 1) / promotions.length) * 100}%`;
    }
  };

  const positionPromotionTrack = (smooth = true) => {
    if (!promotionTrack || !promotionViewport) return;
    const active = promotionTrack.children[promotionPosition];
    if (!active) return;
    const offset = promotionViewport.clientWidth / 2 - (active.offsetLeft + active.offsetWidth / 2);
    promotionTrack.style.transition = smooth ? "transform .5s cubic-bezier(.2,.7,.2,1)" : "none";
    promotionTrack.style.transform = `translate3d(${offset}px,0,0)`;
    [...promotionTrack.children].forEach((card, index) => {
      card.classList.toggle("is-active", index === promotionPosition);
      card.classList.toggle("is-side", index !== promotionPosition);
    });
    updatePromotionMeta();
  };

  const openPromotionLightbox = () => {
    if (!promotions.length || !promotionLightbox || !promotionLightboxImage) return;
    promotionLightboxImage.src = promotions[promotionIndex];
    promotionLightboxImage.alt = promotionAlt();
    promotionLightbox.classList.add("open");
    promotionLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (promotionAutoplayTimer) {
      clearInterval(promotionAutoplayTimer);
      promotionAutoplayTimer = null;
    }
  };

  const closePromotionLightbox = () => {
    promotionLightbox?.classList.remove("open");
    promotionLightbox?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    startPromotionAutoplay();
  };

  const changePromotion = (direction, smooth = true) => {
    if (!promotions.length) return;
    promotionPosition += direction;
    promotionIndex = (promotionPosition - 1 + promotions.length) % promotions.length;
    positionPromotionTrack(smooth);
    if (promotionLightbox?.classList.contains("open") && promotionLightboxImage) {
      promotionLightboxImage.src = promotions[promotionIndex];
      promotionLightboxImage.alt = promotionAlt();
    }
  };

  const startPromotionAutoplay = () => {
    if (promotionAutoplayTimer || !promotions.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    promotionAutoplayTimer = window.setInterval(() => changePromotion(1), 5000);
  };

  const pausePromotionAutoplay = () => {
    if (promotionAutoplayTimer) {
      clearInterval(promotionAutoplayTimer);
      promotionAutoplayTimer = null;
    }
  };

  const initPromotions = async () => {
    if (!promotionSection) return;
    promotions = promotionAssets.filter(isImageFile);
    if (!promotions.length) {
      promotionTrack?.replaceChildren(Object.assign(document.createElement("p"), {
        className: "promotion-fallback",
        textContent: "Promotional posters are currently unavailable."
      }));
      promotionSection.setAttribute("aria-busy", "false");
      return;
    }
    const loopedPromotions = [promotions[promotions.length - 1], ...promotions, promotions[0]];
    loopedPromotions.forEach((src, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "promotion-card";
      card.dataset.promotionIndex = String((index - 1 + promotions.length) % promotions.length);
      card.setAttribute("aria-label", `Open promotional poster ${Number(card.dataset.promotionIndex) + 1}`);
      card.innerHTML = `<img src="${src}" alt="${promotionAlt()}" loading="lazy" decoding="async">`;
      promotionTrack?.appendChild(card);
    });
    promotionPosition = 1;
    promotionIndex = 0;
    positionPromotionTrack(false);
    startPromotionAutoplay();
    promotionSection.setAttribute("aria-busy", "false");
  };


  const activitySection = document.querySelector(".activities");
  const activityCarousel = document.querySelector("[data-activity-carousel]");
  const activityTrack = document.querySelector("[data-activity-track]");
  const activityCounter = document.querySelector("[data-activity-counter]");
  const activityTitle = document.querySelector("[data-activity-title]");
  const activityDescription = document.querySelector("[data-activity-description]");
  const activityViewer = document.querySelector(".activity-viewer");
  const activityViewerMedia = document.querySelector("[data-activity-viewer-media]");
  const activityExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"]);
  const activityVideoExtensions = new Set([".mp4", ".webm", ".mov"]);
  // Generic WhatsApp filenames are intentionally mapped here so titles never depend on filenames.
  const activityMetadata = {
    "WhatsApp Image 2026-08-24 at 12.44.23 PM (1).jpeg": { title: "Zip Line", description: "A rush of open-air adventure above the greenery." },
    "WhatsApp Image 2026-08-24 at 12.44.23 PM (2).jpeg": { title: "Plank Walk", description: "Find your balance and take in the view." },
    "WhatsApp Image 2026-08-24 at 12.44.23 PM (3).jpeg": { title: "Zig-Zag Walk", description: "A playful challenge for brave explorers." },
    "WhatsApp Image 2026-08-24 at 12.44.23 PM.jpeg": { title: "Tyre Bridge", description: "Step, swing and cross at your own pace." },
    "WhatsApp Image 2026-08-24 at 12.44.24 PM (1).jpeg": { title: "Burma Bridge", description: "Make the crossing, one steady step at a time." },
    "WhatsApp Image 2026-08-24 at 12.44.24 PM (2).jpeg": { title: "Horizontal Swing", description: "A light-hearted leap into the outdoors." },
    "WhatsApp Image 2026-08-24 at 12.44.24 PM.jpeg": { title: "Swing Bridge", description: "A little movement makes every moment memorable." },
    "WhatsApp Image 2026-08-24 at 12.44.25 PM (1).jpeg": { title: "Magic Swing", description: "Slow down, swing out and enjoy the countryside." },
    "WhatsApp Image 2026-08-24 at 12.44.25 PM (2).jpeg": { title: "Sky Cycling", description: "Pedal into a completely different perspective." },
    "WhatsApp Image 2026-08-24 at 12.44.25 PM (3).jpeg": { title: "Adventure Course", description: "A high-energy course made for shared memories." },
    "WhatsApp Image 2026-08-24 at 12.44.25 PM.jpeg": { title: "Rope Challenge", description: "Test your focus, footing and sense of fun." },
    "WhatsApp Image 2026-08-24 at 12.44.26 PM.jpeg": { title: "Nature Trail", description: "A fresh-air wander through the resort landscape." },
    "WhatsApp Video 2026-08-24 at 12.44.21 PM (1).mp4": { title: "Zip Line Ride", description: "Feel the wind and let the landscape rush by." },
    "WhatsApp Video 2026-08-24 at 12.44.21 PM (2).mp4": { title: "Plank Walk in Motion", description: "A moving challenge with a view worth earning." },
    "WhatsApp Video 2026-08-24 at 12.44.21 PM.mp4": { title: "Bridge Crossing", description: "Keep moving and make every step count." },
    "WhatsApp Video 2026-08-24 at 12.44.22 PM (1).mp4": { title: "Swing Adventure", description: "A playful outdoor moment for every age." },
    "WhatsApp Video 2026-08-24 at 12.44.22 PM (2).mp4": { title: "Sky Ride", description: "Adventure feels different from up here." },
    "WhatsApp Video 2026-08-24 at 12.44.22 PM.mp4": { title: "Rope Course", description: "Climb higher, laugh louder and stay curious." },
    "WhatsApp Video 2026-08-24 at 12.44.26 PM (1).mp4": { title: "Family Challenge", description: "The best adventures are better together." },
    "WhatsApp Video 2026-08-24 at 12.44.26 PM.mp4": { title: "Outdoor Play", description: "Make a day of movement, nature and fun." }
  };
  let activities = [];
  let activeActivityIndex = 0;
  let activityViewerIndex = 0;
  let activityTouchStartX = 0;
  let activityTouchStartY = 0;

  const isActivityMediaFile = value => activityExtensions.has(value.slice(value.lastIndexOf(".")).toLowerCase());
  const createActivityMedia = (record, viewer = false, autoplay = false) => {
    const element = document.createElement(record.type === "video" ? "video" : "img");
    element.className = viewer ? "activity-viewer-content" : "activity-card-media";
    element.src = record.src;
    element.alt = record.alt;
    if (record.type === "video") {
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
      element.autoplay = !viewer && autoplay;
      element.controls = viewer;
      element.preload = viewer ? "metadata" : "auto";
    } else if (!viewer) {
      element.loading = "lazy";
      element.decoding = "async";
    }
    return element;
  };
  const discoverActivitiesFromListing = async (directory = "assets/activities/") => {
    try {
      const response = await fetch(directory, { cache: "no-store" });
      if (!response.ok) return [];
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");
      return [...new Set([...doc.querySelectorAll("a[href]")].map(anchor => {
        try { return new URL(anchor.getAttribute("href") || "", response.url).pathname.replace(/^\/+/, ""); } catch { return ""; }
      }).filter(path => path && isActivityMediaFile(path)))].sort((a, b) => collator.compare(a, b));
    } catch {
      return [];
    }
  };
  const activityIndexFor = offset => (activeActivityIndex + offset + activities.length) % activities.length;
  const renderActivity = (index, smooth = true) => {
    if (!activities.length || !activityTrack) return;
    activeActivityIndex = (index + activities.length) % activities.length;
    const record = activities[activeActivityIndex];
    const cards = [-1, 0, 1].map(offset => {
      const card = document.createElement("button");
      const cardRecord = activities[activityIndexFor(offset)];
      card.type = "button";
      card.className = `activity-card ${offset === 0 ? "is-active" : offset < 0 ? "is-previous" : "is-next"}`;
      card.dataset.activityIndex = String(activityIndexFor(offset));
      card.setAttribute("aria-label", `${offset === 0 ? "Open" : "Select"} ${cardRecord.title}`);
      card.appendChild(createActivityMedia(cardRecord, false, offset === 0));
      if (cardRecord.type === "video") {
        const indicator = document.createElement("span");
        indicator.className = "activity-video-indicator";
        indicator.textContent = "Live";
        card.appendChild(indicator);
      }
      return card;
    });
    activityTrack.classList.toggle("is-changing", smooth);
    window.requestAnimationFrame(() => {
      activityTrack.replaceChildren(...cards);
      activityTrack.classList.remove("is-changing");
      activityTrack.querySelector(".is-active video")?.play().catch(() => {});
    });
    activityCounter.textContent = `${String(activeActivityIndex + 1).padStart(2, "0")} / ${String(activities.length).padStart(2, "0")}`;
    activityTitle.textContent = record.title;
    activityDescription.textContent = record.description;
  };
  const openActivityViewer = index => {
    activityViewerIndex = (index + activities.length) % activities.length;
    activityViewerMedia.replaceChildren(createActivityMedia(activities[activityViewerIndex], true));
    activityViewer.classList.add("open");
    activityViewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeActivityViewer = () => {
    activityViewer?.classList.remove("open");
    activityViewer?.setAttribute("aria-hidden", "true");
    activityViewerMedia?.replaceChildren();
    document.body.style.overflow = "";
  };
  const changeActivityViewer = direction => {
    activityViewerIndex = (activityViewerIndex + direction + activities.length) % activities.length;
    openActivityViewer(activityViewerIndex);
  };
  const initActivities = async () => {
    if (!activitySection) return;
    const files = await discoverActivitiesFromListing();
    activities = files.map(src => ({
      src,
      type: activityVideoExtensions.has(src.slice(src.lastIndexOf(".")).toLowerCase()) ? "video" : "image",
      title: activityMetadata[decodeURIComponent(src.split("/").pop() || "")]?.title || "Resort Adventure",
      description: activityMetadata[decodeURIComponent(src.split("/").pop() || "")]?.description || "A memorable outdoor experience at S.K. Agro Tourism.",
      alt: `S.K. Agro Tourism activity: ${activityMetadata[decodeURIComponent(src.split("/").pop() || "")]?.title || "Resort Adventure"}`
    }));
    if (!activities.length) {
      activityTrack.textContent = "Activities are being refreshed. Please check back soon.";
      activitySection.setAttribute("aria-busy", "false");
      return;
    }
    renderActivity(0, false);
    activitySection.setAttribute("aria-busy", "false");
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

    const files = await discoverPhotosFromListing();
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

    const activityFocused = activitySection?.contains(document.activeElement);
    if (e.key === "ArrowLeft" && activityViewer?.classList.contains("open") && activities.length) {
      e.preventDefault();
      changeActivityViewer(-1);
    } else if (e.key === "ArrowRight" && activityViewer?.classList.contains("open") && activities.length) {
      e.preventDefault();
      changeActivityViewer(1);
    } else if (e.key === "ArrowLeft" && activityFocused && activities.length) {
      e.preventDefault();
      renderActivity(activeActivityIndex - 1);
    } else if (e.key === "ArrowRight" && activityFocused && activities.length) {
      e.preventDefault();
      renderActivity(activeActivityIndex + 1);
    } else if (e.key === "ArrowLeft" && currentPhotos.length) {
      e.preventDefault();
      advanceGallery(-1);
    } else if (e.key === "ArrowRight" && currentPhotos.length) {
      e.preventDefault();
      advanceGallery(1);
    } else if (e.key === "Escape") {
      closeLightbox();
      closeActivityViewer();
    }
  });

  document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("click", e => {
    const item = e.target.closest?.(".gallery-item");
    if (!item || !galleryTrack?.contains(item)) return;
    openLightbox(item);
  });

  activityCarousel?.addEventListener("click", e => {
    const arrow = e.target.closest?.("[data-activity-direction]");
    if (arrow) {
      renderActivity(activeActivityIndex + Number(arrow.dataset.activityDirection));
      return;
    }
    const card = e.target.closest?.(".activity-card");
    if (!card || !activityTrack.contains(card)) return;
    const index = Number(card.dataset.activityIndex);
    if (index === activeActivityIndex) openActivityViewer(index);
    else renderActivity(index);
  });
  activityCarousel?.addEventListener("touchstart", e => {
    activityTouchStartX = e.changedTouches[0].clientX;
    activityTouchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  activityCarousel?.addEventListener("touchend", e => {
    const distanceX = e.changedTouches[0].clientX - activityTouchStartX;
    const distanceY = e.changedTouches[0].clientY - activityTouchStartY;
    if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
      renderActivity(activeActivityIndex + (distanceX < 0 ? 1 : -1));
    }
  }, { passive: true });
  document.querySelector(".activity-viewer-close")?.addEventListener("click", closeActivityViewer);
  document.querySelector(".activity-viewer-prev")?.addEventListener("click", () => changeActivityViewer(-1));
  document.querySelector(".activity-viewer-next")?.addEventListener("click", () => changeActivityViewer(1));
  activityViewer?.addEventListener("click", e => {
    if (e.target === activityViewer) closeActivityViewer();
  });
  activityViewer?.addEventListener("touchstart", e => {
    activityTouchStartX = e.changedTouches[0].clientX;
    activityTouchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  activityViewer?.addEventListener("touchend", e => {
    const distanceX = e.changedTouches[0].clientX - activityTouchStartX;
    const distanceY = e.changedTouches[0].clientY - activityTouchStartY;
    if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
      changeActivityViewer(distanceX < 0 ? 1 : -1);
    }
  }, { passive: true });
  const interactWithPromotion = direction => {
    pausePromotionAutoplay();
    changePromotion(direction);
    window.setTimeout(startPromotionAutoplay, 500);
  };
  document.querySelector(".promotion-prev")?.addEventListener("click", () => interactWithPromotion(-1));
  document.querySelector(".promotion-next")?.addEventListener("click", () => interactWithPromotion(1));
  promotionTrack?.addEventListener("click", e => {
    const card = e.target.closest?.(".promotion-card");
    if (!card) return;
    promotionIndex = Number(card.dataset.promotionIndex) || 0;
    promotionPosition = promotionIndex + 1;
    positionPromotionTrack();
    openPromotionLightbox();
  });
  document.querySelector(".promotion-lightbox-close")?.addEventListener("click", closePromotionLightbox);
  document.querySelector(".promotion-lightbox-prev")?.addEventListener("click", () => changePromotion(-1));
  document.querySelector(".promotion-lightbox-next")?.addEventListener("click", () => changePromotion(1));
  promotionLightbox?.addEventListener("click", e => {
    if (e.target === promotionLightbox) closePromotionLightbox();
  });
  promotionTrack?.addEventListener("touchstart", e => {
    promotionTouchStart = e.changedTouches[0].clientX;
    pausePromotionAutoplay();
  }, { passive: true });
  promotionTrack?.addEventListener("touchend", e => {
    const distance = e.changedTouches[0].clientX - promotionTouchStart;
    if (Math.abs(distance) > 45) {
      changePromotion(distance < 0 ? 1 : -1);
    }
    startPromotionAutoplay();
  }, { passive: true });
  promotionTrack?.addEventListener("mouseenter", pausePromotionAutoplay);
  promotionTrack?.addEventListener("mouseleave", startPromotionAutoplay);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pausePromotionAutoplay();
    else if (!promotionLightbox?.classList.contains("open")) startPromotionAutoplay();
  });
  promotionTrack?.addEventListener("transitionend", e => {
    if (e.propertyName !== "transform" || !promotions.length) return;
    if (promotionPosition === 0) {
      promotionPosition = promotions.length;
      promotionIndex = promotions.length - 1;
      positionPromotionTrack(false);
    } else if (promotionPosition === promotions.length + 1) {
      promotionPosition = 1;
      promotionIndex = 0;
      positionPromotionTrack(false);
    }
  });


  initGallery();
  initPromotions();
  initActivities();
});
