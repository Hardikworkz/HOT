import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import './beliefs-section.css';

gsap.registerPlugin(ScrollTrigger);

export default function BeliefsSection() {
  useEffect(() => {
    const section = document.querySelector(
      '[data-anim="stagger-wrap"].beliefs'
    );

    if (!section) return;

    const cards = Array.from(
      section.querySelectorAll('[data-anim="stagger"]')
    );

    const elements = Array.from(
      section.querySelectorAll('[data-anim="element"]')
    );

    const bgInner = section.querySelector('[data-anim="img-paralax"]');

    const ctx = gsap.context(() => {
      // 1. Pre-set initial states for clean entrance
      gsap.set(cards, {
        opacity: 0,
        y: 40,
        willChange: "transform, opacity"
      });
      gsap.set(elements, {
        opacity: 0,
        y: 20,
        willChange: "transform, opacity"
      });
      gsap.set(bgInner, {
        yPercent: 4,
        scale: 1.04,
        willChange: "transform"
      });

      // 2. Single Unified Timeline for the entire section life-cycle
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom", // Start as soon as it enters viewport
          end: "bottom top",   // End as soon as it leaves
          scrub: 1.2,          // Smoothly follow scroll
        }
      });

      // -- Parallax Layer (Animate over 100% of the scroll duration)
      mainTl.to(bgInner, {
        yPercent: -4,
        ease: "none",
        duration: 1
      }, 0);

      // -- Content Stagger
      mainTl.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out"
      }, 0.1);

      mainTl.to(elements, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out"
      }, 0.2);

    }, section);

    return () => ctx.revert();
  }, []);

const gridItems = [
  {
    id: 1,
    type: 'card',
    number: '(1)',
    title: 'A Rush Like No Other',
    description: '"Absolutely insane experience. The Final Countdown had us panicking in the best way possible. Will be back with a bigger group next time."',
    author: '— Riya S., Bhopal'
  },
  {
    id: 2,
    type: 'card',
    number: '(2)',
    title: 'Perfect Team Outing',
    description: '"Axe throwing was a massive hit for our corporate group. Easy to pick up, incredibly satisfying, and the staff made it seamless."',
    author: '— Karan M., Corporate Group'
  },
  {
    id: 3,
    type: 'empty'
  },
  {
    id: 4,
    type: 'text',
    paragraphs: [
      "At House of Thrill, we believe an experience is only worth having if it demands everything you've got — your focus, your instincts, and your team.",
      "Our mission is simple: to give Bhopal a place where people stop scrolling and start living. Every activity we've built is designed to pull you fully into the moment and leave you with a story worth telling."
    ]
  },
  {
    id: 5,
    type: 'card',
    number: '(3)',
    title: 'Stunning Attention to Detail',
    description: '"Raja Bhoj ka Khazana was breathtaking — the detail in that room is unreal. We didn\'t escape but we\'re already planning a rematch."',
    author: '— Priya & Group, Bhopal'
  },
  {
    id: 6,
    type: 'empty'
  },
  {
    id: 7,
    type: 'card',
    number: '(4)',
    title: 'Best Birthday Plan Ever',
    description: '"Three rooms, axe throwing, VR — everyone left buzzing. House of Thrill delivers every single time."',
    author: '— Arjun T., Bhopal'
  },
  {
    id: 8,
    type: 'card',
    number: '(5)',
    title: 'Built Our Team from the Inside Out',
    description: '"Prison Escape challenged us in ways we didn\'t expect. Immersive, intense, and genuinely thrilling from start to finish."',
    author: '— Sneha R., Indore'
  }
];

  return (
    <section className="elyse-section beliefs" data-anim="stagger-wrap">
      <div className="elyse-bg-overlay" data-anim="img-paralax"></div>
      <div className="heading">(REVIEWS)</div>
      <div className="elyse-grid-scale">
        <div className="elyse-grid">
          {gridItems.map((item) => {
            if (item.type === 'card') {
              return (
                <div
                  key={item.id}
                  className={`grid-cell card-cell card-cell-${item.id}`}
                  data-anim="stagger"
                >
                  <div className="card-scale-shell">
                    <div className="elyse-glass-card">
                      <div className="card-content">
                        <h3 className="card-title">{item.title}</h3>
                        <p className="card-desc">{item.description}</p>
                      </div>
                    </div>
                    <span className="card-number">{item.number}</span>
                  </div>
                </div>
              );
            }

            if (item.type === 'text') {
              return (
                <div key={item.id} className={`grid-cell text-cell text-cell-${item.id}`}>
                  <div className="editorial-text-block">
                    {item.paragraphs.map((para, index) => (
                      <p key={index} data-anim="element">{para}</p>
                    ))}
                  </div>
                </div>
              );
            }

            return <div key={item.id} className={`grid-cell empty-cell empty-cell-${item.id}`}></div>;
          })}
        </div>
      </div>
    </section>
  );
};
