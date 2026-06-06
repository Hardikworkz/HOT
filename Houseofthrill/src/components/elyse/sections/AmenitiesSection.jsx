import { useNavigate } from "react-router-dom";
import "./amenities-section.css";
import { AMENITIES } from "../data.js";
import LineReveal from "../shared/LineReveal.jsx";

function AmenitiesSection() {
  const navigate = useNavigate();

  const handleBookExperience = (amenityIndex) => {
     const amenity = AMENITIES[amenityIndex];
    let activityRoute = 'escape-room'; // default
    
    if (amenity?.titleLines) {
      const title = amenity.titleLines.join(' ').toLowerCase(); 
       if (title.includes('axe')) activityRoute = 'axe-throwing';
      else if (title.includes('vr') || title.includes('virtual')) activityRoute = 'virtual-reality';
      else if (title.includes('rc') || title.includes('truck') || title.includes('remote') || title.includes('control')) activityRoute = 'rc-truck-controller';
    }
    
    navigate(`/book/${activityRoute}`);
  };

  return (
    <section id="activities-section" className="amenities">
      <div className="page-padding">
        <div className="container">
          <div
            className="anim-track"
            data-amenities-anim="track"
            style={{
              "--amenities-track-height": `${AMENITIES.length * 130}vh`,
            }}
          >
            <div
              className="wrap amenities-wrap"
              data-amenities-anim="sticky"
            >
              <div className="heading-amen">(ACTIVITIES)</div>

              <div
                data-amenities-anim="images-container"
                className="amenities-images-container"
              >
                {/* BIG IMAGES */}
                <div className="amenities-images-big">
                  {AMENITIES.map((item, index) => (
                    <div
                      key={`big-${item.bigImage}`}
                      data-amenities-anim="big-image"
                      data-amenities-big-card={index}
                      className={`amenities-slide-imgs${
                        index === 0 ? " is-first" : ""
                      }`}
                    >
                      <img
                        alt={item.titleLines.join(" ")}
                        className="img-full-cover"
                        loading="lazy"
                        src={item.bigImage}
                      />
                    </div>
                  ))}
                </div>

                {/* SMALL IMAGES */}
                <div className="amenities-images-small">
                  {AMENITIES.map((item, index) => (
                    <div
                      key={`small-${item.smallImage}`}
                      data-amenities-anim="small-image"
                      data-amenities-small-card={index}
                      className={`amenities-slide-img-inner${
                        index === 0 ? " is-first" : ""
                      }`}
                    >
                      <img
                        alt={item.titleLines.join(" ")}
                        className="img-full-cover"
                        loading="lazy"
                        src={item.smallImage}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* TEXT CONTENT */}
              <div className="amenities-copy-column amenities-texts-container">
                <div className="amenities-progress" aria-hidden="true">
                  <div className="amenities-progress-line"></div>
                </div>

                <div className="amenities-copy-stack amenities-slide-copy">
                  {AMENITIES.map((item, index) => {
                    const isActive = index === 0;

                    return (
                      <article
                        key={item.titleLines.join("-")}
                        aria-hidden={isActive ? "false" : "true"}
                        data-amenities-slide={index}
                        className={`amenities-slide amenities-slide-box${
                          isActive ? " is-active" : " is-hidden"
                        }${index === 0 ? " is-first" : ""}`}
                      >
                        <LineReveal
                          align="left"
                          as="h2"
                          aria-label={item.titleLines.join(" ")}
                          className="h5 mob-h6 amenities-title"
                          data-amenities-anim="title"
                          lines={item.titleLines}
                        />

                        <div className="amenities-slide-text">
                          <LineReveal
                            align="left"
                            as="p"
                            aria-label={item.textLines.join(" ")}
                            className="b1 amenities-paragraph"
                            data-amenities-anim="text"
                            lines={item.textLines}
                          />
                        </div>
                      </article>
                    );
                  })}
                </div>

                <button
                  className="amenities-action-btn amenities-action-btn--static"
                  onClick={() => handleBookExperience(0)}
                >
                  BOOK YOUR EXPERIENCE
                </button>
              </div>

              {/* SCROLL TRIGGERS */}
              <div
                data-amenities-anim="triggers"
                className="amenities-triggers"
                aria-hidden="true"
              >
                {AMENITIES.map((item) => (
                  <div
                    key={`trigger-${item.bigImage}`}
                    data-amenities-anim="trigger"
                    className="amenities-trigger"
                  ></div>
                ))}

                <div className="amenities-trigger is-last"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AmenitiesSection;