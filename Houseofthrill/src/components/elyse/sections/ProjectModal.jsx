import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useNavigate } from "react-router-dom";
import "./project-modal.css";
import ButtonLabel from "../shared/ButtonLabel.jsx";
import { CloseIcon } from "../shared/Icons.jsx";
import LineReveal from "../shared/LineReveal.jsx";
import { LOGO_URL } from "../data.js";

function ProjectModal({
  animatedArea,
  displayedSlide,
  modalClosing,
  modalInfoRef,
  modalProject,
  modalRef,
  onClose,
  onSlideChange,
  onVisit,
}) {
  const navigate = useNavigate();

  const handleBookVisit = () => {
    onClose();
    // Map project title to activity route
    let activityRoute = 'escape-room';
    const title = (modalProject?.navLabel || modalProject?.titleLines?.join(' ') || '').toLowerCase();
    if (title.includes('escape') || title.includes('prison') || title.includes('bhopal')) activityRoute = 'escape-room';
    else if (title.includes('axe')) activityRoute = 'axe-throwing';
    else if (title.includes('vr') || title.includes('virtual')) activityRoute = 'virtual-reality';
    else if (title.includes('remote') || title.includes('control') || title.includes('rc')) activityRoute = 'rc-truck-controller';

    navigate(`/book/${activityRoute}`);
  };
  if (!modalProject) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className={`modal-shell fixed inset-0 z-[80] ${
        modalClosing ? "is-closing" : "is-open"
      }`}
      role="dialog"
      aria-hidden="false"
      aria-labelledby="modalTitle"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-[rgba(8,8,8,0.64)]" onClick={onClose}></div>

      <div className="modal-content-panel relative z-[2] mx-auto my-2 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] overflow-hidden overflow-y-auto bg-[rgba(12,11,10,0.96)] md:my-8 md:h-[min(94vh,56rem)] md:w-[min(94rem,calc(100vw-2rem))]">
        <div className="relative grid min-h-full gap-8 p-4 md:p-6 xl:grid-cols-[minmax(18rem,28rem)_minmax(0,1fr)]">
          <div className="modal-layout-bg absolute inset-0 border border-[rgba(255,255,255,0.08)]"></div>

          {/* Left Panel Content Wrapper */}
          <div className="relative z-[2] flex flex-col justify-between min-h-full gap-8">
            
            {/* Top & Mid Section Container */}
            <div className="flex flex-col">
              {/* Header: Logo and Close button */}
              <div className="relative flex items-center justify-between pb-4">
                <img alt="ELYSE logo" className="h-[1.625rem] w-[5.875rem]" src={LOGO_URL} />
                <button
                  aria-label="Close the modal window"
                  className="modal-close-btn inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-transparent text-white transition duration-300 hover:rotate-90 hover:border-white hover:bg-[rgba(255,255,255,0.1)]"
                  type="button"
                  onClick={onClose}
                >
                  <span className="inline-flex h-[1.1rem] w-[1.1rem]">
                    <CloseIcon />
                  </span>
                </button>
                <div className="modal-header-line absolute inset-x-0 bottom-0 h-px origin-left bg-[rgba(255,255,255,0.22)]"></div>
              </div>

              {/* Title Section */}
              <div className="modal-title-wrap mt-[1.6rem]">
                <LineReveal
                  as="h2"
                  className="m-0 text-[clamp(2rem,4vw,4rem)] uppercase leading-[0.92] [font-family:var(--font-display)]"
                  id="modalTitle"
                  lines={modalProject.titleLines}
                />
              </div>

              {/* Main Project Description */}
              <div className="modal-description-copy mt-4">
                <p className="m-0 text-[clamp(0.98rem,1vw,1rem)] leading-[1.35] text-[rgba(245,239,230,0.86)] [font-family:var(--font-body)]">
                  {modalProject.description}
                </p>
              </div>

              {/* REFRAMED: Slide details placed safely below description block */}
              <div
                ref={modalInfoRef}
                className="modal-info-panel mt-10 pt-6 border-t border-[rgba(255,255,255,0.08)] grid gap-[0.35rem]"
              >
                <div data-info-fade>
                  <h3 className="m-0 text-[clamp(1.1rem,1.4vw,1.3rem)] uppercase tracking-[0.05em] opacity-80 leading-[0.98] [font-family:var(--font-body)] text-[rgba(245,239,230,0.7)]">
                    {displayedSlide?.label}
                  </h3>
                </div>
                
                <div className="flex items-baseline gap-[0.5rem] my-1" data-info-fade>
                  <div className="text-[clamp(2.8rem,4vw,3.8rem)] leading-[0.9] font-light [font-family:var(--font-display)]">
                    {animatedArea}
                  </div>
                  <div className="text-[0.8rem] uppercase leading-none tracking-[0.08em] text-[rgba(245,239,230,0.5)] [font-family:var(--font-body)]">
                    sq. ft.
                  </div>
                </div>

                <div data-info-fade>
                  <div className="text-[0.95rem] leading-[1.5] text-[rgba(245,239,230,0.65)] [font-family:var(--font-body)]">
                    {displayedSlide?.areaText}
                  </div>
                </div>
              </div>
            </div>

            {/* SEPARATED BOTTOM WRAPPER: Anchors book visit cleanly to the bottom */}
            <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <button
                className="modal-book-btn inline-flex min-h-12 w-full sm:w-fit items-center justify-center rounded-full border border-[rgba(245,239,230,0.44)] px-[1.8rem] py-3 text-[var(--color-text)] transition-colors duration-300 hover:border-[var(--color-surface)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                type="button"
                onClick={handleBookVisit}
              >
                <ButtonLabel>BOOK A VISIT</ButtonLabel>
              </button>
            </div>
          </div>

          {/* Right Panel Slider Track */}
          <div className="modal-slider-panel relative z-[2] min-h-[26rem] overflow-hidden md:min-h-[38rem]">
            <div className="absolute inset-0">
              {modalProject.slides.map((slide) => (
                <div className="modal-bg-image absolute inset-0" key={slide.main}>
                  <img
                    alt={`${modalProject.navLabel} ${slide.label}`}
                    className="h-full w-full object-cover"
                    src={slide.main}
                  />
                </div>
              ))}
            </div>

            <Splide
              aria-label="Photo thumbnails"
              className="modal-thumb-slider absolute inset-x-4 bottom-4 z-[3]"
              key={modalProject.navLabel}
              onMoved={(_, nextIndex) => onSlideChange(nextIndex)}
              options={{
                type: "loop",
                fixedWidth: "6.25rem",
                fixedHeight: "6.25rem",
                gap: "0.375rem",
                pagination: false,
                arrows: true,
                keyboard: "focused",
                drag: true,
                isNavigation: true,
                speed: 400,
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
            >
              {modalProject.slides.map((slide) => (
                <SplideSlide key={slide.thumb}>
                  <img
                    alt={`${slide.label} miniature`}
                    className="h-full w-full object-cover"
                    src={slide.thumb}
                  />
                </SplideSlide>
              ))}
            </Splide>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;