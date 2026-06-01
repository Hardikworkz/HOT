import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeaderSection from "./elyse/sections/HeaderSection.jsx";
import FooterSection from "./elyse/sections/FooterSection.jsx";
import AboutSection from "./elyse/sections/AboutSection.jsx";
import FaqSection from "./elyse/sections/FaqSection.jsx";
import AboutTicker from "./elyse/sections/AboutTicker.jsx";
import Ballpit from "./ui/Ballpit.jsx";
import aboutVideo from "../assets/about_video.mp4";
import "./elyse/sections/hero-section.css";  

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

function MiniPage() {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const touchMode = useTouchMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [hoverFaq, setHoverFaq] = useState(-1);

  const heroChars = "THRILL".split("");
  const MINI_HERO_WORDS = ["Bhopal's", "First", "Kids", "And", "Family", "Adventure", "Arena"];

  const MINI_FAQS = [
    {
      question: "What age group is Mini House of Thrill for?",
      answer:
        "Mini House of Thrill is designed primarily for kids and young teens, with experiences shaped to feel exciting, safe, and easy to enjoy for families together.",
    },
    {
      question: "Can parents join the activities too?",
      answer:
        "Yes. Many of the experiences are built so parents can guide, play alongside, or cheer from close by, making the visit feel shared instead of drop-off only.",
    },
    {
      question: "Is it safe for first-time or younger kids?",
      answer:
        "That is the whole point of the Mini format. Challenges are adapted for younger players with friendlier pacing, more support, and activity design that prioritizes confidence as much as fun.",
    },
    {
      question: "Is Mini House of Thrill good for birthdays and group outings?",
      answer:
        "Absolutely. It works especially well for birthdays, school groups, sibling outings, and weekend family plans because the activities are social, active, and easy to experience together.",
    },
    {
      question: "How is it different from the main House of Thrill?",
      answer:
        "Mini House of Thrill carries the same immersive atmosphere and premium design language, but the scale, intensity, and flow are reimagined for kids and family-friendly adventure.",
    },
  ];
  const activeFaq = touchMode ? openFaq : hoverFaq;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const chars = gsap.utils.toArray('.hero-title-main [data-char="true"]');
      const words = gsap.utils.toArray('.hero-kicker [data-word="true"]');

      gsap.set(chars, { yPercent: 100 });
      gsap.set(words, { opacity: 0, y: 30, rotationX: -45 });
      gsap.set('[data-hero="scroll"]', { opacity: 0, y: 20 });
      gsap.set('[data-hero="nav"]', { opacity: 0, yPercent: -100 });
      gsap.set('[data-hero="line"] .line-reveal-inner', { yPercent: 105 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(
          chars,
          {
            yPercent: 0,
            duration: 2,
            stagger: { each: 0.1 },
          },
          0.8,
        )
        .to(
          words,
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
        start: 1,
        onUpdate: () => {
          if (window.scrollY > 1) {
            headerRef.current?.classList.add("is-scrolled");
          } else {
            headerRef.current?.classList.remove("is-scrolled");
          }
        },
      });

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

      // Reveal animation for placeholder components
      gsap.utils.toArray("[data-reveal]").forEach((element) => {
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

      gsap.utils.toArray("[data-anim='element']").forEach((element) => {
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

      gsap.utils.toArray("[data-anim='stagger-wrap']").forEach((group) => {
        const items = group.querySelectorAll("[data-anim='stagger']");

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

      gsap.utils.toArray("[data-anim='img-overlay']").forEach((overlay) => {
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

      gsap.utils.toArray("[data-anim='img-paralax']").forEach((element) => {
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
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <main
      ref={rootRef}
      className="relative overflow-x-hidden bg-[#121110] text-[var(--color-text)]"
    >
        <HeaderSection
          headerRef={headerRef}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((current) => !current)}
          onVisit={() => navigate('/book/mini-house-of-thrill')}
        />

      <section className="hero-section relative w-full h-screen min-h-[100vh] overflow-hidden bg-[#11100f]">
        
        {/* --- BALLPIT BACKGROUND LAYER --- */}
        {/* Forced viewport dimensions and strict z-index to stay at the absolute bottom */}
        <div 
          className="absolute top-0 left-0 z-0 pointer-events-auto"
          style={{ width: '100vw', height: '100vh' }}
        >
          <div
            className="w-full h-full relative"
            data-hero="img"
          >
            {/* Added inline styles directly to the component as a fallback */}
            <Ballpit
              count={130}
              gravity={0.05}
              friction={0.995}
              wallBounce={0.95}
              followCursor={!touchMode}
              colors={[ '#8b4def', '#868686', '#2d295b', '#646464', '#000000']}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* --- FOREGROUND CONTENT LAYER --- */}
        {/* z-10 ensures it floats above, pointer-events-none lets the mouse pass through */}
        <div className="hero-container relative z-10 w-full h-full pointer-events-none flex items-center">
          <div className="hero-layout-wrapper w-full">
            <div className="hero-main-grid w-full">
              
              {/* Main Title Headings Container */}
              <div className="hero-heading pointer-events-auto select-text">
                <div className="hero-house-wrap">
                  <div
                    className="hero hero-house"
                    data-hero="house"
                  >
                    MINI HOUSE OF
                  </div>
                </div>        
                <div className="hero-title-main" data-hero="title">
                  {heroChars.map((char, index) => (
                    <span className="hero-char-mask" key={`${char}-${index}`}>
                      <span aria-hidden="true" className="hero-char" data-char="true">
                        {char}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Text Description Column Aside */}
              <div className="hero-content-aside pointer-events-auto" data-hero="content">
                <div className="hero-text-group">
                  <div className="hero-kicker" data-hero="title-min">
                    {MINI_HERO_WORDS.map((word, index) => (
                      <span aria-hidden="true" className="hero-word" data-word="true" key={`${word}-${index}`}>
                        {word}{index < MINI_HERO_WORDS.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hero-scroll-indicator" data-hero="scroll">
                  SCROLL
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <AboutSection
        id="mini-about-section"
        kicker="(Mini House Of Thrill)"
        heading={
          <>
            ADVENTURE <span className="h5 mob-h7">SCALED FOR KIDS</span>
            <span> BUILT FOR FAMILY </span>
            <span className="h5 mob-h7">MEMORIES</span>
          </>
        }
        videoSrc={aboutVideo}
        imageAlt="Children exploring an indoor play environment with immersive lighting."
        paragraphs={[
          "Mini House of Thrill takes the energy, atmosphere, and sensory richness of House of Thrill and reshapes it for younger adventurers.",
          "Every zone is designed for movement, curiosity, and confidence-building, with age-aware challenges, softer edges, and family-first pacing that still feels cinematic.",
          "It is a place where kids can play big, parents can join in, and every visit feels like a shared story instead of just another stop on the weekend circuit.",
        ]}
        closingLine="One mini world. Big reactions. Family-ready thrill."
        stats={[
          {
            value: "3+",
            body: "play formats built for younger explorers, from active zones to puzzle-led adventure rooms.",
          },
          {
            value: "100%",
            body: "family-focused design with safer layouts, guided flow, and confidence-building challenges.",
          },
          {
            value: "3-14",
            body: "sweet-spot age range for independent excitement with room for siblings and parents to jump in too.",
          },
          {
            value: "1",
            body: "premium mini-thrill destination bringing the House of Thrill experience to kids in its own way.",
          },
        ]}
      />

      <AboutTicker />

      <FaqSection
        sectionId="mini-faq-section"
        activeFaq={activeFaq}
        items={MINI_FAQS}
        kicker="(FAQs)"
        title={
          <>
            Questions,<br /> Clearly Answered
          </>
        }
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
    </main>
  );
}

export default MiniPage;
