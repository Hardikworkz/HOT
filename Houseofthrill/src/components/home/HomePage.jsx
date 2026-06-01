import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@splidejs/react-splide/css/core";
import Ballpit from "../ui/Ballpit";
import "./home-page.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const HERO_TITLE = "THRILL";
const HERO_WORDS = [
  "India's",
  "first",
  "axe",
  "throwing",
  "and",
  "escape",
  "arena",
];

const ABOUT_STATS = [
  { value: 60, suffix: "%", text: "adrenaline-fueled challenges built for team play." },
  { value: 30, suffix: "", text: "immersive moments designed to keep every visit fresh." },
  { value: 150, suffix: "k", text: "reasons to come back with a new crew every time." },
  { value: "24/7", suffix: "", text: "energy from our players, creators, and game masters." },
];

const PROJECTS = [
  {
    navLabel: "Prison Escape",
    titleLines: ["Prison Escape"],
    summaryLines: [
      "Break the bars, outsmart the guards, and race the clock in a co-op mission",
      "that rewards teamwork, communication, and fearless decisions.",
    ],
    modalTitleLines: ["Prison Escape"],
    description:
      "A high-pressure breakout challenge built around hidden clues, layered puzzles, and cinematic tension. Every room you clear pushes the squad one step closer to freedom.",
    image:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881b0a57115d8cd3a12c2_livings-img-1--d.avif",
    alt:
      "A dramatic escape-room style space with layered interiors and a cinematic look.",
    slides: [
      {
        main: "/events/workshop.jpg",
        thumb: "/events/workshop.jpg",
        label: "CELL BLOCK",
        metric: 60,
        unit: "MIN",
        metricText: "total mission time",
      },
      {
        main: "/events/coffee.jpg",
        thumb: "/events/coffee.jpg",
        label: "CLUE CHAIN",
        metric: 12,
        unit: "PTS",
        metricText: "linked puzzles to crack",
      },
      {
        main: "/events/resin.jpg",
        thumb: "/events/resin.jpg",
        label: "TEAM SIZE",
        metric: 8,
        unit: "MAX",
        metricText: "players per run",
      },
      {
        main: "/events/pottery.jpg",
        thumb: "/events/pottery.jpg",
        label: "LOCKDOWN",
        metric: 1,
        unit: "GOAL",
        metricText: "escape before time runs out",
      },
    ],
  },
  {
    navLabel: "Final Countdown",
    titleLines: ["The Final", "Countdown"],
    summaryLines: [
      "A classified disaster is unfolding and your team has one hour to stabilize the lab,",
      "decode the system, and stop the citywide fallout.",
    ],
    modalTitleLines: ["The Final", "Countdown"],
    description:
      "A sci-fi thriller built for fast thinkers. Solve chain reactions, reroute systems, and keep your crew calm while the tension keeps climbing.",
    image:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881b00e2082f46e0752ce_livings-img-3--d.avif",
    alt: "A futuristic challenge room with moody lighting and immersive details.",
    slides: [
      {
        main: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/69496c26d804e38b9dd91b28_crown%20jewel%20bedroom.avif",
        thumb: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/69496c26d804e38b9dd91b28_crown%20jewel%20bedroom.avif",
        label: "REACTOR",
        metric: 60,
        unit: "MIN",
        metricText: "critical countdown window",
      },
      {
        main: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a4743f9a9b7f00045ec8_crown%20jewel%20living%20room.avif",
        thumb: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a4743f9a9b7f00045ec8_crown%20jewel%20living%20room.avif",
        label: "CONTROL ROOM",
        metric: 9,
        unit: "LOCKS",
        metricText: "systems to override",
      },
      {
        main: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a474f62ffe68d1fe2a12_crown%20jewel%20office.avif",
        thumb: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a474f62ffe68d1fe2a12_crown%20jewel%20office.avif",
        label: "THREAT LEVEL",
        metric: 5,
        unit: "/5",
        metricText: "intensity rating",
      },
      {
        main: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a4745244867434b327b3_crown%20jewel%20penthouse.avif",
        thumb: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a4745244867434b327b3_crown%20jewel%20penthouse.avif",
        label: "OUTCOME",
        metric: 1,
        unit: "SHOT",
        metricText: "to save the city",
      },
    ],
  },
  {
    navLabel: "Raja Bhoj ka Khazana",
    titleLines: ["Raja Bhoj", "ka Khazana"],
    summaryLines: [
      "Step into a myth-soaked treasure hunt where symbols, legends, and hidden chambers",
      "lead your group toward the lost royal prize.",
    ],
    modalTitleLines: ["Raja Bhoj", "ka Khazana"],
    description:
      "An adventure room inspired by forgotten history and ancient clues. The pace is playful, the reveals feel rewarding, and the finale lands like a real discovery.",
    image:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881b0422731c7d2c5fcac_livings-img-2--d.avif",
    alt: "An atmospheric discovery zone with rich textures and a sense of exploration.",
    slides: [
      {
        main: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a596aa4843891ed4c197_aurelia%20garden%20bedroom.avif",
        thumb: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a596aa4843891ed4c197_aurelia%20garden%20bedroom.avif",
        label: "LEGEND",
        metric: 4,
        unit: "ACTS",
        metricText: "chapters in the story",
      },
      {
        main: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a5964f921296552502fa_aurelia%20garden%20living%20room.avif",
        thumb: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a5964f921296552502fa_aurelia%20garden%20living%20room.avif",
        label: "SYMBOLS",
        metric: 11,
        unit: "SIGNS",
        metricText: "secrets to decode",
      },
      {
        main: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a5966a0dace32b234526_aurelia%20garden%20office.avif",
        thumb: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a5966a0dace32b234526_aurelia%20garden%20office.avif",
        label: "CREW",
        metric: 2,
        unit: "-8",
        metricText: "players per expedition",
      },
      {
        main: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a5962d26df51ec9745a8_aurelia%20garden%20garden.avif",
        thumb: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/6949a5962d26df51ec9745a8_aurelia%20garden%20garden.avif",
        label: "PRIZE",
        metric: 1,
        unit: "GOAL",
        metricText: "hidden chamber to unlock",
      },
    ],
  },
];

