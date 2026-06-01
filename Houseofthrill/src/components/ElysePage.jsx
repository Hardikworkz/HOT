import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "./elyse/data.js";
import AboutSection from "./elyse/sections/AboutSection.jsx";
import AmenitiesSection from "./elyse/sections/AmenitiesSection.jsx";
import BeliefsSection from "./elyse/sections/BeliefsSection.jsx";
import FaqSection from "./elyse/sections/FaqSection.jsx";
import FooterSection from "./elyse/sections/FooterSection.jsx";
import HeaderSection from "./elyse/sections/HeaderSection.jsx";
import HeroSection from "./elyse/sections/HeroSection.jsx";
import ProjectModal from "./elyse/sections/ProjectModal.jsx";
import ProjectsSection from "./elyse/sections/ProjectsSection.jsx";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const AMENITIES_HIDDEN_MASK =
  "linear-gradient(0deg, black 0% 0%, transparent 0% 3.3333333333333335%, black 3.3333333333333335% 3.3333333333333335%, transparent 3.3333333333333335% 6.666666666666667%, black 6.666666666666667% 6.666666666666667%, transparent 6.666666666666667% 10%, black 10% 10%, transparent 10% 13.333333333333334%, black 13.333333333333334% 13.333333333333334%, transparent 13.333333333333334% 16.666666666666668%, black 16.666666666666668% 16.666666666666668%, transparent 16.666666666666668% 20%, black 20% 20%, transparent 20% 23.333333333333336%, black 23.333333333333336% 23.333333333333336%, transparent 23.333333333333336% 26.666666666666668%, black 26.666666666666668% 26.666666666666668%, transparent 26.666666666666668% 30%, black 30% 30%, transparent 30% 33.333333333333336%, black 33.333333333333336% 33.333333333333336%, transparent 33.333333333333336% 36.66666666666667%, black 36.66666666666667% 36.66666666666667%, transparent 36.66666666666667% 40%, black 40% 40%, transparent 40% 43.333333333333336%, black 43.333333333333336% 43.333333333333336%, transparent 43.333333333333336% 46.66666666666667%, black 46.66666666666667% 46.66666666666667%, transparent 46.66666666666667% 50%, black 50% 50%, transparent 50% 53.333333333333336%, black 53.333333333333336% 53.333333333333336%, transparent 53.333333333333336% 56.66666666666667%, black 56.66666666666667% 56.66666666666667%, transparent 56.66666666666667% 60%, black 60% 60%, transparent 60% 63.333333333333336%, black 63.333333333333336% 63.333333333333336%, transparent 63.333333333333336% 66.66666666666667%, black 66.66666666666667% 66.66666666666667%, transparent 66.66666666666667% 70%, black 70% 70%, transparent 70% 73.33333333333334%, black 73.33333333333334% 73.33333333333334%, transparent 73.33333333333334% 76.66666666666667%, black 76.66666666666667% 76.66666666666667%, transparent 76.66666666666667% 80%, black 80% 80%, transparent 80% 83.33333333333334%, black 83.33333333333334% 83.33333333333334%, transparent 83.33333333333334% 86.66666666666667%, black 86.66666666666667% 86.66666666666667%, transparent 86.66666666666667% 90%, black 90% 90%, transparent 90% 93.33333333333334%, black 93.33333333333334% 93.33333333333334%, transparent 93.33333333333334% 96.66666666666667%, black 96.66666666666667% 96.66666666666667%, transparent 96.66666666666667% 100%)";

function buildMaskGradient(progressArray, sliceCount = 30) {
  const step = 100 / sliceCount;
  let gradient = "linear-gradient(0deg";

  for (let index = 0; index < sliceCount; index += 1) {
    const start = index * step;
    const end = (index + 1) * step;
    const progress = progressArray[index];
    const visibleEnd = start + step * progress;

    gradient += `, black ${start}% ${visibleEnd}%`;

    if (progress < 1) {
      gradient += `, transparent ${visibleEnd}% ${end}%`;
    }
  }

  gradient += ")";
  return gradient;
}

