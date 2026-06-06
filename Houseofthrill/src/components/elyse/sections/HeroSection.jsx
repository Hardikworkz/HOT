import "./hero-section.css";
import { HERO_VIDEO, HERO_WORDS } from "../data.js";
import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";

function HeroSection() {
  const heroChars = "THRILL".split("");
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const chars = gsap.utils.toArray('[data-hero="title"] [data-char="true"]');
      const words = gsap.utils.toArray('[data-hero="title-min"] [data-word="true"]');

      gsap.set(chars, { yPercent: 100 });
      gsap.set(words, { opacity: 0, y: 30, rotationX: -45 });

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
        );
    }, rootRef);

    return () => context.revert();
  }, []);

useEffect(() => {
  const line = document.querySelector('[data-hero="line"]');
  if (!line) return;

  const ctx = gsap.context(() => {
    gsap.to(line, {
      scaleX: 1,
      opacity: 1,
      duration: 1.4,
      ease: "power4.inOut", // Premium architectural ease match
      delay: 0.2
    });
  });

  return () => ctx.revert();
}, []);
  return (
    <section ref={rootRef} className="hero-section">
      <div className="hero-container">
        <div className="hero-layout-wrapper">
          <div className="hero-main-grid">
            
            {/* Main Title */}
            <div className="hero-heading">
            <div className="hero-house-wrap">
              <div
                className="hero hero-house text-white"
                data-hero="house"
              >
                HOUSE OF
              </div>
            </div>        
    <div className="hero-title-main  " data-hero="title">
              
              {heroChars.map((char, index) => (
                <span className="hero-char-mask text-white" key={`${char}-${index}`}>
                  <span aria-hidden="true" className="hero-char" data-char="true">
                    {char}
                  </span>
                </span>
              ))}
            </div>
              </div>
            {/* Content Column */}
            <div className="hero-content-aside" data-hero="content">
              
              <div className="hero-text-group">
                <div className="hero-kicker" data-hero="title-min">
                  {HERO_WORDS.map((word, index) => (
                    <span aria-hidden="true" className="hero-word text-red-500" data-word="true" key={`${word}-${index}`}>
                      {word}{index < HERO_WORDS.length - 1 ? " " : ""}
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

      {/* Background Video */}
      <div className="hero-bg-overlay">
        <div className="hero-video-wrapper" data-hero="img">
          <video
            autoPlay
            className="hero-video"
            loop={false}
            muted
            playsInline
            poster={HERO_VIDEO.poster}
          >
            <source src={HERO_VIDEO.mp4} type="video/mp4" />
            <source src={HERO_VIDEO.webm} type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;