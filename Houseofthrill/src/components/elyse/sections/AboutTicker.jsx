import "./about-ticker.css";

/**
 * Ticker image data — 4 items with alternating regular / small sizing.
 * Each item has src, srcSet, alt, and a `small` flag for the is--small variant.
 */
const TICKER_IMAGES = [
  {
    src: "https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3b0202b2d312f5d46f_Frame%20147.avif",
    srcSet:
      "https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3b0202b2d312f5d46f_Frame%20147-p-500.avif 500w, https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3b0202b2d312f5d46f_Frame%20147-p-800.avif 800w, https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3b0202b2d312f5d46f_Frame%20147.avif 816w",
    alt: "Bride in white gown holding red rose bouquet and groom in black tuxedo standing on stone path outdoors.",
    small: false,
  },
  {
    src: "https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3b26ca1b096a6eda7c_Frame%2098.avif",
    srcSet:
      "https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3b26ca1b096a6eda7c_Frame%2098-p-500.avif 500w, https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3b26ca1b096a6eda7c_Frame%2098-p-800.avif 800w, https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3b26ca1b096a6eda7c_Frame%2098.avif 816w",
    alt: "DJ wearing headphones stands behind a white DJ console with laptop and mixer outdoors at night.",
    small: true,
  },
  {
    src: "https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3bfd4346c3a790d01a_Frame%20143.avif",
    srcSet:
      "https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3bfd4346c3a790d01a_Frame%20143-p-500.avif 500w, https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3bfd4346c3a790d01a_Frame%20143-p-800.avif 800w, https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3bfd4346c3a790d01a_Frame%20143.avif 816w",
    alt: "Bride and groom joyfully dancing together indoors near open doors with string lights and outdoor patio visible.",
    small: false,
  },
  {
    src: "https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3bd7bea7f2504f39de_Frame%20142.avif",
    srcSet:
      "https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3bd7bea7f2504f39de_Frame%20142-p-500.avif 500w, https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3bd7bea7f2504f39de_Frame%20142-p-800.avif 800w, https://cdn.prod.website-files.com/68d563f4fd5681015e6537de/692cce3bd7bea7f2504f39de_Frame%20142.avif 816w",
    alt: "Bride in a white floral lace wedding dress wearing a white cowboy hat with 'BRIDE' written on it, dancing at a party with other people.",
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
      {TICKER_IMAGES.map((image, index) => (
        <div className="about-ticker__item" key={index}>
          <div
            className={`about-ticker__img-wrap${image.small ? " is--small" : ""}`}
          >
            <div className="about-ticker__img">
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes="(max-width: 816px) 100vw, 816px"
                loading="eager"
                alt={image.alt}
                className="img-cover"
              />
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