function buildStripeProgress(progress, sliceCount = 30) {
  return Array.from({ length: sliceCount }, (_, index) => {
    const start = index / sliceCount;
    const end = (index + 1) / sliceCount;

    if (progress <= start) {
      return 0;
    }

    if (progress >= end) {
      return 1;
    }

    return (progress - start) / (end - start);
  });
}

function useTouchMode() {
  const [touchMode, setTouchMode] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: none)");

    const sync = (event) => {
      setTouchMode(event?.matches ?? query.matches);
    };

    sync();

    if (query.addEventListener) {
      query.addEventListener("change", sync);
      return () => query.removeEventListener("change", sync);
    }

    query.addListener(sync);
    return () => query.removeListener(sync);
  }, []);

  return touchMode;
}

function ElysePage() {
  const rootRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, [location]);

  const headerRef = useRef(null);
  const projectHasAnimatedRef = useRef(true);
  const previousProjectRef = useRef(0);
  const modalPreviousSlideRef = useRef(0);
  const lastFocusedRef = useRef(null);
  const modalRef = useRef(null);
  const modalInfoRef = useRef(null);
  const animatedAreaRef = useRef(240);

  const touchMode = useTouchMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [hoverFaq, setHoverFaq] = useState(-1);
  const [modalProjectIndex, setModalProjectIndex] = useState(null);
  const [modalClosing, setModalClosing] = useState(false);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [displayedModalIndex, setDisplayedModalIndex] = useState(0);
  const [animatedArea, setAnimatedArea] = useState(240);

  const activeFaq = touchMode ? openFaq : hoverFaq;
  const modalProject = modalProjectIndex === null ? null : PROJECTS[modalProjectIndex];
  const displayedSlide = modalProject ? modalProject.slides[displayedModalIndex] : null;

  useEffect(() => {
    document.body.style.overflow =
      menuOpen || modalProjectIndex !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, modalProjectIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const animateProjectIn = (index) => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const title = root.querySelector(`.project-title[data-project="${index}"]`);
    const text = root.querySelector(`.project-text[data-project="${index}"]`);

    if (!title || !text) {
      return;
    }

    const titleLines = title.querySelectorAll(".line-reveal-inner");
    const textLines = text.querySelectorAll(".line-reveal-inner");

    gsap.killTweensOf(titleLines);
    gsap.killTweensOf(textLines);

    gsap.fromTo(
      titleLines,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      },
    );

    gsap.fromTo(
      textLines,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.2,
      },
    );
  };

  const animateProjectOut = (index) => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const title = root.querySelector(`.project-title[data-project="${index}"]`);
    const text = root.querySelector(`.project-text[data-project="${index}"]`);

    if (!title || !text) {
      return;
    }

    const titleLines = title.querySelectorAll(".line-reveal-inner");
    const textLines = text.querySelectorAll(".line-reveal-inner");

    gsap.killTweensOf(titleLines);
    gsap.killTweensOf(textLines);

    gsap.to(
      [...titleLines, ...textLines],
      {
        yPercent: -100,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(titleLines, { yPercent: 100 });
          gsap.set(textLines, { yPercent: 100 });
        },
      },
    );
  };

  const scrollToVisit = () => {
    const target = document.getElementById("book-a-visit");
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openModal = (index, element) => {
    lastFocusedRef.current = element;
    setMenuOpen(false);
    setModalProjectIndex(index);
    setModalSlideIndex(0);
    setDisplayedModalIndex(0);
    modalPreviousSlideRef.current = 0;
    animatedAreaRef.current = PROJECTS[index].slides[0].area;
    setAnimatedArea(PROJECTS[index].slides[0].area);
  };

  const closeModal = useCallback(() => {
    if (modalProjectIndex === null) {
      return;
    }

    setModalClosing(true);

    window.setTimeout(() => {
      setModalClosing(false);
      setModalProjectIndex(null);
      setModalSlideIndex(0);
      setDisplayedModalIndex(0);
      lastFocusedRef.current?.focus?.();
    }, 1250);
  }, [modalProjectIndex]);

  useEffect(() => {
    if (!projectHasAnimatedRef.current) {
      return;
    }

    const previous = previousProjectRef.current;
    if (previous === activeProject) {
      return;
    }

    animateProjectOut(previous);
    animateProjectIn(activeProject);
    previousProjectRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    if (!modalProject) {
      return undefined;
    }

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusable = modalRef.current.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    const timer = window.setTimeout(() => {
      modalRef.current?.querySelector(".modal-close-btn")?.focus?.();
    }, 120);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [modalProject, closeModal]);

  useEffect(() => {
    if (!modalProject || !modalRef.current) {
      return;
    }

    const images = modalRef.current.querySelectorAll(".modal-bg-image");

    images.forEach((image, index) => {
      if (index === 0) {
        gsap.set(image, { opacity: 1, visibility: "visible" });
        image.style.setProperty(
          "--mask-gradient",
          buildMaskGradient(new Array(30).fill(1)),
        );
      } else {
        gsap.set(image, { opacity: 0, visibility: "hidden" });
        image.style.setProperty(
          "--mask-gradient",
          buildMaskGradient(new Array(30).fill(0)),
        );
      }
    });

    const titleLines = modalRef.current.querySelectorAll(
      ".modal-title-wrap .line-reveal-inner",
    );
    const fadeItems = modalRef.current.querySelectorAll(
      ".modal-description-copy, .modal-book-btn, .modal-slide-info",
    );

    gsap.set(titleLines, { yPercent: 110, opacity: 0 });
    gsap.set(fadeItems, { yPercent: 100, opacity: 0 });

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.to(titleLines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.06,
      delay: 1,
    });
    timeline.to(
      fadeItems,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
      },
      1.1,
    );

    return () => {
      timeline.kill();
    };
  }, [modalProject]);

  useEffect(() => {
    if (!modalProject || !modalRef.current) {
      return;
    }

    const infoItems = modalInfoRef.current?.querySelectorAll("[data-info-fade]") ?? [];
    const nextSlide = modalProject.slides[modalSlideIndex];

    if (!nextSlide) {
      return;
    }

    gsap.to(infoItems, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setDisplayedModalIndex(modalSlideIndex);

        const valueState = { value: animatedAreaRef.current };
        gsap.to(valueState, {
          value: nextSlide.area,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: () => {
            const rounded = Math.ceil(valueState.value);
            animatedAreaRef.current = rounded;
            setAnimatedArea(rounded);
          },
        });

        gsap.to(infoItems, {
          opacity: 1,
          duration: 0.3,
        });
      },
    });

    const previous = modalPreviousSlideRef.current;
    if (previous === modalSlideIndex) {
      return;
    }

    const images = modalRef.current.querySelectorAll(".modal-bg-image");
    const nextImage = images[modalSlideIndex];
    const previousImage = images[previous];

    if (!nextImage || !previousImage) {
      modalPreviousSlideRef.current = modalSlideIndex;
      return;
    }

    gsap.set(nextImage, { opacity: 1, visibility: "visible" });
    const progressArray = new Array(30).fill(0);

    const wipeTimeline = gsap.timeline({
      onUpdate: () => {
        nextImage.style.setProperty("--mask-gradient", buildMaskGradient(progressArray));
      },
      onComplete: () => {
        gsap.set(previousImage, { opacity: 0, visibility: "hidden" });
        previousImage.style.setProperty(
          "--mask-gradient",
          buildMaskGradient(new Array(30).fill(0)),
        );
      },
    });

    for (let index = 0; index < 30; index += 1) {
      wipeTimeline.to(
        progressArray,
        {
          [index]: 1,
          duration: 0.8,
          ease: "none",
        },
        index * 0.01,
      );
    }

    modalPreviousSlideRef.current = modalSlideIndex;

    return () => {
      wipeTimeline.kill();
    };
  }, [modalProject, modalSlideIndex]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heroChars = gsap.utils.toArray('.hero-title [data-char="true"]');
      const heroWords = gsap.utils.toArray('.hero-kicker [data-word="true"]');

      gsap.set(heroChars, { yPercent: 100 });
      gsap.set(heroWords, { opacity: 0, y: 30, rotationX: -45 });
      gsap.set('[data-hero="subtitle"]', { opacity: 0, y: 40 });
      gsap.set('[data-hero="scroll"]', { opacity: 0, y: 20 });
      gsap.set('[data-hero="nav"]', { opacity: 0, yPercent: -100 });
      gsap.set('[data-hero="line"] .line-reveal-inner', { yPercent: 105 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(
          heroChars,
          {
            yPercent: 0,
            duration: 2,
            stagger: { each: 0.1 },
          },
          0.8,
        )
        .to(
          heroWords,
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.04,
          },
          1.6,
        )
        .to(
          '[data-hero="subtitle"]',
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
          },
          2,
        )
        .to(
          '[data-hero="scroll"]',
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          2.8,
        )
        .to(
          '[data-hero="nav"]',
          {
            opacity: 1,
            yPercent: 0,
            duration: 1,
          },
          2.8,
        )
        .to(
          '[data-hero="line"] .line-reveal-inner',
          {
            yPercent: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          3.2,
        );

      ScrollTrigger.create({
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          gsap.set('[data-hero="img"]', {
            yPercent: progress * 30,
            scale: 1 + progress * 0.1,
          });

          gsap.set('[data-hero="title"]', {
            yPercent: progress * -50,
            opacity: 1 - progress,
          });

          gsap.set('[data-hero="content"]', {
            yPercent: progress * -30,
            opacity: Math.max(1 - progress * 1.5, 0),
          });
        },
      });

      ScrollTrigger.create({
        start: 1,
        onUpdate: () => {
          if (window.scrollY > 1) {
            headerRef.current?.classList.add("is-scrolled");
          } else {
            headerRef.current?.classList.remove("is-scrolled");
          }
        },
      });

      gsap.utils.toArray("[data-reveal], [data-anim='element']").forEach((element) => {
        gsap.from(element, {
          y: 96,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
          },
        });
      });

      gsap.utils.toArray('[data-anim="slideUp-once"]').forEach((element) => {
        gsap.from(element, {
          yPercent: 25,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        });
      });

      gsap.utils.toArray("[data-stagger-group], [data-anim='stagger-wrap']").forEach((group) => {
        const items = group.querySelectorAll("[data-stagger-item], [data-anim='stagger']");

        if (!items.length) {
          return;
        }

        gsap.from(items, {
          yPercent: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 82%",
          },
        });
      });

      gsap.utils.toArray("[data-image-overlay], [data-anim='img-overlay']").forEach((overlay) => {
        gsap.fromTo(
          overlay,
          { scaleY: 1, transformOrigin: "top center" },
          {
            scaleY: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: overlay.parentElement,
              start: "top 82%",
            },
          },
        );
      });

      gsap.utils.toArray("[data-parallax], [data-anim='img-paralax']").forEach((element) => {
        gsap.to(element, {
          yPercent: 15,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top 45%",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      ScrollTrigger.create({
        trigger: "[data-number-group]",
        start: "50% bottom",
        once: true,
        onEnter: () => {
          const numbers = rootRef.current?.querySelectorAll("[data-number]") ?? [];

          numbers.forEach((element) => {
            const target = Number(element.getAttribute("data-number"));
            const state = { value: 0 };
            element.textContent = "0";

            gsap.to(state, {
              value: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                element.textContent = String(Math.ceil(state.value));
              },
            });
          });
        },
      });

      gsap.set(".project-title .line-reveal-inner, .project-text .line-reveal-inner", {
        yPercent: 100,
      });

      animateProjectIn(0);

      const projectsIntro = rootRef.current?.querySelector("[data-projects-intro]");

      if (projectsIntro) {
        gsap.from(projectsIntro, {
          y: 72,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: projectsIntro,
            start: "top 82%",
            once: true,
          },
        });
      }

      const amenitiesTrack =
        rootRef.current?.querySelector('[data-amenities-anim="track"]');
      const amenitiesSticky =
        rootRef.current?.querySelector('[data-amenities-anim="sticky"]');
      const amenitiesProgressLine =
        rootRef.current?.querySelector(".amenities-progress-line");
      const amenitiesSlides = rootRef.current?.querySelectorAll(".amenities-slide") ?? [];
      const amenitiesBigCards = rootRef.current?.querySelectorAll(
        "[data-amenities-big-card]",
      ) ?? [];
      const amenitiesSmallCards = rootRef.current?.querySelectorAll(
        "[data-amenities-small-card]",
      ) ?? [];
      const amenitiesSliceCount = 30;

      if (amenitiesTrack && amenitiesSticky) {
        ScrollTrigger.create({
          trigger: amenitiesTrack,
          start: "top top",
          end: "bottom bottom",
          pin: amenitiesSticky,
          pinSpacing: false,
          anticipatePin: 1,
        });
      }

      if (amenitiesTrack) {
        ScrollTrigger.create({
          trigger: amenitiesTrack,
          start: "top top",
          end: "bottom top",
          onEnter: () => {
            gsap.to(headerRef.current, {
              yPercent: -100,
              pointerEvents: "none",
              duration: 0.3,
            });
          },
          onLeave: () => {
            gsap.to(headerRef.current, {
              yPercent: 0,
              pointerEvents: "auto",
              duration: 0.3,
            });
          },
          onEnterBack: () => {
            gsap.to(headerRef.current, {
              yPercent: -100,
              pointerEvents: "none",
              duration: 0.3,
            });
          },
          onLeaveBack: () => {
            gsap.to(headerRef.current, {
              yPercent: 0,
              pointerEvents: "auto",
              duration: 0.3,
            });
          },
        });
      }

      if (amenitiesProgressLine && amenitiesTrack) {
        gsap.set(amenitiesProgressLine, {
          xPercent: 0,
          yPercent: 0,
        });

        ScrollTrigger.create({
          trigger: amenitiesTrack,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (window.innerWidth <= 479) {
              gsap.set(amenitiesProgressLine, {
                xPercent: self.progress * 200,
                yPercent: 0,
              });
              return;
            }

            gsap.set(amenitiesProgressLine, {
              yPercent: self.progress * 200,
              xPercent: 0,
            });
          },
        });
      }

      if (
        amenitiesTrack &&
        amenitiesSlides.length &&
        amenitiesBigCards.length &&
        amenitiesSmallCards.length
      ) {
        const setBigMaskFromArray = (element, progressArray) => {
          element.style.setProperty(
            "--mask-gradient",
            buildMaskGradient(progressArray, amenitiesSliceCount),
          );
        };

        const setBigMask = (element, progress) => {
          if (progress <= 0) {
            element.style.setProperty("--mask-gradient", AMENITIES_HIDDEN_MASK);
            return;
          }

          setBigMaskFromArray(
            element,
            buildStripeProgress(progress, amenitiesSliceCount),
          );
        };

        amenitiesSlides.forEach((slide, index) => {
          const lines = slide.querySelectorAll(".line-reveal-inner");
          slide.setAttribute("aria-hidden", index === 0 ? "false" : "true");

          gsap.set(slide, {
            autoAlpha: index === 0 ? 1 : 0,
          });
          gsap.set(lines, {
            yPercent: index === 0 ? 0 : 100,
          });
        });



        amenitiesBigCards.forEach((card, index) => {
          setBigMask(card, index === 0 ? 1 : 0);
        });

        amenitiesSmallCards.forEach((card, index) => {
          gsap.set(card, {
            clipPath:
              index === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          });
        });

        const amenitiesTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: amenitiesTrack,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        amenitiesTimeline.to({}, { duration: 0.65 });

        for (let index = 1; index < amenitiesSlides.length; index += 1) {
          const previousSlide = amenitiesSlides[index - 1];
          const nextSlide = amenitiesSlides[index];
          const previousLines = previousSlide.querySelectorAll(".line-reveal-inner");
          const nextTitleLines =
            nextSlide.querySelectorAll(".amenities-title .line-reveal-inner");
          const nextTextLines =
            nextSlide.querySelectorAll(".amenities-paragraph .line-reveal-inner");
          const nextBigCard = amenitiesBigCards[index];
          const nextSmallCard = amenitiesSmallCards[index];
          const maskState = new Array(amenitiesSliceCount).fill(0);
          const waveMaskTimeline = gsap.timeline({
            onUpdate: () => {
              setBigMaskFromArray(nextBigCard, maskState);
            },
          });

          for (let slice = 0; slice < amenitiesSliceCount; slice += 1) {
            waveMaskTimeline.to(
              maskState,
              {
                [slice]: 1,
                duration: 0.5,
                ease: "none",
              },
              slice * 0.015,
            );
          }

          amenitiesTimeline
            .set(
              nextSlide,
              {
                autoAlpha: 1,
                onStart: () => {
                  nextSlide.setAttribute("aria-hidden", "false");
                },
              },
            )
            .add(waveMaskTimeline, "<")
            .fromTo(
              nextSmallCard,
              { clipPath: "inset(100% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.94,
                ease: "none",
              },
              "<",
            )
            .to(
              previousLines,
              {
                yPercent: -100,
                duration: 0.36,
                stagger: 0.02,
                ease: "power2.in",
              },
              "<+0.05",
            )
            .fromTo(
              nextTitleLines,
              { yPercent: 100 },
              {
                yPercent: 0,
                duration: 0.42,
                stagger: 0.05,
                ease: "power3.out",
              },
              "<+0.22",
            )
            .fromTo(
              nextTextLines,
              { yPercent: 100 },
              {
                yPercent: 0,
                duration: 0.34,
                stagger: 0.04,
                ease: "power3.out",
              },
              "<+0.16",
            )
            .to(
              previousSlide,
              {
                autoAlpha: 0,
                duration: 0.08,
                onComplete: () => {
                  previousSlide.setAttribute("aria-hidden", "true");
                },
              },
              "<+0.12",
            )
            .to({}, { duration: index === amenitiesSlides.length - 1 ? 0.55 : 0.42 });
        }
      }

      const footer = rootRef.current?.querySelector("footer");
      const footerLines = rootRef.current?.querySelectorAll("[data-footer-line]") ?? [];
      const footerStepOne = rootRef.current?.querySelectorAll('[data-footer-step="1"]') ?? [];
      const footerStepTwo = rootRef.current?.querySelectorAll('[data-footer-step="2"]') ?? [];
      const footerStepThree = rootRef.current?.querySelectorAll('[data-footer-step="3"]') ?? [];

      if (footer) {
        gsap.set([...footerStepOne, ...footerStepTwo, ...footerStepThree], {
          yPercent: 100,
          opacity: 0,
        });
        gsap.set(footerLines, { scaleX: 0 });

        const footerTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            once: true,
          },
        });

        footerTimeline.to(footerStepOne, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        });
        footerTimeline.to(
          footerLines,
          {
            scaleX: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.25",
        );
        footerTimeline.to(
          footerStepTwo,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.15",
        );
        footerTimeline.to(
          footerStepThree,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.2",
        );
      }
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <main
      ref={rootRef}
      className="relative overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <HeaderSection
        headerRef={headerRef}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((current) => !current)}
        onVisit={() => {
          setMenuOpen(false);
          scrollToVisit();
        }}
      />
      <HeroSection />
      <AboutSection />
      <ProjectsSection
        activeProject={activeProject}
        onProjectChange={setActiveProject}
        onProjectOpen={openModal}
        projects={PROJECTS}
      />
    
      
      <AmenitiesSection />
    
      <BeliefsSection />
      <FaqSection
        activeFaq={activeFaq}
        onFaqHover={(index) => {
          if (!touchMode) {
            setHoverFaq(index);
          }
        }}
        onFaqLeave={() => {
          if (!touchMode) {
            setHoverFaq(-1);
          }
        }}
        onFaqToggle={(index) => {
          if (touchMode) {
            setOpenFaq((current) => (current === index ? -1 : index));
          }
        }}
        touchMode={touchMode}
      />
     
      <FooterSection />
      <ProjectModal
        animatedArea={animatedArea}
        displayedSlide={displayedSlide}
        modalClosing={modalClosing}
        modalInfoRef={modalInfoRef}
        modalProject={modalProject}
        modalRef={modalRef}
        onClose={closeModal}
        onSlideChange={setModalSlideIndex}
        onVisit={() => {
          closeModal();
          window.setTimeout(scrollToVisit, 180);
        }}
      />
    </main>
  );
}

export default ElysePage;