const BELIEFS = [
  {
    title: ["Fearless", "fun"],
    text: "Experiences designed to push curiosity past comfort zones.",
  },
  {
    title: ["Team-first", "energy"],
    text: "Every challenge gets better when the whole crew is involved.",
  },
  {
    title: ["Story-driven", "immersion"],
    text: "Spaces that feel cinematic, tactile, and impossible to ignore.",
  },
  {
    title: ["Replayable", "thrills"],
    text: "Formats that reward repeat visits, rematches, and new strategies.",
  },
  {
    title: ["Memorable", "nights"],
    text: "Built for birthdays, office outings, and bold plans with friends.",
  },
];

const AMENITIES = [
  {
    titleLines: ["Competitive", "gameplay"],
    textLines: [
      "Axe throwing lanes, live scoring, and expert hosts turn every match into",
      "a crowd-pulling showdown.",
    ],
    bigImage:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881e61a7e42ff6909d76b_amenities-img-1--big.avif",
    smallImage:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881e6a674c6a8d122c34d_amenities-img-1--small.avif",
  },
  {
    titleLines: ["Story-led", "missions"],
    textLines: [
      "Escape rooms with layered set design, timed reveals, and tactile puzzles",
      "make every run feel like a real operation.",
    ],
    bigImage:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881f24c53d654d7f00751_amenities-img-3--big.avif",
    smallImage:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881f1049ac7d72bb5f66f_amenities-img-3--small.avif",
  },
  {
    titleLines: ["Group-ready", "moments"],
    textLines: [
      "From office outings to birthday takeovers, the venue is built to keep big",
      "energy flowing from arrival to final photo.",
    ],
    bigImage:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881ec1f8b80b2102e2e7b_amenities-img-2--big.avif",
    smallImage:
      "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881eb51e7ae892329f6f6_amenities-img-2--small.avif",
  },
];

