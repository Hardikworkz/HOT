import "./about-ticker.css";
import miniVideoOne from "../../../assets/mini_1.mp4";
import miniVideoTwo from "../../../assets/mini_2.mp4";
import miniVideoThree from "../../../assets/mini_3.mp4";
import miniImageOne from "../../../assets/mini_11.jpg";
import miniImageTwo from "../../../assets/mini_22.jpg";
import miniImageThree from "../../../assets/mini_33.jpg";

/**
 * Ticker media data — large frames are looping videos and small frames are stills.
 */
const TICKER_MEDIA = [
  {
    type: "video",
    src: miniVideoOne,
    poster: miniImageOne,
    alt: "Guests enjoying a premium experience at House of Thrill.",
    small: false,
  },
  {
    type: "image",
    src: miniImageOne,
    alt: "House of Thrill gallery still.",
    small: true,
  },
  {
    type: "video",
    src: miniVideoTwo,
    poster: miniImageTwo,
    alt: "Immersive activity highlight from House of Thrill.",
    small: false,
  },
  {
    type: "image",
    src: miniImageTwo,
    alt: "House of Thrill featured still.",
    small: true,
  },
  {
    type: "video",
    src: miniVideoThree,
    poster: miniImageThree,
    alt: "House of Thrill video showcase.",
    small: false,
  },
  {
    type: "image",
    src: miniImageThree,
    alt: "House of Thrill atmosphere still.",
    small: true,
  },
];

/**
 * Renders a single list of ticker items. Used twice (duplicated) inside
 * the track to create the infinite seamless scroll.
 */
function TickerList() {
  return (
    <div className="about-ticker-list">
      {TICKER_MEDIA.map((item, index) => (
        <div className="about-ticker__item" key={index}>
          <div
            className={`about-ticker__img-wrap${item.small ? " is--small" : ""}`}
          >
            <div className="about-ticker__img">
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  aria-label={item.alt}
                  className="media-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.src}
                  loading="eager"
                  alt={item.alt}
                  className="media-cover"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * AboutTicker — Infinite, continuous horizontal marquee scroll.
 *
 * Two identical <TickerList /> components are placed side-by-side inside
 * a flex track. Both lists share the same CSS `marquee-scroll` animation
 * which translates them -100% on the X axis at a constant (linear) speed.
 *
 * When the first list scrolls completely off-screen to the left, the
 * second list has moved into the exact starting position of the first,
 * and the animation loops — creating a perfectly seamless, gap-free,
 * pause-free infinite scroll.
 */
function AboutTicker() {
  return (
    <div className="about-ticker" aria-label="Image gallery marquee">
      <div className="about-ticker__track">
        {/* List 1 — the "original" */}
        <TickerList />
        {/* List 2 — identical duplicate for seamless looping */}
        <TickerList />
      </div>
    </div>
  );
}

export default AboutTicker;
