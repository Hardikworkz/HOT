import "./about-section.css";
import aboutImage from "../../../assets/about_main.png" ;


const DEFAULT_STATS = [
  {
    value: "1",
    body: "India's first axe throwing & escape room arena — right here in Bhopal.",
  },
  {
    value: "4",
    body: "premium activities under one roof — axes, escapes, RC, and VR.",
  },
  {
    value: "2-8",
    body: "players per session — because the bigger the group, the bigger the thrill.",
  },
  {
    value: "100%",
    body: "designed for adrenaline — every corner, every game, every moment.",
  },
];

function AboutSection({
  id = "about-section",
  kicker = "(About)",
  heading = (
    <>
      PURE THRILL <span className="h5 mob-h7">AXE-MEETS-ESCAPE</span>
      <span> -BORN IN BHOPAL </span>
    </>
  ),
  imageSrc = aboutImage,
  imageAlt = "House of Thrill interior with premium lighting and rich materials.",
  videoSrc = null,
  paragraphs = [
    "House of Thrill didn't start with a business plan. It started with a question — why does Bhopal not have a place where people can truly let go?",
    "We set out to create something the city had never seen before: India's first arena combining axe throwing with fully immersive escape rooms. Every lane, every room, and every game is designed to demand your full presence — and reward it.",
  ],
  closingLine = "One venue. Four experiences. Zero ordinary.",
  stats = DEFAULT_STATS,
  className = "about relative bg-[var(--color-surface)]",
}) {
  return (
    <section id={id} className={className}>
      <div className="page-padding">
        <div className="container">
          <div className="wrap about-wrap">
            <div className="about-info">
              <div className="about-left">
                <div className="about-heading">
                  <div data-anim="element" className="caption">
                    <div className="about-kicker">{kicker}</div>
                  </div>
                  <h2 data-anim="element" className="subheading h5-glare mob-h7 uppercase">
                    {heading}
                  </h2>
                </div>

                <div className="about-img">
                  {videoSrc ? (
                    <video
                      src={videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      data-anim="img-paralax"
                      className="img-full-cover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={imageSrc}
                      loading="lazy"
                      width="893"
                      height="1376"
                      alt={imageAlt}
                      data-anim="img-paralax"
                      className="img-full-cover"
                    />
                  )}
                  <div data-anim="img-overlay" className="img-overlay"></div>
                </div>
              </div>

              <div className="about-text-box">
                {paragraphs.map((paragraph) => (
                  <p data-anim="element" className="b1" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
                <p data-anim="element" className="one-venue b1 uppercase">
                  {closingLine}
                </p>
              </div>
            </div>

            <div data-anim="stagger-wrap" className="stats">
              <div className="stats-row-1">
                {stats.slice(0, 2).map((item, index) => (
                  <div
                    data-anim="stagger"
                    className={`stats-box stats-box-${index + 1}`}
                    key={`${item.value}-${item.body}`}
                  >
                    <div className="h2 mob-h5">{item.value}</div>
                    <p className="b1 mob-b4">{item.body}</p>
                  </div>
                ))}
              </div>

              <div className="stats-row-2">
                {stats[2] ? (
                  <div data-anim="stagger" className="stats-box stats-box-3">
                    <div className="h2 mob-h5">{stats[2].value}</div>
                    <p className="b1 mob-b4">{stats[2].body}</p>
                  </div>
                ) : null}
              </div>

              <div className="stats-row-3">
                {stats[3] ? (
                  <div data-anim="stagger" className="stats-box stats-box-4">
                    <div className="h2 mob-h5">{stats[3].value}</div>
                    <div className="stats-box-4-text">
                      <p className="b1 mob-b4">{stats[3].body}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