const FAQS = [
  {
    question: "What can we play at House of Thrill?",
    answer:
      "House of Thrill combines axe throwing, story-rich escape rooms, and group-first activity formats so your visit can feel competitive, cinematic, and social at the same time.",
  },
  {
    question: "Are the rooms beginner-friendly?",
    answer:
      "Yes. First-timers are welcome. Our game masters guide the flow, the challenge builds naturally, and your team gets enough structure to stay engaged without losing the thrill.",
  },
  {
    question: "Is it good for birthdays and office outings?",
    answer:
      "Absolutely. The experience is built for squads, celebrations, team building, and friendly rivalry. We can help groups plan a visit that keeps everyone involved.",
  },
  {
    question: "How long should we plan for a visit?",
    answer:
      "Most groups should reserve 60 to 120 minutes depending on the mix of activities. If you’re combining multiple experiences, giving yourselves extra time makes the visit much better.",
  },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

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

function splitWords(words) {
  return words.map((word, index) => (
    <span className="word" aria-hidden="true" key={`${word}-${index}`}>
      {word}
      {index < words.length - 1 ? "\u00A0" : ""}
    </span>
  ));
}

function LineReveal({ as: Tag = "div", className = "", lines, align = "start", ...props }) {
  const Wrapper = Tag === "p" ? "span" : "div";

  return (
    <Tag className={className} {...props}>
      {lines.map((line, index) => (
        <Wrapper className="line-mask" key={`${line}-${index}`}>
          <Wrapper className="line-inner" style={{ textAlign: align }}>
            {line}
          </Wrapper>
        </Wrapper>
      ))}
    </Tag>
  );
}

function InputClearIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 18L6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BurgerIcon({ open }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path
            d="M18 18L6 6"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 6L6 18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M3.75 15H20.25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.75 9H20.25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function HomePage() {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const projectSplideRef = useRef(null);
  const projectReadyRef = useRef(false);
  const previousProjectRef = useRef(0);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const modalThumbRef = useRef(null);
  const lastFocusedElementRef = useRef(null);
  const numberAnimatedRef = useRef(false);
  const amenitiesTriggersRef = useRef([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [touchMode, setTouchMode] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [hoverFaq, setHoverFaq] = useState(-1);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [modalProjectIndex, setModalProjectIndex] = useState(null);
  const [modalClosing, setModalClosing] = useState(false);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);

  const activeFaq = hoverFaq !== -1 && !touchMode ? hoverFaq : openFaq;
  const modalProject = modalProjectIndex === null ? null : PROJECTS[modalProjectIndex];

  function animateProjectIn(index) {
    const title = rootRef.current?.querySelector(`.project-title[data-project="${index}"]`);
    const text = rootRef.current?.querySelector(`.project-text[data-project="${index}"]`);

    if (!title || !text) {
      return;
    }

    gsap.to(title.querySelectorAll(".line-inner"), {
      yPercent: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });

    gsap.to(text.querySelectorAll(".line-inner"), {
      yPercent: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.25,
    });
  }

  function animateProjectOut(index) {
    const title = rootRef.current?.querySelector(`.project-title[data-project="${index}"]`);
    const text = rootRef.current?.querySelector(`.project-text[data-project="${index}"]`);

    if (!title || !text) {
      return;
    }

    gsap.to([title.querySelectorAll(".line-inner"), text.querySelectorAll(".line-inner")], {
      yPercent: -100,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
    });
  }

  function closeModal() {
    if (modalProjectIndex === null) {
      return;
    }

    setModalClosing(true);

    window.setTimeout(() => {
      setModalProjectIndex(null);
      setModalClosing(false);
      lastFocusedElementRef.current?.focus?.();
    }, 1250);
  }

  useEffect(() => {
    const media = window.matchMedia("(hover: none)");
    const handleChange = () => {
      const nextTouchMode = media.matches;
      setTouchMode(nextTouchMode);
      setOpenFaq(nextTouchMode ? 0 : -1);
    };

    handleChange();

    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 479) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heroChars = gsap.utils.toArray('[data-hero="title"] .char');
      const heroWords = gsap.utils.toArray('[data-hero="title-min"] .word');

      gsap.set(heroChars, { yPercent: 100 });
      gsap.set(heroWords, { opacity: 0, y: 30, rotationX: -45 });
      gsap.set('[data-hero="subtitle"]', { opacity: 0, y: 40 });
      gsap.set('[data-hero="scroll"]', { opacity: 0, y: 20 });
      gsap.set('[data-hero="nav"]', { opacity: 0, yPercent: -100 });
      gsap.set('[data-hero="line"]', { opacity: 0, scaleX: 0 });

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
          '[data-hero="line"]',
          {
            opacity: 1,
            scaleX: 1,
            duration: 1,
          },
          4,
        );

      ScrollTrigger.create({
        trigger: ".hero",
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
            opacity: clamp(1 - progress * 1.5, 0, 1),
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

      gsap.utils.toArray('[data-anim="img-paralax"]').forEach((element) => {
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
        trigger: ".stats",
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (numberAnimatedRef.current) {
            return;
          }

          numberAnimatedRef.current = true;

          gsap.utils.toArray("[data-number]").forEach((element) => {
            const target = Number.parseInt(element.textContent ?? "0", 10);
            if (Number.isNaN(target)) {
              return;
            }

            const proxy = { value: 0 };
            element.textContent = "0";

            gsap.to(proxy, {
              value: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                element.textContent = `${Math.ceil(proxy.value)}`;
              },
            });
          });
        },
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const titles = gsap.utils.toArray(".project-title");
      const texts = gsap.utils.toArray(".project-text");

      titles.forEach((title) => {
        gsap.set(title.querySelectorAll(".line-inner"), { yPercent: 100 });
      });

      texts.forEach((text) => {
        gsap.set(text.querySelectorAll(".line-inner"), { yPercent: 100 });
      });

      ScrollTrigger.create({
        trigger: ".project-titles",
        start: "top 80%",
        once: true,
        onEnter: () => {
          projectReadyRef.current = true;
          animateProjectIn(0);
        },
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!projectReadyRef.current) {
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

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = document.querySelector(".anim-track");
      const header = headerRef.current;
      const bigImages = gsap.utils.toArray('[data-amenities-anim="big-image"]');
      const smallImages = gsap.utils.toArray('[data-amenities-anim="small-image"]');
      const textBoxes = gsap.utils.toArray(".amenities-slide-box");
      const triggers = gsap.utils.toArray('[data-amenities-anim="trigger"]');
      const progressLine = document.querySelector(".amenities-progress-line");
      const sliceCount = 30;

      amenitiesTriggersRef.current.forEach((trigger) => trigger.kill());
      amenitiesTriggersRef.current = [];

      if (section && header) {
        const headerTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onEnter: () => {
            gsap.to(header, { yPercent: -100, pointerEvents: "none", duration: 0.3 });
          },
          onLeave: () => {
            gsap.to(header, { yPercent: 0, pointerEvents: "auto", duration: 0.3 });
          },
          onEnterBack: () => {
            gsap.to(header, { yPercent: -100, pointerEvents: "none", duration: 0.3 });
          },
          onLeaveBack: () => {
            gsap.to(header, { yPercent: 0, pointerEvents: "auto", duration: 0.3 });
          },
        });

        amenitiesTriggersRef.current.push(headerTrigger);
      }

      if (progressLine) {
        const progressTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (window.innerWidth <= 767) {
              gsap.set(progressLine, { xPercent: self.progress * 200, yPercent: 0 });
            } else {
              gsap.set(progressLine, { yPercent: self.progress * 200, xPercent: 0 });
            }
          },
        });

        amenitiesTriggersRef.current.push(progressTrigger);
      }

      bigImages.forEach((image, index) => {
        if (index === 0) {
          gsap.set(image, { x: 100, opacity: 0 });
        } else {
          const initial = new Array(sliceCount).fill(0);
          image.style.setProperty("--mask-gradient", buildMaskGradient(initial, sliceCount));
        }
      });

      smallImages.forEach((image) => {
        gsap.set(image, { clipPath: "inset(100% 0% 0% 0%)" });
      });

      textBoxes.forEach((box) => {
        gsap.set(box.querySelectorAll(".line-inner"), { yPercent: 100 });
        gsap.set(box, { opacity: 0, visibility: "hidden" });
      });

      let firstAnimated = false;

      triggers.forEach((trigger, index) => {
        if (index === 0) {
          const firstTrigger = ScrollTrigger.create({
            trigger,
            start: "top 80%",
            onEnter: () => {
              if (firstAnimated) {
                return;
              }

              firstAnimated = true;

              gsap.to(bigImages[0], {
                x: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
              });

              gsap.to(smallImages[0], {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.8,
                ease: "power2.out",
                delay: 0.2,
              });

              gsap.set(textBoxes[0], { opacity: 1, visibility: "visible" });
              gsap
                .timeline({ delay: 0.3 })
                .to(textBoxes[0].querySelectorAll(".amenities-title .line-inner"), {
                  yPercent: 0,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: "power3.out",
                })
                .to(
                  textBoxes[0].querySelectorAll(".amenities-paragraph .line-inner"),
                  {
                    yPercent: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power3.out",
                  },
                  "-=0.5",
                );
            },
          });

          amenitiesTriggersRef.current.push(firstTrigger);
          return;
        }

        const showProgress = new Array(sliceCount).fill(0);
        const nextBox = textBoxes[index];
        const previousBox = textBoxes[index - 1];

        const imageTimeline = gsap.timeline({
          onUpdate: () => {
            bigImages[index].style.setProperty(
              "--mask-gradient",
              buildMaskGradient(showProgress, sliceCount),
            );
          },
          scrollTrigger: {
            trigger,
            start: "top center",
            end: "center center",
            scrub: 1,
          },
        });

        for (let slice = 0; slice < sliceCount; slice += 1) {
          imageTimeline.to(showProgress, { [slice]: 1, duration: 0.5, ease: "none" }, slice * 0.015);
        }

        amenitiesTriggersRef.current.push(imageTimeline.scrollTrigger);

        const smallTween = gsap.fromTo(
          smallImages[index],
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scrollTrigger: {
              trigger,
              start: "top center",
              end: "center center",
              scrub: 1,
            },
          },
        );

        amenitiesTriggersRef.current.push(smallTween.scrollTrigger);

        const textTimeline = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: "top center",
            end: "center center",
            scrub: 1,
          },
        });

        textTimeline
          .to(previousBox.querySelectorAll(".line-inner"), {
            yPercent: -100,
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.in",
          })
          .to(previousBox, {
            opacity: 0,
            visibility: "hidden",
            duration: 0.1,
          })
          .set(nextBox, {
            opacity: 1,
            visibility: "visible",
          })
          .fromTo(
            nextBox.querySelectorAll(".amenities-title .line-inner"),
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.4,
              stagger: 0.05,
              ease: "power3.out",
            },
          )
          .fromTo(
            nextBox.querySelectorAll(".amenities-paragraph .line-inner"),
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.3,
              stagger: 0.04,
              ease: "power3.out",
            },
            "-=0.2",
          );

        amenitiesTriggersRef.current.push(textTimeline.scrollTrigger);
      });
    }, rootRef);

    return () => {
      amenitiesTriggersRef.current.forEach((trigger) => trigger?.kill());
      amenitiesTriggersRef.current = [];
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    if (!modalProject || modalClosing) {
      return undefined;
    }

    const context = gsap.context(() => {
      const backgroundImages = gsap.utils.toArray(".modal-bg-image");
      const activeImage = backgroundImages[0];
      const fullProgress = new Array(30).fill(1);

      backgroundImages.forEach((image, index) => {
        if (index === 0) {
          gsap.set(image, { opacity: 1, visibility: "visible" });
          image.style.setProperty("--mask-gradient", buildMaskGradient(fullProgress));
        } else {
          gsap.set(image, { opacity: 0, visibility: "hidden" });
          image.style.setProperty("--mask-gradient", buildMaskGradient(new Array(30).fill(0)));
        }
      });

      if (activeImage) {
        activeImage.classList.add("is-active");
      }

      gsap.fromTo(
        ".modal-title .line-inner",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06, delay: 1, ease: "power3.out" },
      );

      gsap.from(
        [".modal-description", ".modal-btn", ".modal-slide-info"],
        {
          opacity: 0,
          yPercent: 100,
          duration: 0.7,
          stagger: 0.1,
          delay: 1.1,
          ease: "power3.out",
        },
      );
    }, modalRef);

    return () => context.revert();
  }, [modalProject, modalClosing]);

  const closeModalEvent = useEffectEvent(() => {
    closeModal();
  });

  useEffect(() => {
    if (!modalProject) {
      document.body.style.overflow = menuOpen ? "hidden" : "";
      return undefined;
    }

    document.body.style.overflow = "hidden";

    const info = modalProject.slides[modalSlideIndex];
    const label = modalRef.current?.querySelector("#slideInfoLabel");
    const number = modalRef.current?.querySelector("#slideInfoNumber");
    const unit = modalRef.current?.querySelector("#slideInfoUnit");
    const text = modalRef.current?.querySelector("#slideInfoText");

    if (label && number && unit && text) {
      gsap.to([label, number, unit, text], {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          label.textContent = info.label;
          unit.textContent = info.unit;
          text.textContent = info.metricText;

          const currentValue = Number.parseInt(number.textContent ?? "0", 10) || 0;
          const proxy = { value: currentValue };

          gsap.to(proxy, {
            value: info.metric,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
              number.textContent = `${Math.ceil(proxy.value)}`;
            },
          });

          gsap.to([label, number, unit, text], { opacity: 1, duration: 0.3 });
        },
      });
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModalEvent();
      }

      if (event.key !== "Tab" || !modalContentRef.current) {
        return;
      }

      const focusable = modalContentRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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

    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      modalRef.current?.querySelector(".modal-close")?.focus();
    }, 120);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = menuOpen ? "hidden" : "";
    };
  }, [menuOpen, modalProject, modalSlideIndex]);

  useEffect(() => {
    if (!modalProject || !modalRef.current) {
      return;
    }

    const backgroundImages = modalRef.current.querySelectorAll(".modal-bg-image");

    backgroundImages.forEach((image) => image.classList.remove("is-active"));

    const activeBackground = backgroundImages[modalSlideIndex];
    if (!activeBackground) {
      return;
    }

    backgroundImages.forEach((image, index) => {
      if (index !== modalSlideIndex) {
        image.style.opacity = "0";
        image.style.visibility = "hidden";
      }
    });

    activeBackground.classList.add("is-active");
    gsap.set(activeBackground, { opacity: 1, visibility: "visible" });

    const progress = new Array(30).fill(0);
    const timeline = gsap.timeline({
      onUpdate: () => {
        activeBackground.style.setProperty("--mask-gradient", buildMaskGradient(progress));
      },
    });

    for (let slice = 0; slice < 30; slice += 1) {
      timeline.to(progress, { [slice]: 1, duration: 0.8, ease: "none" }, slice * 0.01);
    }

    return () => {
      timeline.kill();
    };
  }, [modalProject, modalSlideIndex]);

  function openModal(projectIndex, event) {
    if (event) {
      event.preventDefault();
    }

    lastFocusedElementRef.current = document.activeElement;
    setModalProjectIndex(projectIndex);
    setModalSlideIndex(0);
    setModalClosing(false);
    setMenuOpen(false);
  }

  function handleAnchorScroll(event) {
    event.preventDefault();
    setMenuOpen(false);

    if (modalProjectIndex !== null) {
      closeModal();
      window.setTimeout(() => {
        document.querySelector("#book-a-visit")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 180);
      return;
    }

    document.querySelector("#book-a-visit")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleInputChange(field) {
    return (event) => {
      setSubmitted(false);
      setFormValues((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function handleClear(field) {
    return () => {
      setFormValues((current) => ({ ...current, [field]: "" }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main
      ref={rootRef}
      className="main-wrapper relative overflow-x-clip bg-[#11100f] text-[#f5efe6]"
    >
      <header ref={headerRef} className="header">
        <div className="nav" data-hero="nav">
          <div className="nav-overlay"></div>
          <div className="page-padding">
            <div className="container nav-container">
              <a href="#top" className="logo nav-logo" aria-label="House of Thrill">
                HOUSE OF THRILL
              </a>

              <nav
                className={`nav__menu-wrap ${menuOpen ? "is-open" : ""}`}
                role="navigation"
                aria-label="Primary"
              >
                <div className="nav__menu-top"></div>
                <div className="nav__menu">
                  <ul role="list" className="nav__list">
                    {PROJECTS.map((project, index) => (
                      <li className="nav__list-item" key={project.navLabel}>
                        <a
                          href="#"
                          className="nav__link"
                          onClick={(event) => openModal(index, event)}
                        >
                          <div>{project.navLabel}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a href="#book-a-visit" className="btn nav-btn" onClick={handleAnchorScroll}>
                    <div>BOOK A VISIT</div>
                  </a>
                </div>
              </nav>

              <button
                type="button"
                className="burger"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((current) => !current)}
              >
                <div className="burger__box">
                  <BurgerIcon open={menuOpen} />
                </div>
              </button>

              <div data-hero="line" className="nav-line"></div>
            </div>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="page-padding">
          <div className="container">
            <div className="wrap hero-wrap">
              <div className="heading hero-heading">
                <h1 data-hero="title" className="h1 hero-title" aria-label={HERO_TITLE}>
                  {HERO_TITLE.split("").map((character, index) => (
                    <span className="char-mask" aria-hidden="true" key={`${character}-${index}`}>
                      <span className="char" aria-hidden="true">
                        {character}
                      </span>
                    </span>
                  ))}
                </h1>

                <div data-hero="content" className="hero-right">
                  <div className="hero-right-heading">
                    <div data-hero="title-min" className="h6 mob-h7">
                      {splitWords(HERO_WORDS)}
                    </div>
                    <p data-hero="subtitle" className="b3">
                      House of Thrill turns nights out into story-rich, high-pressure,
                      laugh-loud adventures with axe throwing, immersive escape rooms,
                      and bold group experiences built for Bhopal.
                    </p>
                  </div>
                  <div data-hero="scroll" className="text-btn-01 hero-scroll">
                    SCROLL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div data-hero="bg" className="full-bg-wrap">
          <div data-hero="img" className="full-bg-inner is-desktop">
            <Ballpit 
              className="ballpit-hero"
              count={150}
              followCursor={true}
              colors={[0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xff8b94]}
              ambientColor={0xffffff}
              ambientIntensity={0.8}
              lightIntensity={150}
              materialParams={{
                metalness: 0.6,
                roughness: 0.4,
                clearcoat: 1,
                clearcoatRoughness: 0.2
              }}
              minSize={0.4}
              maxSize={0.9}
              gravity={0.4}
              friction={0.98}
              wallBounce={0.92}
            />
          </div>
        </div>
      </section>

      <section className="about">
        <div className="page-padding">
          <div className="container">
            <div className="wrap about-wrap">
              <div className="about-info">
                <div className="about-left">
                  <div className="about-heading">
                    <div className="caption">
                      <div className="h6 mob-h8">(About)</div>
                    </div>
                    <h2 className="h5-glare mob-h7">
                      every visit <span className="h5 mob-h7">should feel</span>{" "}
                      bigger than routine
                    </h2>
                  </div>

                  <div className="about-img">
                    <img
                      src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881a350b370d1b613ff09_about-img--d.avif"
                      loading="lazy"
                      width="893"
                      height="1376"
                      alt="A dramatic interior with premium lighting and rich materials."
                      data-anim="img-paralax"
                      className="img-full-cover"
                    />
                    <div className="img-overlay"></div>
                  </div>
                </div>

                <div className="about-text-box">
                  <p className="b1">
                    House of Thrill is built for people who want more than a standard
                    hangout. It blends cinematic escape rooms, competitive axe
                    throwing, and social-first energy into one destination.
                  </p>
                  <p className="b1">
                    Every zone is designed to feel immersive, tactile, and a little
                    unexpected, so the experience starts the moment your crew walks in.
                  </p>
                  <p className="b1">
                    Whether you are planning a casual challenge night, a birthday, or a
                    team outing, the format is built to keep everyone involved.
                  </p>
                </div>
              </div>

              <div className="stats">
                <div className="stats-row-1">
                  {ABOUT_STATS.slice(0, 2).map((item, index) => (
                    <div className={`stats-box stats-box-${index + 1}`} key={item.text}>
                      <div className="stats-box-row">
                        <div className="h2 mob-h5">
                          {item.suffix === "k" ? (
                            <>
                              <span data-number={item.value}>{item.value}</span>
                              <span className="stats-suffix">k</span>
                            </>
                          ) : item.suffix === "%" ? (
                            <>
                              <span data-number={item.value}>{item.value}</span>
                              <span className="stats-suffix">%</span>
                            </>
                          ) : (
                            <span>{item.value}</span>
                          )}
                        </div>
                      </div>
                      <p className="b1 mob-b4">{item.text}</p>
                    </div>
                  ))}
                </div>
                <div className="stats-row-2">
                  <div className="stats-box stats-box-3">
                    <div className="stats-box-row">
                      <div className="h2 mob-h5">
                        <span data-number={ABOUT_STATS[2].value}>{ABOUT_STATS[2].value}</span>
                        <span className="stats-suffix">k</span>
                      </div>
                    </div>
                    <p className="b1 mob-b4">{ABOUT_STATS[2].text}</p>
                  </div>
                </div>
                <div className="stats-row-3">
                  <div className="stats-box stats-box-4">
                    <div className="stats-box-row">
                      <div className="h2 mob-h5">{ABOUT_STATS[3].value}</div>
                    </div>
                    <p className="b1 mob-b4">{ABOUT_STATS[3].text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="page-padding">
          <div className="container">
            <div className="wrap projects-wrap">
              <div className="projects-heading">
                <div className="caption">
                  <div className="h6 mob-h8">(escape themes)</div>
                </div>
              </div>

              <div className="project-titles">
                {PROJECTS.map((project, index) => (
                  <div
                    className={`project-title ${index === activeProject ? "is-active" : ""} ${
                      index === 0 ? "is-first" : ""
                    }`}
                    data-project={index}
                    key={project.navLabel}
                  >
                    <LineReveal
                      as="h2"
                      className="h4 mob-h7"
                      lines={project.titleLines}
                      align="center"
                    />
                  </div>
                ))}
              </div>

              <Splide
                ref={projectSplideRef}
                className="projects-slider"
                aria-label="Project slider"
                options={{
                  classes: {
                    pagination: "splide__pagination projects-pagination",
                    page: "splide__pagination__page projects-pagination-page",
                  },
                  type: "loop",
                  perPage: 1,
                  flickPower: 800,
                  speed: 1000,
                  arrows: false,
                  pagination: true,
                  gap: "14rem",
                  focus: "center",
                  updateOnMove: true,
                  drag: false,
                  breakpoints: {
                    480: {
                      gap: "1.5rem",
                      drag: true,
                    },
                  },
                }}
                onMoved={(_, newIndex, prevIndex) => {
                  previousProjectRef.current = prevIndex;
                  setActiveProject(newIndex);
                }}
              >
                {PROJECTS.map((project, index) => (
                  <SplideSlide
                    className={`projects-slide ${index === activeProject ? "is-active" : ""}`}
                    key={project.navLabel}
                  >
                    <div className="projects-slide-img">
                      <img
                        className="img-full-cover"
                        src={project.image}
                        width="897"
                        height="1176"
                        alt={project.alt}
                        data-anim="img-paralax"
                        loading="lazy"
                      />
                    </div>
                  </SplideSlide>
                ))}
              </Splide>

              <div className="project-texts">
                {PROJECTS.map((project, index) => (
                  <div
                    className={`project-text ${index === activeProject ? "is-active" : ""} ${
                      index === 0 ? "is-first" : ""
                    }`}
                    data-project={index}
                    key={project.description}
                  >
                    <LineReveal as="p" className="b1" lines={project.summaryLines} />
                    <a
                      href="#"
                      className="btn stroke-btn in-project"
                      onClick={(event) => openModal(index, event)}
                    >
                      <div className="text-btn-01">LEARN MORE</div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="our-beliefs">
        <div className="page-padding">
          <div className="container">
            <div className="wrap our-beliefs-wrap">
              <div className="our-beliefs-heading">
                <div className="caption our-beliefs-caption">
                  <div className="h6 mob-h8">(Our beliefs)</div>
                </div>
                <h2 className="h4 mob-h7">Every challenge should feel worth remembering</h2>
              </div>

              <div className="our-beliefs-img">
                <div data-anim="img-paralax" className="full-bg-inner">
                  <img
                    src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881c0bd19ffb64b94f142_beliefs-img--d.avif"
                    loading="lazy"
                    width="1439"
                    height="1640"
                    alt="A premium interior photograph with a polished editorial look."
                    className="img-full-cover is-desktop"
                  />
                  <img
                    src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881bfdfb07f671238f951_beliefs-img--mob.avif"
                    loading="lazy"
                    width="503"
                    height="774"
                    alt="A premium interior photograph for mobile layout."
                    className="img-full-cover is-mobile"
                  />
                </div>
                <div className="img-overlay"></div>
              </div>

              <div className="our-beliefs-text-box">
                <p className="b1">
                  We believe great entertainment should feel immersive, social, and
                  intentional, not disposable. The room, the pacing, the reveal, and the
                  group dynamic all matter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="beliefs">
        <div className="page-padding">
          <div className="container">
            <div className="wrap beliefs-wrap">
              {BELIEFS.map((belief, index) => (
                <div className="beliefs-item" key={belief.text}>
                  <div className="beliefs-card">
                    <div className="beliefs-card-bg"></div>
                    <div className="beliefs-card-heading">
                      <h3 className="h6 mob-h8">
                        {belief.title.map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </h3>
                      <p className="b4 mob-c1">{belief.text}</p>
                    </div>
                  </div>
                  <div className="b4">{`( ${index + 1} )`}</div>
                </div>
              ))}

              <div className="beliefs-text-box">
                <p className="b1">
                  House of Thrill is built around bold design, high participation, and
                  the kind of moments people keep replaying long after the night ends.
                </p>
                <p className="b1">
                  The goal is simple: give every group a reason to lean in, speak up,
                  compete harder, and leave with a story.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="full-bg-wrap beliefs-background">
          <div data-anim="img-paralax" className="full-bg-inner">
            <img
              src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881c0f19790d102a7679d_beliefs-img-2--d.avif"
              loading="lazy"
              width="2880"
              height="2124"
              alt="A wide editorial background image."
              className="img-full-cover is-desktop"
            />
            <img
              src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881bf041520f6c9ca8770_beliefs-img-2--mob.avif"
              loading="lazy"
              width="563"
              height="2039"
              alt="A tall editorial background image for mobile."
              className="img-full-cover is-mobile"
            />
          </div>
          <div className="img-overlay"></div>
        </div>
      </section>

      <section className="amenities">
        <div className="page-padding">
          <div className="container">
            <div data-amenities-anim="track" className="anim-track">
              <div data-amenities-anim="sticky" className="wrap amenities-wrap">
                <div data-amenities-anim="images-container" className="amenities-images-container">
                  <div className="amenities-images-big">
                    {AMENITIES.map((item, index) => (
                      <div
                        data-amenities-anim="big-image"
                        className={`amenities-slide-imgs ${index === 0 ? "is-first" : ""}`}
                        key={item.bigImage}
                      >
                        <img
                          src={item.bigImage}
                          loading="lazy"
                          width="1442"
                          height="1815"
                          alt="Editorial amenity visual"
                          className="img-full-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="amenities-images-small">
                    {AMENITIES.map((item, index) => (
                      <div
                        data-amenities-anim="small-image"
                        className={`amenities-slide-img-inner ${index === 0 ? "is-first" : ""}`}
                        key={item.smallImage}
                      >
                        <img
                          src={item.smallImage}
                          loading="lazy"
                          width="893"
                          height="1080"
                          alt="Secondary amenity visual"
                          className="img-full-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="amenities-texts-container">
                  <div className="amenities-progress">
                    <div className="amenities-progress-line"></div>
                  </div>

                  <div className="amenities-slide-copy">
                    {AMENITIES.map((item, index) => (
                      <div
                        className={`amenities-slide-box ${index === 0 ? "is-first" : ""}`}
                        key={item.titleLines.join("-")}
                      >
                        <LineReveal
                          as="h2"
                          className="h5 mob-h6 amenities-title"
                          lines={item.titleLines}
                        />
                        <div className="amenities-slide-text">
                          <LineReveal
                            as="p"
                            className="b1 amenities-paragraph"
                            lines={item.textLines}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div data-amenities-anim="triggers" className="amenities-triggers">
                  {AMENITIES.map((item) => (
                    <div data-amenities-anim="trigger" className="amenities-trigger" key={item.bigImage}></div>
                  ))}
                  <div className="amenities-trigger is-last"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="faq-relative">
        <div className="faq-spacer"></div>
        <section className="faq">
          <div className="page-padding">
            <div className="container">
              <div className="wrap faq-wrap">
                <div className="heading faq-heading">
                  <div className="h6 mob-h8">(FAQ)</div>
                  <h2 className="h4 mob-h7">Your Questions, Answered</h2>
                </div>

                <div className="faq-list">
                  {FAQS.map((item, index) => {
                    const isOpen = activeFaq === index;

                    return (
                      <div
                        data-dropdown=""
                        className={`faq-dropdown ${isOpen ? "active" : ""}`}
                        key={item.question}
                        onMouseEnter={() => {
                          if (!touchMode) {
                            setHoverFaq(index);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!touchMode) {
                            setHoverFaq(-1);
                          }
                        }}
                      >
                        <div className="b1 text-color-white-50">{`( ${index + 1} )`}</div>

                        <button
                          type="button"
                          data-dropdown-toggle=""
                          className="faq-dropdown-toggle"
                          aria-expanded={isOpen}
                          aria-describedby={`faq-dropdown-${index}`}
                          onClick={() => {
                            if (touchMode) {
                              setOpenFaq((current) => (current === index ? -1 : index));
                            }
                          }}
                        >
                          <h3 className="h6">{item.question}</h3>
                        </button>

                        <div
                          data-dropdown-list=""
                          className="faq-dropdown-list"
                          id={`faq-dropdown-${index}`}
                          role="tooltip"
                          aria-hidden={!isOpen}
                        >
                          <div className="faq-dropdown-box">
                            <p className="b1">{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="book-a-visit" className="cta">
          <div className="page-padding">
            <div className="container">
              <div className="wrap cta-wrap">
                <div className="heading cta-heading">
                  <h2 className="h6 cta-title">
                    Plan a crew night that feels bigger than the usual weekend routine
                  </h2>
                  <p className="b1">
                    Book axe throwing, escape rooms, or a full-format House of Thrill
                    visit and our team will help you shape the right experience.
                  </p>
                </div>

                <div className="form-wrap">
                  <div className="form-block w-form">
                    <form id="cta-form" className="form" aria-label="Booking form" onSubmit={handleSubmit}>
                      <div className="heading form-heading">
                        <h2 className="h5 mob-h7">
                          Lock in{" "}
                          <span className="h5-glare mob-h7">your House of Thrill slot</span>
                        </h2>
                        <p className="b1 text-color-white-70">
                          Our manager will contact you as soon as possible.
                        </p>
                      </div>

                      <div className="inputs">
                        <div className="input-wrap">
                          <input
                            className="input"
                            maxLength="256"
                            name="name"
                            placeholder="Name"
                            type="text"
                            required
                            value={formValues.name}
                            onChange={handleInputChange("name")}
                          />
                          {formValues.name ? (
                            <button type="button" aria-label="clear" className="input-clear-btn" onClick={handleClear("name")}>
                              <span className="input-clear-icon">
                                <InputClearIcon />
                              </span>
                            </button>
                          ) : null}
                        </div>

                        <div className="input-wrap">
                          <input
                            className="input"
                            maxLength="256"
                            name="email"
                            placeholder="Email"
                            type="email"
                            required
                            value={formValues.email}
                            onChange={handleInputChange("email")}
                          />
                          {formValues.email ? (
                            <button type="button" aria-label="clear" className="input-clear-btn" onClick={handleClear("email")}>
                              <span className="input-clear-icon">
                                <InputClearIcon />
                              </span>
                            </button>
                          ) : null}
                        </div>

                        <div className="input-wrap">
                          <input
                            className="input"
                            maxLength="256"
                            name="phone"
                            placeholder="Phone"
                            type="tel"
                            value={formValues.phone}
                            onChange={handleInputChange("phone")}
                          />
                          {formValues.phone ? (
                            <button type="button" aria-label="clear" className="input-clear-btn" onClick={handleClear("phone")}>
                              <span className="input-clear-icon">
                                <InputClearIcon />
                              </span>
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="form-bottom">
                        <input type="submit" className="btn form-btn" value="request" />
                        <div className="form-bottom-text">
                          <p className="b4 mob-c1">
                            By sending your request, you&apos;re agreeing to our privacy policy.
                            We promise to keep your information safe and secure.
                          </p>
                        </div>
                      </div>
                    </form>

                    <div className={`success-msg ${submitted ? "is-visible" : ""}`} tabIndex="-1" role="region">
                      <div className="success-msg-box">
                        <div className="b0 mob-b1">
                          Thank you!
                          <br />
                          Your submission has been received.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="full-bg-wrap in-cta">
            <div data-anim="img-paralax" className="full-bg-inner">
              <img
                src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881d5049ac7d72bb5f18f_cta-img--d.avif"
                loading="lazy"
                width="2880"
                height="1650"
                alt="A cinematic architectural background."
                className="img-full-cover is-desktop"
              />
              <img
                src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881c82316816e1085777d_cta-img--mob.avif"
                loading="lazy"
                width="563"
                height="1869"
                alt="A cinematic architectural background for mobile."
                className="img-full-cover is-mobile"
              />
            </div>
            <div className="img-overlay"></div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="page-padding">
          <div className="container">
            <div className="wrap footer-wrap">
              <div className="footer-top">
                <div className="footer-col">
                  <div className="footer-col-title is-first">
                    <h3 className="h6 mob-h8">(Get in touch)</h3>
                    <div className="footer-line is-top is-visible"></div>
                  </div>
                  <div className="footer-logo">HOUSE OF THRILL</div>
                </div>

                <div className="footer-right">
                  <div className="footer-col">
                    <div className="footer-col-title">
                      <h3 className="h6 mob-h8">(location)</h3>
                    </div>
                    <address className="is-location">
                      <div className="b1">Bhopal, Madhya Pradesh, India</div>
                    </address>
                  </div>

                  <div className="footer-col">
                    <div className="footer-col-title">
                      <h3 className="h6 mob-h8">(Contact)</h3>
                    </div>
                    <div className="contact-box">
                      <a href="tel:+917987097199" className="text-link-light">
                        <div className="h6 mob-h8">+91 79870 97199</div>
                      </a>
                      <a href="mailto:houseofthrill@gmail.com" className="text-link-light">
                        <div className="h6 mob-h8">houseofthrill@gmail.com</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <div className="b4 mob-c1">©2026. House of Thrill. All rights reserved.</div>
                <div className="footer-right in-bottom">
                  <a href="#book-a-visit" className="text-link-light-50" onClick={handleAnchorScroll}>
                    <div className="b4 mob-c1">Book a visit</div>
                  </a>
                  <a
                    href="https://phenomenonstudio.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-link-light-50"
                  >
                    <div className="b4 mob-c1">Inspired by Phenomenon</div>
                  </a>
                </div>
                <div className="footer-line is-visible"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {modalProject ? (
        <div
          ref={modalRef}
          id="projectModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          aria-hidden="false"
          className={`modal ${modalClosing ? "is-closing" : "is-open"}`}
        >
          <div className="modal-overlay" onClick={closeModal}></div>

          <div ref={modalContentRef} className="modal-content">
            <div className="modal-layout">
              <div className="modal-layout-bg"></div>

              <div className="modal-info">
                <div className="modal-header">
                  <div className="modal-logo">HOUSE OF THRILL</div>
                  <button
                    type="button"
                    aria-label="Close the modal window"
                    className="modal-close"
                    onClick={closeModal}
                  >
                    <span className="modal-close-icon">
                      <InputClearIcon />
                    </span>
                  </button>
                  <div className="modal-header-line"></div>
                </div>

                <div className="modal-title">
                  <LineReveal
                    as="h2"
                    className="h7"
                    lines={modalProject.modalTitleLines}
                    id="modalTitle"
                  />
                </div>

                <div className="modal-description">
                  <p id="modalDescr" className="b3">
                    {modalProject.description}
                  </p>
                </div>

                <a href="#book-a-visit" className="btn modal-btn" onClick={handleAnchorScroll}>
                  <div>BOOK A VISIT</div>
                </a>
              </div>

              <div className="modal-slider-wrap">
                <div className="modal-bg-images">
                  {modalProject.slides.map((slide) => (
                    <div className="modal-bg-image" key={slide.main}>
                      <img src={slide.main} alt={slide.label} className="modal-slide-img" />
                    </div>
                  ))}
                </div>

                <Splide
                  ref={modalThumbRef}
                  className="modal-thumb-slider"
                  aria-label="Photo thumbnails"
                  options={{
                    fixedWidth: "6.25rem",
                    fixedHeight: "6.25rem",
                    gap: "0.375rem",
                    pagination: false,
                    arrows: false,
                    keyboard: "focused",
                    drag: false,
                    isNavigation: true,
                    speed: 0,
                    breakpoints: {
                      479: {
                        fixedWidth: "21rem",
                        fixedHeight: "18.25rem",
                        drag: true,
                        gap: "0.5rem",
                        speed: 600,
                        flickPower: 800,
                      },
                    },
                  }}
                  onMoved={(_, newIndex) => setModalSlideIndex(newIndex)}
                >
                  {modalProject.slides.map((slide) => (
                    <SplideSlide key={slide.thumb}>
                      <img src={slide.thumb} alt={`${slide.label} miniature`} className="modal-thumb-img" />
                    </SplideSlide>
                  ))}
                </Splide>
              </div>

              <div className="modal-slide-info-wrap">
                <div className="modal-slide-info">
                  <div className="slide-info-label">
                    <h3 id="slideInfoLabel" className="h6">
                      {modalProject.slides[0].label}
                    </h3>
                  </div>
                  <div className="slide-info-area">
                    <div id="slideInfoNumber" className="h3 mob-h5">
                      {modalProject.slides[0].metric}
                    </div>
                    <div className="slide-info-area-unit">
                      <div className="text-color-white-70">
                        <div id="slideInfoUnit" className="b0 mob-b1 is-it">
                          {modalProject.slides[0].unit}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="slide-info-text">
                    <div id="slideInfoText" className="b1 mob-b4">
                      {modalProject.slides[0].metricText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default HomePage;
