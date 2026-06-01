import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./faq-section.css";
import { FAQS } from "../data.js";

function FaqSection({
  activeFaq,
  onFaqHover,
  onFaqLeave,
  onFaqToggle,
  touchMode,
  items = FAQS,
  kicker = "(FAQs)",
  title = (
    <>
      Your Questions,<br /> Answered
    </>
  ),
  sectionId = "reviews-section",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Targets the panels via the added 'faq-panel' class
      const panels = gsap.utils.toArray(".faq-panel");
      
      panels.forEach((panel, index) => {
        const isOpen = index === activeFaq;
        
        // GSAP dynamically computes and handles the transition to "auto" height perfectly
        gsap.to(panel, {
          height: isOpen ? "auto" : 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeFaq]);

  return (
    <section 
      id={sectionId}
      ref={containerRef} 
      className="relative overflow-clip bg-[var(--color-surface)] px-[clamp(0.95rem,3.2vw,3rem)] py-[clamp(4.2rem,10vw,7.8rem)]"
    >
      <div className="mx-auto max-w-[104rem]">
        <div className="grid gap-[clamp(2rem,4vw,4rem)]">
          <div className="flex justify-between gap-[0.65rem] ">
            <div className="text-[rgba(245,239,230,0.68)]" data-reveal>
              <div className="main-heading text-[0.88rem] leading-[1.5] [font-family:var(--font-body)]">
                {kicker}
              </div>
            </div>
            <h2
              className="m-0 text-[clamp(2.2rem,7vw,9vw)] uppercase leading-[0.9] [font-family:var(--font-display)]"
              data-reveal
            >
              {title}
            </h2>
          </div>

          <div className="grid gap-0" data-stagger-group>
            {items.map((item, index) => {
              const isOpen = activeFaq === index;

              return (
                <div
                  className={`faq-item relative grid gap-[0.85rem] py-[1.2rem] md:min-h-[clamp(7.25rem,9vw,8.8rem)] md:grid-cols-[minmax(3rem,4rem)_minmax(15rem,1fr)_minmax(20rem,35rem)] md:gap-y-[1.2rem] md:gap-x-[clamp(2rem,4vw,4.6rem)] ${isOpen ? "active" : ""}`}
                  data-stagger-item
                  key={item.question} 
                  // Desktop: Interactive hover zones guarded by touchMode check
                  onMouseEnter={() => !touchMode && onFaqHover(index)}
                  onMouseLeave={() => !touchMode && onFaqLeave()}
                >
                  <div className="pt-[0.45rem] text-[0.88rem] leading-[1.5] tracking-[0.08em] text-[rgba(245,239,230,0.38)] [font-family:var(--font-body)]">
                    {`( ${index + 1} )`}
                  </div>

                  <button
                    aria-expanded={isOpen}
                    className="flex w-full justify-start bg-transparent p-0 text-left md:justify-center md:pl-[10%]"
                    type="button"
                    // Mobile: Click handler active only when touchMode is true
                    onClick={() => touchMode && onFaqToggle(index)}
                  >
                    <h3 className="m-0 w-full text-[clamp(1.5rem,7vw,2.55rem)]  italic leading-[1.02] [font-family:main-font] md:w-[min(100%,25rem)] md:leading-[0.98]">
                      {item.question}
                    </h3>
                  </button>

                  {/* 
                    CRITICAL FIX: Added `faq-panel` for GSAP targeting and `style={{ height: 0 }}` 
                    to bypass initial state sync lag. 
                  */}
                  <div 
                    className={`faq-panel overflow-hidden ${touchMode ? "faq-mobile-panel" : ""}`}
                    style={{ height: 0 }}
                  >
                    <div className="faq-panel-copy max-w-[35rem] pt-1 text-white">
                      <p className="m-0 text-[clamp(0.98rem,1.05vw,1.05rem)] leading-[1.55] [font-family:var(--font-body)] font-[450]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
